"""
StudyFlow Python Agent Service
FastAPI service orchestrating StudyFlowAcademicAgent via Google Agent Development Kit (google-adk) Runner.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .models import AgentEventRequest, AgentExecutionResult
from .agent import (
    execute_adk_workflow,
    is_adk_configured,
    HAS_ADK,
    HAS_GENAI,
    adk_agent,
    adk_runner
)
from .repository import repo
from . import tools

load_dotenv()

app = FastAPI(
    title="StudyFlow Google ADK Service",
    description="Autonomous Academic Operations Agent Service powered by Google Agent Development Kit (ADK)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """
    Health check endpoint reporting:
    - adkConfigured (True ONLY if google-adk is importable, Agent is created, and Runner is initialized)
    - geminiConfigured
    - toolCount
    - agentName
    """
    is_fully_configured = bool(is_adk_configured and adk_agent is not None and adk_runner is not None)
    active_model = os.getenv("GEMINI_MODEL", "gemini-3.7-flash")
    
    return {
        "status": "healthy",
        "service": "StudyFlow Academic Operations Service",
        "adkConfigured": is_fully_configured,
        "geminiConfigured": bool(os.getenv("GEMINI_API_KEY")),
        "geminiModel": active_model,
        "toolCount": len(tools.ALL_STUDYFLOW_TOOLS),
        "agentName": "StudyFlowAcademicAgent",
        "adkPackage": "google-adk",
        "hasGenAI": HAS_GENAI,
        "environmentDetails": {
            "adkImportable": HAS_ADK,
            "agentInitialized": adk_agent is not None,
            "runnerInitialized": adk_runner is not None,
            "defaultModel": active_model,
            "registeredTools": [t.__name__ for t in tools.ALL_STUDYFLOW_TOOLS]
        }
    }


@app.post("/api/agent/event", response_model=AgentExecutionResult)
async def handle_event(event: AgentEventRequest):
    """
    Handles academic events via official Google ADK Runner (run_async).
    Lets the ADK Agent dynamically decide which tools to call.
    """
    if not (is_adk_configured and adk_runner):
        raise HTTPException(
            status_code=503,
            detail="Google ADK agent service is unavailable."
        )

    try:
        task_id = event.taskId or (repo.tasks[0].id if repo.tasks else None)
        result = await execute_adk_workflow(
            event_type=event.eventType,
            task_id=task_id,
            state=event.state
        )
        return result
    except RuntimeError as re:
        raise HTTPException(status_code=503, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agent/test-execution")
async def test_execution():
    """
    Development test endpoint executing a real ADK request through the Runner
    and confirming tool calls.
    """
    if not (is_adk_configured and adk_runner):
        raise HTTPException(
            status_code=503,
            detail="Google ADK agent service is unavailable."
        )

    try:
        sample_task_id = repo.tasks[0].id if repo.tasks else "task_phy_1"
        result = await execute_adk_workflow(
            event_type="student_missed_task",
            task_id=sample_task_id
        )
        return {
            "status": "success",
            "message": "ADK Runner executed successfully",
            "toolCallsCount": len(result.toolCalls),
            "toolNamesExecuted": [tc.toolName for tc in result.toolCalls],
            "executionResult": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ADK Test execution error: {str(e)}")


@app.post("/api/agent/tool/{tool_name}")
def call_tool(tool_name: str, payload: dict):
    """
    Direct invocation endpoint for any of the 15 agent tools.
    """
    if tool_name == "get_progress":
        return tools.get_progress()
    elif tool_name == "detect_risk":
        return tools.detect_risk()
    elif tool_name == "get_tasks":
        return tools.get_tasks(
            plan_id=payload.get("planId"),
            status=payload.get("status"),
            subject_id=payload.get("subjectId"),
            date_str=payload.get("date")
        )
    elif tool_name == "get_subjects":
        return tools.get_subjects()
    elif tool_name == "get_exams":
        return tools.get_exams()
    elif tool_name == "get_student_profile":
        return tools.get_student_profile()
    elif tool_name == "reschedule_task":
        return tools.reschedule_task(
            task_id=payload.get("taskId", ""),
            new_date=payload.get("newDate", ""),
            new_start_time=payload.get("newStartTime", "16:00"),
            reason=payload.get("reason", "Autonomous adjustment")
        )
    elif tool_name == "mark_task_missed":
        return tools.mark_task_missed(payload.get("taskId", ""))
    elif tool_name == "complete_task":
        return tools.complete_task(payload.get("taskId", ""))
    elif tool_name == "create_task":
        return tools.create_task(
            plan_id=payload.get("planId", "plan_1"),
            subject_id=payload.get("subjectId", ""),
            subject_name=payload.get("subjectName", ""),
            topic_title=payload.get("topicTitle", ""),
            date_str=payload.get("date", ""),
            duration_minutes=payload.get("durationMinutes", 60),
            priority=payload.get("priority", "medium"),
            difficulty=payload.get("difficulty", "medium"),
            start_time=payload.get("startTime", "09:00")
        )
    elif tool_name == "save_agent_action":
        return tools.save_agent_action(
            agent_module=payload.get("agentModule", "operations"),
            tool_name=payload.get("toolName", "autonomous_action"),
            title=payload.get("title", "Action Log"),
            description=payload.get("description", ""),
            payload=payload.get("payload", {}),
            affected_task_ids=payload.get("affectedTaskIds", [])
        )
    elif tool_name == "create_notification":
        return tools.create_notification(
            notif_type=payload.get("type", "schedule_update"),
            title=payload.get("title", "Notice"),
            message=payload.get("message", ""),
            priority=payload.get("priority", "medium"),
            related_subject_id=payload.get("relatedSubjectId")
        )
    elif tool_name == "analyze_syllabus":
        return tools.analyze_syllabus(
            content=payload.get("content"),
            target_subject_name=payload.get("targetSubjectName")
        )
    elif tool_name == "create_study_plan":
        return tools.create_study_plan(
            user_id=payload.get("userId", "user_1"),
            plan_title=payload.get("planTitle", "Study Plan"),
            available_hours_per_day=payload.get("availableHoursPerDay", 3.5)
        )
    else:
        raise HTTPException(status_code=404, detail=f"Tool {tool_name} not found.")
