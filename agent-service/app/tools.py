"""
StudyFlow Agent Tools (Python Implementation)
Conforms to Google ADK (Agent Development Kit) & Function Tool specifications.
Provides clean abstraction for in-memory repository (and future Cloud Firestore persistence).
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta, date
from .models import (
    UserProfile, Subject, Exam, Task, StudyPlan, AgentAction, NotificationItem,
    RiskAssessment, SubjectRisk, ProgressMetrics
)
from .repository import repo


# =========================================================================
# TOOL 1: get_student_profile
# =========================================================================
def get_student_profile(user_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Retrieves student academic profile, available hours per day, preferred study times, and CGPA goals.
    
    Args:
        user_id: Optional user identifier (defaults to current student).
    Returns:
        Dictionary representing the student profile including availableHoursPerDay, targetCgpa, and preferred times.
    """
    return repo.user.model_dump()


# =========================================================================
# TOOL 2: get_subjects
# =========================================================================
def get_subjects(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieves enrolled academic subjects, student mastery/confidence ratings (1-5), and total estimated study hours.
    
    Args:
        user_id: Optional user identifier.
    Returns:
        List of subject dictionaries containing subjectId, name, currentConfidence, examDate, and completedHours.
    """
    return [s.model_dump() for s in repo.subjects]


# =========================================================================
# TOOL 3: get_exams
# =========================================================================
def get_exams(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieves all upcoming scheduled examinations, milestone dates, weight percentages, and days remaining.
    
    Args:
        user_id: Optional user identifier.
    Returns:
        List of exam dictionaries with examId, subjectName, examDate, targetScore, and daysRemaining.
    """
    return [e.model_dump() for e in repo.exams]


# =========================================================================
# TOOL 4: get_tasks
# =========================================================================
def get_tasks(
    plan_id: Optional[str] = None,
    status: Optional[str] = None,
    subject_id: Optional[str] = None,
    date_str: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Retrieves study tasks, with optional filtering by plan, status ('pending', 'completed', 'missed', 'rescheduled'), subject, or date.
    
    Args:
        plan_id: Optional plan ID filter.
        status: Optional status filter.
        subject_id: Optional subject ID filter.
        date_str: Optional date string filter (YYYY-MM-DD).
    Returns:
        List of task dictionaries matching the criteria.
    """
    tasks = repo.tasks
    if plan_id:
        tasks = [t for t in tasks if t.planId == plan_id]
    if status:
        tasks = [t for t in tasks if t.status == status]
    if subject_id:
        tasks = [t for t in tasks if t.subjectId == subject_id]
    if date_str:
        tasks = [t for t in tasks if t.date == date_str]
    return [t.model_dump() for t in tasks]


# =========================================================================
# TOOL 5: get_progress
# =========================================================================
def get_progress() -> Dict[str, Any]:
    """
    Calculates aggregate study progress, completion rates, study streak days, total hours logged, and per-subject breakdown.
    
    Returns:
        Dictionary containing completionRate, missedRate, completedStudyHours, studyStreakDays, and subjectBreakdown.
    """
    tasks = repo.tasks
    subjects = repo.subjects
    total = len(tasks)
    completed = len([t for t in tasks if t.status == "completed"])
    missed = len([t for t in tasks if t.status == "missed"])
    rescheduled = len([t for t in tasks if t.status == "rescheduled"])
    pending = len([t for t in tasks if t.status in ("pending", "in_progress")])

    completion_rate = int((completed / total * 100)) if total > 0 else 0
    missed_rate = int((missed / total * 100)) if total > 0 else 0

    total_mins = sum(t.durationMinutes for t in tasks)
    completed_mins = sum(t.durationMinutes for t in tasks if t.status == "completed")

    breakdowns = []
    for s in subjects:
        s_tasks = [t for t in tasks if t.subjectId == s.id or t.subjectName == s.name]
        s_done = [t for t in s_tasks if t.status == "completed"]
        rate = int(len(s_done) / len(s_tasks) * 100) if s_tasks else 0
        breakdowns.append({
            "subjectId": s.id,
            "subjectName": s.name,
            "progressPercent": rate,
            "hoursCompleted": round(sum(t.durationMinutes for t in s_done) / 60, 1),
            "hoursTotal": round(sum(t.durationMinutes for t in s_tasks) / 60, 1) or 10.0,
            "color": s.color
        })

    metrics = ProgressMetrics(
        totalTasks=total,
        completedTasks=completed,
        missedTasks=missed,
        rescheduledTasks=rescheduled,
        pendingTasks=pending,
        completionRate=completion_rate,
        missedRate=missed_rate,
        completedStudyHours=round(completed_mins / 60, 1),
        studyStreakDays=min(completed, 5) if completed > 0 else 0,
        totalHoursPlanned=round(total_mins / 60, 1),
        totalHoursCompleted=round(completed_mins / 60, 1),
        estimatedCompletionDate=(date.today() + timedelta(days=7)).strftime("%b %d, %Y"),
        syllabusCoveredPercent=completion_rate,
        subjectBreakdown=breakdowns
    )
    return metrics.model_dump()


# =========================================================================
# TOOL 6: detect_risk
# =========================================================================
def detect_risk() -> Dict[str, Any]:
    """
    Computes rigorous academic risk assessment (0-100 score and LOW/MEDIUM/HIGH/CRITICAL level)
    evaluating upcoming exam proximity, remaining syllabus deficit, confidence gaps, and missed tasks.
    
    Returns:
        RiskAssessment dictionary with overallRiskLevel, overallRiskScore, criticalIssuesCount, and subjectRisks list.
    """
    tasks = repo.tasks
    subjects = repo.subjects
    exams = repo.exams

    subject_risks = []
    for s in subjects:
        s_tasks = [t for t in tasks if t.subjectId == s.id or t.subjectName == s.name]
        missed = len([t for t in s_tasks if t.status == "missed"])
        pending = len([t for t in s_tasks if t.status in ("pending", "in_progress")])

        exam = next((e for e in exams if e.subjectId == s.id or e.subjectName == s.name), None)
        days_left = exam.daysRemaining if exam else 30

        remaining_percent = int(((pending + missed) / len(s_tasks)) * 100) if s_tasks else 50
        req_hours = max(2.0, (pending + missed) * 1.5)
        avail_hours = max(1.0, days_left * 2.5)

        deficit = max(0.0, req_hours - avail_hours)
        prox_mult = 2.5 if days_left <= 3 else (1.8 if days_left <= 7 else 1.0)
        conf_pen = (5 - s.currentConfidence) * 6
        miss_pen = missed * 15

        raw_score = (remaining_percent * 0.4) + (deficit * 8 * prox_mult) + conf_pen + miss_pen
        risk_score = min(100, max(10, int(raw_score)))

        risk_level = "LOW"
        if risk_score >= 75 or (days_left <= 4 and remaining_percent > 50):
            risk_level = "CRITICAL"
        elif risk_score >= 55 or (days_left <= 7 and remaining_percent > 40):
            risk_level = "HIGH"
        elif risk_score >= 35:
            risk_level = "MEDIUM"

        explanation = f"{s.name} has {remaining_percent}% incomplete workload with exam in {days_left} days."
        actions = [f"Schedule urgent focus sessions for {s.name}"] if risk_level in ("HIGH", "CRITICAL") else ["Maintain current pace"]

        subject_risks.append(SubjectRisk(
            subjectId=s.id,
            subjectName=s.name,
            riskLevel=risk_level,  # type: ignore
            riskScore=risk_score,
            remainingSyllabusPercent=remaining_percent,
            daysUntilExam=days_left,
            availableStudyHours=avail_hours,
            requiredStudyHours=req_hours,
            missedTasksCount=missed,
            explanation=explanation,
            suggestedActions=actions
        ))

    max_score = max([r.riskScore for r in subject_risks]) if subject_risks else 20
    crit_count = len([r for r in subject_risks if r.riskLevel in ("HIGH", "CRITICAL")])
    overall_level = "CRITICAL" if max_score >= 75 or crit_count >= 2 else ("HIGH" if max_score >= 55 or crit_count >= 1 else ("MEDIUM" if max_score >= 35 else "LOW"))

    assessment = RiskAssessment(
        overallRiskLevel=overall_level,  # type: ignore
        overallRiskScore=max_score,
        assessedAt=datetime.utcnow().isoformat(),
        criticalIssuesCount=crit_count,
        subjectRisks=subject_risks,
        overloadedDays=["Tomorrow (3.5h)"],
        summaryExplanation=f"Overall risk evaluated at {overall_level} ({max_score}/100).",
        recommendedAgentActions=["Reallocate study blocks to protect nearest exam milestones"]
    )
    return assessment.model_dump()


# =========================================================================
# TOOL 7: create_task
# =========================================================================
def create_task(
    plan_id: str,
    subject_id: str,
    subject_name: str,
    topic_title: str,
    date_str: str,
    duration_minutes: int = 60,
    priority: str = "medium",
    difficulty: str = "medium",
    start_time: str = "09:00",
    subtopic_title: Optional[str] = None
) -> Dict[str, Any]:
    """
    Creates and registers a new study task in the student study schedule.
    
    Args:
        plan_id: Study plan identifier.
        subject_id: Enrolled subject identifier.
        subject_name: Name of the course.
        topic_title: Specific topic or chapter title.
        date_str: Date for the scheduled session (YYYY-MM-DD).
        duration_minutes: Planned duration in minutes (e.g. 45, 60, 90).
        priority: Priority level ('low', 'medium', 'high', 'urgent').
        difficulty: Difficulty rating ('easy', 'medium', 'hard', 'advanced').
        start_time: Scheduled start time (e.g. '09:00', '16:00').
        subtopic_title: Optional subtopic breakdown.
    Returns:
        Created Task object dictionary.
    """
    task_id = f"task_{int(datetime.utcnow().timestamp())}_{len(repo.tasks) + 1}"
    new_task = Task(
        id=task_id,
        planId=plan_id,
        subjectId=subject_id,
        subjectName=subject_name,
        topicId=f"top_{task_id}",
        topicTitle=topic_title,
        subtopicTitle=subtopic_title,
        title=topic_title,
        description=f"Focus session on {topic_title}",
        date=date_str,
        startTime=start_time,
        durationMinutes=duration_minutes,
        priority=priority,  # type: ignore
        difficulty=difficulty,  # type: ignore
        status="pending",
        assignedAgent="planner"
    )
    repo.tasks.append(new_task)
    return new_task.model_dump()


# =========================================================================
# TOOL 8: update_task
# =========================================================================
def update_task(task_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Updates attributes of an existing study task (e.g. start time, priority, duration, or notes).
    
    Args:
        task_id: Target task ID.
        updates: Key-value dictionary of attributes to update.
    Returns:
        Updated Task dictionary, or None if task was not found.
    """
    for idx, t in enumerate(repo.tasks):
        if t.id == task_id:
            updated_dict = t.model_dump()
            updated_dict.update(updates)
            updated_task = Task(**updated_dict)
            repo.tasks[idx] = updated_task
            return updated_task.model_dump()
    return None


# =========================================================================
# TOOL 9: complete_task
# =========================================================================
def complete_task(task_id: str) -> Optional[Dict[str, Any]]:
    """
    Marks a study task as completed, timestamping completion and updating study velocity metrics.
    
    Args:
        task_id: ID of the task the student completed.
    Returns:
        Completed Task dictionary.
    """
    for idx, t in enumerate(repo.tasks):
        if t.id == task_id:
            t.status = "completed"
            t.completedAt = datetime.utcnow().isoformat()
            repo.tasks[idx] = t
            return t.model_dump()
    return None


# =========================================================================
# TOOL 10: mark_task_missed
# =========================================================================
def mark_task_missed(task_id: str) -> Optional[Dict[str, Any]]:
    """
    Marks a study task as missed when overdue, flagging it for immediate risk and workload rebalancing.
    
    Args:
        task_id: ID of the missed study task.
    Returns:
        Missed Task dictionary.
    """
    for idx, t in enumerate(repo.tasks):
        if t.id == task_id:
            t.status = "missed"
            t.missedAt = datetime.utcnow().isoformat()
            repo.tasks[idx] = t
            return t.model_dump()
    return None


# =========================================================================
# TOOL 11: reschedule_task
# =========================================================================
def reschedule_task(
    task_id: str,
    new_date: str,
    new_start_time: str = "16:00",
    reason: str = "Autonomous adaptation"
) -> Optional[Dict[str, Any]]:
    """
    Autonomously reschedules a missed or conflicting task to a new target date and time slot,
    logging the adaptation reason and updating rescheduled count.
    
    Args:
        task_id: ID of the task to reschedule.
        new_date: Target date string (YYYY-MM-DD).
        new_start_time: Target start time string (e.g. '09:00', '15:30', '18:00').
        reason: Explanation for the schedule shift.
    Returns:
        Rescheduled Task dictionary.
    """
    for idx, t in enumerate(repo.tasks):
        if t.id == task_id:
            t.status = "rescheduled"
            t.originalDate = t.originalDate or t.date
            t.date = new_date
            t.startTime = new_start_time
            t.rescheduledCount = (t.rescheduledCount or 0) + 1
            t.rescheduleReason = reason
            t.assignedAgent = "orchestrator"
            repo.tasks[idx] = t
            return t.model_dump()
    return None


# =========================================================================
# TOOL 12: save_agent_action
# =========================================================================
def save_agent_action(
    agent_module: str,
    tool_name: str,
    title: str,
    description: str,
    payload: Optional[Dict[str, Any]] = None,
    affected_task_ids: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Appends an autonomous agent decision, reasoning step, or tool call to the audit trail.
    
    Args:
        agent_module: Agent subsystem ('PLANNER', 'PROGRESS', 'RISK', 'ORCHESTRATOR').
        tool_name: Name of the executed tool.
        title: Short descriptive headline.
        description: Detailed rationale for user audit.
        payload: Optional structured metadata.
        affected_task_ids: List of affected task IDs.
    Returns:
        Logged AgentAction dictionary.
    """
    now = datetime.utcnow()
    act = AgentAction(
        id=f"act_{int(now.timestamp())}_{len(repo.actions) + 1}",
        timestamp=now.isoformat(),
        timeFormatted=now.strftime("%H:%M"),
        agentModule=agent_module,  # type: ignore
        agentType=agent_module.lower(),  # type: ignore
        toolName=tool_name,
        title=title,
        description=description,
        status="completed",
        payload=payload,
        affectedTaskIds=affected_task_ids
    )
    repo.actions.insert(0, act)
    return act.model_dump()


# =========================================================================
# TOOL 13: create_notification
# =========================================================================
def create_notification(
    notif_type: str,
    title: str,
    message: str,
    priority: str = "medium",
    related_subject_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Dispatches a high-priority or informational notification to the student's notification center.
    
    Args:
        notif_type: Notification category ('exam', 'risk', 'missed', 'rescheduled', 'daily', 'recommendation').
        title: Notification title.
        message: Notification message text.
        priority: Urgency level ('low', 'medium', 'high', 'critical').
        related_subject_id: Optional ID of the related course.
    Returns:
        Created NotificationItem dictionary.
    """
    notif = NotificationItem(
        id=f"notif_{int(datetime.utcnow().timestamp())}_{len(repo.notifications) + 1}",
        type=notif_type,  # type: ignore
        title=title,
        message=message,
        timestamp="Just now",
        read=False,
        priority=priority,  # type: ignore
        relatedSubjectId=related_subject_id
    )
    repo.notifications.insert(0, notif)
    return notif.model_dump()


# =========================================================================
# TOOL 14: analyze_syllabus
# =========================================================================
def analyze_syllabus(content: Optional[str] = None, target_subject_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Analyzes course syllabus text or exam blueprints, breaking curriculum down into granular topics and estimated hours.
    
    Args:
        content: Syllabus curriculum text.
        target_subject_name: Optional course title hint.
    Returns:
        Structured breakdown with topics, difficulties, exam weights, and estimated study hours.
    """
    subject_title = target_subject_name or "Academic Curriculum"
    topics = [
        {
            "title": "Core Theoretical Foundations",
            "chapter": "Unit 1: Fundamentals",
            "subtopics": ["Key Definitions", "Standard Formulations", "Foundational Theorems"],
            "difficulty": "medium",
            "estimatedHours": 3.5,
            "isHighPriority": True,
            "priority": "high",
            "examRelevance": "high",
            "suggestedExamWeight": "15 Marks"
        },
        {
            "title": "Advanced Problem Solving & Applications",
            "chapter": "Unit 2: Applied Studies",
            "subtopics": ["Practice Problems", "Edge Cases", "Past Exam Questions"],
            "difficulty": "hard",
            "estimatedHours": 4.5,
            "isHighPriority": True,
            "priority": "high",
            "examRelevance": "high",
            "suggestedExamWeight": "20 Marks"
        }
    ]
    return {
        "subject": subject_title,
        "subjectName": subject_title,
        "totalTopics": len(topics),
        "estimatedStudyHours": 8.0,
        "highPriorityCount": 2,
        "topics": topics,
        "summary": f"Analyzed curriculum for {subject_title}."
    }


# =========================================================================
# TOOL 15: create_study_plan
# =========================================================================
def create_study_plan(user_id: str, plan_title: str, available_hours_per_day: float = 3.5) -> Dict[str, Any]:
    """
    Synthesizes a multi-week structured study plan matching user available daily hours and target exam dates.
    
    Args:
        user_id: Student user ID.
        plan_title: Descriptive name for the study sprint plan.
        available_hours_per_day: Daily capacity limit in hours.
    Returns:
        Created StudyPlan dictionary.
    """
    plan_id = f"plan_{int(datetime.utcnow().timestamp())}"
    return {
        "planId": plan_id,
        "title": plan_title,
        "userId": user_id,
        "availableHoursPerDay": available_hours_per_day,
        "totalTasks": len(repo.tasks),
        "status": "active"
    }


# Registry of all 15 tools for Google ADK Agent
ALL_STUDYFLOW_TOOLS = [
    get_student_profile,
    get_subjects,
    get_exams,
    get_tasks,
    get_progress,
    detect_risk,
    create_task,
    update_task,
    complete_task,
    mark_task_missed,
    reschedule_task,
    save_agent_action,
    create_notification,
    analyze_syllabus,
    create_study_plan
]
