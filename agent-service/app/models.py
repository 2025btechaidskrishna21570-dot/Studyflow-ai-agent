"""
StudyFlow Agent Service Models
Pydantic schemas for the Autonomous Academic Operations Agent.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


RiskLevel = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
TaskStatus = Literal["pending", "in_progress", "completed", "missed", "rescheduled"]
TaskPriority = Literal["low", "medium", "high", "urgent"]
DifficultyLevel = Literal["easy", "medium", "hard", "advanced"]
AgentModule = Literal["PLANNER", "PROGRESS", "RISK", "ORCHESTRATOR", "SYSTEM"]
AgentType = Literal["planner", "progress", "risk", "orchestrator", "system"]
NotificationType = Literal["exam", "risk", "missed", "rescheduled", "daily", "recommendation"]


class UserProfile(BaseModel):
    id: str = "user_krishna"
    name: str = "Krishna Patel"
    email: Optional[str] = "krishna.patel@engineering.edu"
    college: Optional[str] = "National Institute of Technology"
    major: Optional[str] = "Computer Science & Engineering"
    semester: Optional[int] = 4
    currentCgpa: Optional[float] = 8.4
    targetCgpa: float = 9.2
    expectedGraduationYear: Optional[int] = 2026
    availableHoursPerDay: float = 3.5
    preferredStudyTimes: List[str] = Field(default_factory=lambda: ["morning", "evening"])
    studyGoals: List[str] = Field(default_factory=lambda: ["Maintain 9+ CGPA", "Master DSA"])
    createdDate: str = "2026-08-01"


class Subject(BaseModel):
    id: str
    name: str
    code: Optional[str] = None
    color: str = "#6366f1"
    currentConfidence: int = 3
    totalEstimatedHours: float = 20.0
    completedHours: float = 0.0
    topicsCount: int = 5
    completedTopicsCount: int = 0
    examDate: Optional[str] = None


class Exam(BaseModel):
    id: str
    subjectId: str
    subjectName: str
    title: str
    examDate: str
    weightPercentage: Optional[int] = 30
    targetScore: Optional[int] = 90
    daysRemaining: int = 30


class Task(BaseModel):
    id: str
    planId: str
    subjectId: str
    subjectName: str
    topicId: str
    topicTitle: str
    subtopicTitle: Optional[str] = None
    title: str
    description: Optional[str] = None
    date: str
    startTime: Optional[str] = "09:00"
    durationMinutes: int = 60
    priority: TaskPriority = "medium"
    difficulty: DifficultyLevel = "medium"
    status: TaskStatus = "pending"
    rescheduledCount: Optional[int] = 0
    rescheduleReason: Optional[str] = None
    originalDate: Optional[str] = None
    completedAt: Optional[str] = None
    missedAt: Optional[str] = None
    assignedAgent: Optional[AgentType] = "planner"


class StudyPlan(BaseModel):
    id: str
    title: str
    userId: str
    startDate: str
    endDate: str
    totalTasks: int
    completedTasks: int = 0
    totalStudyHours: float
    completedStudyHours: float = 0.0
    status: str = "active"
    createdAt: str
    updatedAt: str
    adaptationCount: int = 0


class SubjectRisk(BaseModel):
    subjectId: str
    subjectName: str
    riskLevel: RiskLevel
    riskScore: int
    remainingSyllabusPercent: int
    daysUntilExam: int
    availableStudyHours: float
    requiredStudyHours: float
    missedTasksCount: int
    explanation: str
    suggestedActions: List[str] = Field(default_factory=list)


class RiskAssessment(BaseModel):
    overallRiskLevel: RiskLevel
    overallRiskScore: int
    assessedAt: str
    criticalIssuesCount: int
    subjectRisks: List[SubjectRisk]
    overloadedDays: List[str] = Field(default_factory=list)
    summaryExplanation: str
    recommendedAgentActions: List[str] = Field(default_factory=list)


class ProgressMetrics(BaseModel):
    totalTasks: int
    completedTasks: int
    missedTasks: int
    rescheduledTasks: int
    pendingTasks: int
    completionRate: int
    missedRate: int
    completedStudyHours: float
    studyStreakDays: int
    totalHoursPlanned: float
    totalHoursCompleted: float
    estimatedCompletionDate: str
    syllabusCoveredPercent: int
    subjectBreakdown: List[Dict[str, Any]] = Field(default_factory=list)


class AgentAction(BaseModel):
    id: str
    timestamp: str
    timeFormatted: str
    agentModule: AgentModule
    agentType: Optional[AgentType] = None
    toolName: str
    title: str
    description: str
    status: str = "completed"
    payload: Optional[Dict[str, Any]] = None
    affectedTaskIds: Optional[List[str]] = None
    impactSummary: Optional[str] = None


class NotificationItem(BaseModel):
    id: str
    type: NotificationType
    title: str
    message: str
    timestamp: str
    read: bool = False
    priority: Literal["low", "medium", "high", "critical"] = "medium"
    relatedSubjectId: Optional[str] = None


class AgentEventRequest(BaseModel):
    eventType: str  # "student_missed_task", "task_completed", "rebalance_request", "syllabus_analyzed"
    taskId: Optional[str] = None
    userId: Optional[str] = "user_krishna"
    userPrompt: Optional[str] = None
    state: Optional[Dict[str, Any]] = None


class ToolCallTrace(BaseModel):
    agentName: str
    toolName: str
    status: str = "completed"
    input: Optional[Dict[str, Any]] = None
    result: Optional[Any] = None
    timestamp: str


class AgentExecutionResult(BaseModel):
    success: bool
    action: str
    reason: str
    toolCalls: List[ToolCallTrace] = Field(default_factory=list)
    updatedTasks: List[Task] = Field(default_factory=list)
    updatedRisk: Optional[RiskAssessment] = None
    updatedProgress: Optional[ProgressMetrics] = None
    newNotifications: List[NotificationItem] = Field(default_factory=list)
    newActions: List[AgentAction] = Field(default_factory=list)
    message: str
    isDemoMode: bool = False
