"""
StudyFlow In-Memory Data Repository Layer
Provides local state storage for active student sessions, enrolled subjects, exams, and task logs.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, date
from .models import (
    UserProfile, Subject, Exam, Task, StudyPlan, AgentAction, NotificationItem, RiskAssessment, ProgressMetrics
)


class InMemoryRepository:
    def __init__(self):
        self.user: UserProfile = UserProfile()
        self.subjects: List[Subject] = [
            Subject(
                id="subj_physics",
                name="Engineering Physics",
                code="PHY-201",
                color="#6366f1",
                currentConfidence=2,
                totalEstimatedHours=18.0,
                completedHours=6.0,
                topicsCount=5,
                completedTopicsCount=1,
                examDate="2026-09-02"
            ),
            Subject(
                id="subj_dsa",
                name="Data Structures & Algorithms",
                code="CS-202",
                color="#10b981",
                currentConfidence=4,
                totalEstimatedHours=24.0,
                completedHours=14.0,
                topicsCount=6,
                completedTopicsCount=3,
                examDate="2026-09-12"
            ),
            Subject(
                id="subj_dbms",
                name="Database Management Systems",
                code="CS-204",
                color="#f59e0b",
                currentConfidence=3,
                totalEstimatedHours=16.0,
                completedHours=8.0,
                topicsCount=4,
                completedTopicsCount=2,
                examDate="2026-09-20"
            )
        ]
        self.exams: List[Exam] = [
            Exam(
                id="exam_physics",
                subjectId="subj_physics",
                subjectName="Engineering Physics",
                title="Mid-Semester Theory Examination",
                examDate="2026-09-02",
                weightPercentage=35,
                targetScore=85,
                daysRemaining=4
            ),
            Exam(
                id="exam_dsa",
                subjectId="subj_dsa",
                subjectName="Data Structures & Algorithms",
                title="Algorithms Laboratory & Practical Exam",
                examDate="2026-09-12",
                weightPercentage=40,
                targetScore=92,
                daysRemaining=14
            ),
            Exam(
                id="exam_dbms",
                subjectId="subj_dbms",
                subjectName="Database Management Systems",
                title="Relational Schema Design & SQL Viva",
                examDate="2026-09-20",
                weightPercentage=30,
                targetScore=88,
                daysRemaining=22
            )
        ]
        today_str = date.today().isoformat()
        self.tasks: List[Task] = [
            Task(
                id="task_phy_1",
                planId="plan_initial",
                subjectId="subj_physics",
                subjectName="Engineering Physics",
                topicId="top_phy_1",
                topicTitle="Electromagnetic Induction & Faraday's Laws",
                subtopicTitle="Lenz Law & Inductance Derivations",
                title="Physics: Electromagnetic Induction & Faraday's Laws",
                description="Derive Faraday's equations and solve 5 numerical problems from past papers.",
                date=today_str,
                startTime="14:00",
                durationMinutes=75,
                priority="urgent",
                difficulty="hard",
                status="pending",
                assignedAgent="planner"
            ),
            Task(
                id="task_dsa_1",
                planId="plan_initial",
                subjectId="subj_dsa",
                subjectName="Data Structures & Algorithms",
                topicId="top_dsa_1",
                topicTitle="Dynamic Programming: 0/1 Knapsack",
                subtopicTitle="Bottom-up Tabulation Strategy",
                title="DSA: Dynamic Programming 0/1 Knapsack",
                description="Implement memoized and bottom-up DP solutions for knapsack problem variations.",
                date=today_str,
                startTime="16:00",
                durationMinutes=60,
                priority="high",
                difficulty="hard",
                status="pending",
                assignedAgent="planner"
            ),
            Task(
                id="task_dbms_1",
                planId="plan_initial",
                subjectId="subj_dbms",
                subjectName="Database Management Systems",
                topicId="top_dbms_1",
                topicTitle="Database Normalization & BCNF",
                subtopicTitle="3NF vs BCNF Decomposition",
                title="DBMS: Database Normalization & BCNF",
                description="Study functional dependencies and lossless join decomposition exercises.",
                date=today_str,
                startTime="18:00",
                durationMinutes=45,
                priority="medium",
                difficulty="medium",
                status="pending",
                assignedAgent="planner"
            )
        ]
        self.actions: List[AgentAction] = []
        self.notifications: List[NotificationItem] = []

    def sync_from_state(self, state: Dict[str, Any]):
        """Syncs repository data from caller state dictionary."""
        if not state:
            return
        if "user" in state and isinstance(state["user"], dict):
            self.user = UserProfile(**state["user"])
        if "subjects" in state and isinstance(state["subjects"], list):
            self.subjects = [Subject(**s) for s in state["subjects"]]
        if "exams" in state and isinstance(state["exams"], list):
            self.exams = [Exam(**e) for e in state["exams"]]
        if "tasks" in state and isinstance(state["tasks"], list):
            self.tasks = [Task(**t) for t in state["tasks"]]
        if "actionHistory" in state and isinstance(state["actionHistory"], list):
            self.actions = [AgentAction(**a) for a in state["actionHistory"]]
        if "notifications" in state and isinstance(state["notifications"], list):
            self.notifications = [NotificationItem(**n) for n in state["notifications"]]


# Global repository instance
repo = InMemoryRepository()
