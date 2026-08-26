/**
 * StudyFlow Data Models & Types
 * Autonomous Academic Operations Agent
 * 
 * Cleanly defined data structures prepared for Firestore and Google ADK integration.
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'missed' | 'rescheduled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'advanced';

export type AgentType = 'planner' | 'progress' | 'risk' | 'orchestrator' | 'system';

export type AgentModule = 'PLANNER' | 'PROGRESS' | 'RISK' | 'ORCHESTRATOR' | 'SYSTEM';

export type NotificationType = 'exam' | 'risk' | 'missed' | 'rescheduled' | 'daily' | 'recommendation';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  college?: string;
  university?: string;
  major?: string;
  semester?: number;
  currentCgpa?: number;
  targetCgpa: number;
  targetGpa?: number;
  expectedGraduationYear?: number;
  availableHoursPerDay: number;
  preferredStudyTimes: ('morning' | 'afternoon' | 'evening' | 'night')[];
  studyGoals: string[];
  createdDate: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
  currentConfidence: number; // 1 to 5 (1 = struggling, 5 = mastered)
  totalEstimatedHours: number;
  completedHours: number;
  topicsCount: number;
  completedTopicsCount: number;
  examDate?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  examDate: string;
  weightPercentage?: number;
  targetScore?: number;
  daysRemaining: number;
}

export interface SubTopic {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description?: string;
  subtopics: SubTopic[];
  difficulty: DifficultyLevel;
  estimatedHours: number;
  completedHours: number;
  isHighPriority: boolean;
  examWeight?: 'high' | 'medium' | 'low';
  completed: boolean;
  topics?: Topic[];
}

export interface Task {
  id: string;
  planId: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  subtopicTitle?: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // e.g. "14:00"
  durationMinutes: number;
  priority: TaskPriority;
  difficulty: DifficultyLevel;
  status: TaskStatus;
  rescheduledCount?: number;
  rescheduleReason?: string;
  originalDate?: string;
  completedAt?: string;
  missedAt?: string;
  assignedAgent?: AgentType;
}

export interface StudyPlan {
  id: string;
  title: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalTasks: number;
  completedTasks: number;
  totalStudyHours: number;
  completedStudyHours: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  adaptationCount: number;
}

export interface SubjectRisk {
  subjectId: string;
  subjectName: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  remainingSyllabusPercent: number;
  daysUntilExam: number;
  availableStudyHours: number;
  requiredStudyHours: number;
  missedTasksCount: number;
  reasonSummary?: string;
  explanation: string;
  suggestedActions: string[];
  mitigationSuggestions?: string[];
}

export interface RiskAssessment {
  overallRiskLevel: RiskLevel;
  overallRiskScore: number; // 0 - 100
  assessedAt: string;
  criticalIssuesCount: number;
  subjectRisks: SubjectRisk[];
  overloadedDays: string[];
  summaryExplanation: string;
  recommendedAgentActions: string[];
}

export interface ProgressMetrics {
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  rescheduledTasks: number;
  pendingTasks: number;
  completionRate: number; // 0 - 100
  missedRate: number; // 0 - 100
  completedStudyHours: number;
  studyStreakDays: number;
  totalHoursPlanned: number;
  totalHoursCompleted: number;
  estimatedCompletionDate: string;
  syllabusCoveredPercent: number;
  subjectBreakdown: {
    subjectId: string;
    subjectName: string;
    progressPercent: number;
    hoursCompleted: number;
    hoursTotal: number;
    color: string;
  }[];
}

export interface AgentAction {
  id: string;
  timestamp: string; // ISO or formatted HH:mm
  timeFormatted: string; // "09:41" or "Today, 18:15"
  agentModule: AgentModule;
  agentType?: AgentType;
  toolName: string;
  title: string;
  description: string;
  status?: string;
  payload?: Record<string, any>;
  affectedTaskIds?: string[];
  metadata?: Record<string, any>;
  impactSummary?: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionableLink?: string;
  relatedSubjectId?: string;
}

export interface DailyBriefing {
  date: string;
  studentGreeting: string;
  priorityTasksCount: number;
  highRiskSubject?: string;
  autonomousAdjustmentSummary: string;
  suggestedFocus: string;
  motivationalNote: string;
}

// -------------------------------------------------------------
// Tool Input & Output Types (Google ADK & Gemini Function Calling)
// -------------------------------------------------------------

export interface AnalyzeSyllabusInput {
  contentType: 'text' | 'pdf' | 'image' | 'notes';
  content?: string;
  fileData?: string; // base64 payload
  mimeType?: string; // e.g. application/pdf, image/png, image/jpeg
  fileName?: string;
  fileSize?: number;
  targetSubjectName?: string;
  isDemoMode?: boolean;
}

export interface ExtractedTopic {
  title: string;
  chapter?: string;
  subtopics: string[];
  difficulty: DifficultyLevel;
  estimatedHours: number;
  isHighPriority: boolean;
  priority?: 'high' | 'medium' | 'low';
  suggestedExamWeight?: string;
  examRelevance?: 'high' | 'medium' | 'low';
  prerequisites?: string[];
}

export interface AnalyzeSyllabusOutput {
  subject: string;
  subjectName: string;
  subjectCode?: string;
  chapters?: string[];
  totalTopics: number;
  estimatedTotalHours: number;
  estimatedStudyHours?: number;
  highPriorityCount: number;
  difficultTopicsCount?: number;
  topics: ExtractedTopic[];
  summary: string;
  prerequisites?: string[];
  suggestedDurationDays?: number;
  isDemoMode?: boolean;
}

export interface CreateStudyPlanInput {
  userId: string;
  planTitle: string;
  startDate: string;
  endDate: string;
  subjects: Subject[];
  topics: Topic[];
  exams: Exam[];
  availableHoursPerDay: number;
  preferredStudyTimes: string[];
}

export interface CreateTaskInput {
  planId: string;
  subjectId: string;
  subjectName: string;
  topicTitle: string;
  subtopicTitle?: string;
  date: string;
  startTime?: string;
  durationMinutes: number;
  priority: TaskPriority;
  difficulty: DifficultyLevel;
}

export interface RescheduleTaskInput {
  taskId: string;
  newDate: string;
  newStartTime?: string;
  reason: string;
}

export type RescheduleInput = RescheduleTaskInput;

export interface AutonomousRescheduleResult {
  rescheduledTasks: Task[];
  previousStateMap: Record<string, { date: string; time?: string }>;
  reasoning: string;
  newRiskLevel: RiskLevel;
}
