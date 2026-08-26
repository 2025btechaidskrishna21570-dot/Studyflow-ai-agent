"""
StudyFlow Academic Operations Agent
Powered by Google Agent Development Kit (google-adk) and Google GenAI SDK.

Uses official Google ADK Agent, Runner, and InMemorySessionService.
All tool selection, scheduling, and risk evaluations are dynamically decided
by the ADK Agent through model-driven tool execution (Runner.run_async).
"""

import os
import json
from datetime import datetime, date
from typing import Dict, Any, List, Optional
from .models import AgentExecutionResult, ToolCallTrace
from .repository import repo
from . import tools

# Official Google ADK Imports
HAS_ADK = False
AdkAgent = None
AdkRunner = None
InMemorySessionService = None
genai_types = None

try:
    from google.adk.agents import Agent as AdkAgent  # type: ignore
    from google.adk.runners import Runner as AdkRunner  # type: ignore
    from google.adk.sessions import InMemorySessionService  # type: ignore
    from google.genai import types as genai_types  # type: ignore
    HAS_ADK = True
except Exception as e:
    HAS_ADK = False
    print(f"Notice: Google ADK import status: {e}")

try:
    from google import genai
    HAS_GENAI = True
except Exception:
    HAS_GENAI = False


AGENT_SYSTEM_INSTRUCTION = """You are the StudyFlow Autonomous Academic Operations Agent.
Your responsibility is to manage student study plans, monitor academic risk, and autonomously rebalance schedules when tasks are missed, delayed, or deadlines approach.

You have access to 15 real academic tools:
1. get_student_profile(): Retrieves daily study capacity (hours/day), preferred study times, CGPA goals.
2. get_subjects(): Retrieves enrolled courses, confidence ratings (1-5), and completed hours.
3. get_exams(): Retrieves upcoming exams, milestones, target scores, and days remaining.
4. get_tasks(plan_id, status, subject_id, date_str): Lists tasks with optional filters.
5. get_progress(): Calculates completion rate, hours logged, study streaks, and per-subject breakdown.
6. detect_risk(): Calculates academic risk score (0-100) and risk levels per subject.
7. create_task(...): Schedules a new study task.
8. update_task(task_id, updates): Updates task properties.
9. complete_task(task_id): Marks a study task completed.
10. mark_task_missed(task_id): Marks an overdue task missed.
11. reschedule_task(task_id, new_date, new_start_time, reason): Autonomously reschedules a task to a specific date and time based on student exam proximity and daily capacity.
12. save_agent_action(agent_module, tool_name, title, description, payload, affected_task_ids): Records structured agent decision to the audit log.
13. create_notification(notif_type, title, message, priority, related_subject_id): Dispatches an alert to the student dashboard.
14. analyze_syllabus(content, target_subject_name): Decomposes syllabus into topics and hours.
15. create_study_plan(user_id, plan_title, available_hours_per_day): Creates a multi-day plan.

When you receive a student event (such as a missed task or rebalance request):
1. Understand the student's current situation using the provided context or by querying tools.
2. If a task was missed, mark it as missed using mark_task_missed.
3. Evaluate the academic risk impact using detect_risk().
4. Inspect the upcoming workload and exam proximity. Decide whether and when to reschedule the task so that daily study limits (e.g. availableHoursPerDay) are respected and nearest exams are protected.
5. If rescheduling is needed, call reschedule_task with the calculated new date, start time, and reason.
6. Record your autonomous decision in the audit trail with save_agent_action.
7. Notify the student with a clear, supportive message using create_notification.
8. Provide a concise, professional summary explaining your pedagogical rationale and actions taken.
"""


def initialize_adk_components():
    """
    Initializes the Google ADK Agent, InMemorySessionService, and Runner.
    Returns (agent, session_service, runner, is_configured).
    """
    if not HAS_ADK:
        return None, None, None, False

    try:
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.7-flash")
        agent = AdkAgent(
            name="StudyFlowAcademicAgent",
            model=model_name,
            instruction=AGENT_SYSTEM_INSTRUCTION,
            tools=tools.ALL_STUDYFLOW_TOOLS
        )
        session_service = InMemorySessionService()
        
        # Initialize Runner
        try:
            runner = AdkRunner(
                agent=agent,
                session_service=session_service,
                app_name="studyflow"
            )
        except TypeError:
            runner = AdkRunner(
                agent=agent,
                session_service=session_service
            )

        return agent, session_service, runner, True
    except Exception as e:
        print(f"Error initializing ADK Agent/Runner: {e}")
        return None, None, None, False


adk_agent, adk_session_service, adk_runner, is_adk_configured = initialize_adk_components()


def build_event_prompt(event_type: str, task_id: Optional[str] = None, additional_context: Optional[str] = None) -> str:
    """
    Builds a comprehensive, rich context prompt for the ADK agent.
    Includes student profile, subjects, exams, current workload, and event details.
    """
    user_prof = repo.user.model_dump()
    subjects_list = [s.model_dump() for s in repo.subjects]
    exams_list = [e.model_dump() for e in repo.exams]
    tasks_list = [t.model_dump() for t in repo.tasks]

    prompt_payload = {
        "event": {
            "type": event_type,
            "targetTaskId": task_id,
            "timestamp": datetime.utcnow().isoformat(),
            "note": additional_context or "Autonomous academic event triggered."
        },
        "studentContext": {
            "profile": user_prof,
            "enrolledSubjects": subjects_list,
            "upcomingExams": exams_list,
            "currentScheduledTasks": tasks_list,
            "dailyAvailableHours": user_prof.get("availableHoursPerDay", 3.5),
            "preferredStudyTimes": user_prof.get("preferredStudyTimes", ["evening"])
        },
        "instructions": (
            f"Process the event '{event_type}'. "
            "Inspect the student's workload, exam deadlines, and daily capacity. "
            "Use your registered tools to take appropriate actions (e.g. mark missed, detect risk, "
            "calculate optimal slot, reschedule task, record audit action, and dispatch notification). "
            "Provide a concise summary of the decisions made."
        )
    }
    return json.dumps(prompt_payload, indent=2)


async def execute_adk_workflow(
    event_type: str,
    task_id: Optional[str] = None,
    user_id: str = "user_krishna",
    state: Optional[Dict[str, Any]] = None
) -> AgentExecutionResult:
    """
    Executes the StudyFlowAcademicAgent via official Google ADK Runner (run_async).
    Captures model tool calls, tool results, and final agent response into ToolCallTrace records.
    """
    if state:
        repo.sync_from_state(state)

    if not is_adk_configured or not adk_runner or not adk_session_service:
        raise RuntimeError("Google ADK agent service is unavailable.")

    session_id = f"session_{user_id}"

    # Get or create ADK session
    try:
        session = await adk_session_service.get_session(app_name="studyflow", user_id=user_id, session_id=session_id)
        if not session:
            session = await adk_session_service.create_session(app_name="studyflow", user_id=user_id, session_id=session_id)
    except Exception:
        try:
            session = await adk_session_service.create_session(user_id=user_id, session_id=session_id)
        except Exception:
            pass

    prompt_text = build_event_prompt(event_type, task_id)
    
    # Construct Content object using google.genai.types
    if genai_types:
        new_message = genai_types.Content(
            role="user",
            parts=[genai_types.Part.from_text(text=prompt_text)]
        )
    else:
        new_message = prompt_text

    tool_traces: List[ToolCallTrace] = []
    final_response_texts: List[str] = []
    initial_actions_count = len(repo.actions)
    initial_notifs_count = len(repo.notifications)

    # Execute ADK Runner asynchronously
    async for event in adk_runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=new_message
    ):
        now_str = datetime.utcnow().isoformat()
        
        # 1. Check for function calls
        fn_calls = []
        if hasattr(event, "get_function_calls") and callable(event.get_function_calls):
            fn_calls = event.get_function_calls() or []
        elif hasattr(event, "content") and event.content and hasattr(event.content, "parts"):
            for part in event.content.parts:
                if hasattr(part, "function_call") and part.function_call:
                    fn_calls.append(part.function_call)

        for fc in fn_calls:
            fn_name = getattr(fc, "name", str(fc))
            fn_args = getattr(fc, "args", {})
            if isinstance(fn_args, str):
                try:
                    fn_args = json.loads(fn_args)
                except Exception:
                    pass
            
            tool_traces.append(ToolCallTrace(
                agentName="StudyFlowAcademicAgent",
                toolName=fn_name,
                input=fn_args if isinstance(fn_args, dict) else {"raw": str(fn_args)},
                result={"status": "executed by ADK Runner"},
                timestamp=now_str
            ))

        # 2. Check for function responses / results
        fn_responses = []
        if hasattr(event, "get_function_responses") and callable(event.get_function_responses):
            fn_responses = event.get_function_responses() or []
        elif hasattr(event, "content") and event.content and hasattr(event.content, "parts"):
            for part in event.content.parts:
                if hasattr(part, "function_response") and part.function_response:
                    fn_responses.append(part.function_response)

        for fr in fn_responses:
            resp_name = getattr(fr, "name", "tool_result")
            resp_data = getattr(fr, "response", {})
            # Update matching trace if exists
            matched = False
            for trace in reversed(tool_traces):
                if trace.toolName == resp_name and trace.result.get("status") == "executed by ADK Runner":
                    trace.result = resp_data if isinstance(resp_data, dict) else {"response": str(resp_data)}
                    matched = True
                    break
            if not matched:
                tool_traces.append(ToolCallTrace(
                    agentName="StudyFlowAcademicAgent",
                    toolName=resp_name,
                    input={},
                    result=resp_data if isinstance(resp_data, dict) else {"response": str(resp_data)},
                    timestamp=now_str
                ))

        # 3. Collect final user-facing text parts
        if hasattr(event, "content") and event.content and hasattr(event.content, "parts"):
            for part in event.content.parts:
                if hasattr(part, "text") and part.text:
                    final_response_texts.append(part.text)

    # Gather updated state from repository
    updated_risk = tools.detect_risk()
    updated_progress = tools.get_progress()
    new_actions = repo.actions[:max(0, len(repo.actions) - initial_actions_count)]
    new_notifs = repo.notifications[:max(0, len(repo.notifications) - initial_notifs_count)]

    full_message = " ".join(final_response_texts).strip() or "Google ADK Agent completed autonomous schedule rebalancing."

    return AgentExecutionResult(
        success=True,
        action="adk_runner_execution",
        reason="Google ADK StudyFlowAcademicAgent executed via Runner.run_async() with model-driven tool calling.",
        toolCalls=tool_traces,
        updatedTasks=repo.tasks,
        updatedRisk=updated_risk,
        updatedProgress=updated_progress,
        newNotifications=new_notifs,
        newActions=new_actions,
        message=full_message,
        isDemoMode=not bool(os.getenv("GEMINI_API_KEY"))
    )
