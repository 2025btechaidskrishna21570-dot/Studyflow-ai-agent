/**
 * StudyFlow Application State Context
 * Autonomous Academic Operations Agent
 * 
 * Manages all reactive state, agent tool calls, persistence, and deterministic demo playback.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Subject,
  Exam,
  Task,
  StudyPlan,
  RiskAssessment,
  ProgressMetrics,
  AgentAction,
  NotificationItem,
  DailyBriefing,
  AnalyzeSyllabusInput,
  AnalyzeSyllabusOutput,
  CreateTaskInput
} from '../types';
import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_EXAMS,
  INITIAL_TASKS,
  INITIAL_ACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DAILY_BRIEFING
} from '../services/initialData';
import { PlannerAgent, ProgressAgent, RiskAgent } from '../services/agentEngine';
import * as tools from '../services/agentTools';
import { StorageRepository, calculateDaysRemaining, syncExamDaysRemaining } from '../services/storageRepository';

export type AppView = 'landing' | 'dashboard' | 'adaptive_plan' | 'risk_intelligence' | 'activity_center' | 'analytics' | 'syllabus_analyzer';

interface AppContextType {
  // State
  user: UserProfile;
  subjects: Subject[];
  exams: Exam[];
  tasks: Task[];
  activePlan: StudyPlan | null;
  riskAssessment: RiskAssessment;
  progress: ProgressMetrics;
  actionHistory: AgentAction[];
  notifications: NotificationItem[];
  dailyBriefing: DailyBriefing;
  currentView: AppView;
  isDemoRunning: boolean;
  demoStep: number;
  demoLogs: string[];
  isAnalyzingSyllabus: boolean;
  analyzedResult: AnalyzeSyllabusOutput | null;
  syllabusAnalysisError: string | null;
  showOnboarding: boolean;
  showArchitecture: boolean;
  filterSubjectId: string | null;

  // Setters & Actions
  setCurrentView: (view: AppView) => void;
  setShowOnboarding: (show: boolean) => void;
  setShowArchitecture: (show: boolean) => void;
  setFilterSubjectId: (id: string | null) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  addSubject: (subject: Omit<Subject, 'id' | 'completedHours' | 'topicsCount' | 'completedTopicsCount'>) => void;
  addExam: (exam: Omit<Exam, 'id' | 'daysRemaining'>) => void;
  saveOnboardingProfile: (userUpdates: Partial<UserProfile>, subjects: Subject[], exams: Exam[]) => void;
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;

  // Agent Workflow Interactions
  completeTask: (taskId: string) => void;
  markTaskMissed: (taskId: string) => void;
  rescheduleTaskManually: (taskId: string, targetDate?: string, reason?: string) => void;
  addTask: (input: CreateTaskInput) => void;
  runSyllabusAnalysis: (input: AnalyzeSyllabusInput) => Promise<AnalyzeSyllabusOutput>;
  applySyllabusToPlan: (result: AnalyzeSyllabusOutput) => void;
  clearSyllabusError: () => void;
  
  // Autonomous Demo Mode
  runAutonomousDemo: () => Promise<void>;
  resetToInitialScenario: () => void;
  
  // Notification Management
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state via StorageRepository
  const initialState = StorageRepository.loadState();

  const [user, setUser] = useState<UserProfile>(initialState.user);
  const [subjects, setSubjects] = useState<Subject[]>(initialState.subjects);
  const [exams, setExams] = useState<Exam[]>(initialState.exams);
  const [tasks, setTasks] = useState<Task[]>(initialState.tasks);
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(initialState.activePlan || {
    id: 'plan_initial',
    title: 'Semester Sprint: Engineering Physics & Algorithms',
    userId: initialState.user.id,
    startDate: '2026-08-20',
    endDate: '2026-09-30',
    totalTasks: initialState.tasks.length,
    completedTasks: 2,
    totalStudyHours: 18.5,
    completedStudyHours: 2.2,
    status: 'active',
    createdAt: '2026-08-20T08:00:00Z',
    updatedAt: new Date().toISOString(),
    adaptationCount: 0
  });

  const [actionHistory, setActionHistory] = useState<AgentAction[]>(initialState.actionHistory);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialState.notifications);
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefing>(initialState.dailyBriefing);
  
  // UI Flow State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [filterSubjectId, setFilterSubjectId] = useState<string | null>(null);

  // Syllabus Analyzer State
  const [isAnalyzingSyllabus, setIsAnalyzingSyllabus] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<AnalyzeSyllabusOutput | null>(null);
  const [syllabusAnalysisError, setSyllabusAnalysisError] = useState<string | null>(null);

  // Demo Runner State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);

  // Computed Agent State
  const riskAgent = new RiskAgent();
  const progressAgent = new ProgressAgent();
  const plannerAgent = new PlannerAgent();

  // Live dynamic countdowns on exams
  const liveExams = syncExamDaysRemaining(exams);
  const riskAssessment = riskAgent.evaluateAcademicRisk(tasks, subjects, liveExams);
  const progress = progressAgent.calculateProgress(tasks, subjects);

  // Auto-sync state changes to StorageRepository
  useEffect(() => {
    StorageRepository.saveState({
      user,
      subjects,
      exams: syncExamDaysRemaining(exams),
      tasks,
      activePlan,
      actionHistory,
      notifications,
      dailyBriefing
    });
  }, [user, subjects, exams, tasks, activePlan, actionHistory, notifications, dailyBriefing]);

  /* =========================================================================
     ACTIONS
     ========================================================================= */

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const saveOnboardingProfile = (
    userUpdates: Partial<UserProfile>,
    updatedSubjects: Subject[],
    updatedExams: Exam[]
  ) => {
    // 1. Persist User Profile
    const updatedUser: UserProfile = {
      ...user,
      ...userUpdates
    };
    setUser(updatedUser);

    // 2. Persist Subjects with stable IDs and preserved metadata
    const finalSubjects: Subject[] = updatedSubjects.map((s, idx) => {
      const existing = subjects.find(old => old.id === s.id || old.name.toLowerCase() === s.name.toLowerCase());
      return {
        ...s,
        id: s.id || (existing ? existing.id : `subj_${Date.now()}_${idx}`),
        name: s.name.trim(),
        code: s.code?.trim() || `CRS-10${idx + 1}`,
        color: s.color || ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][idx % 6],
        currentConfidence: s.currentConfidence || 3,
        totalEstimatedHours: s.totalEstimatedHours || 20,
        completedHours: existing ? existing.completedHours : (s.completedHours || 0),
        topicsCount: existing ? existing.topicsCount : (s.topicsCount || 5),
        completedTopicsCount: existing ? existing.completedTopicsCount : (s.completedTopicsCount || 0)
      };
    });
    setSubjects(finalSubjects);

    // 3. Persist Exams linked to valid subjectId with dynamic days remaining
    const finalExams: Exam[] = updatedExams.map((e, idx) => {
      const matchedSubj = finalSubjects.find(s => s.id === e.subjectId || s.name.toLowerCase() === e.subjectName.toLowerCase()) || finalSubjects[0];
      const daysRemaining = calculateDaysRemaining(e.examDate);
      return {
        ...e,
        id: e.id || `exam_${Date.now()}_${idx}`,
        subjectId: matchedSubj ? matchedSubj.id : (e.subjectId || 'subj_gen'),
        subjectName: matchedSubj ? matchedSubj.name : (e.subjectName || 'General'),
        title: e.title.trim(),
        examDate: e.examDate,
        targetScore: e.targetScore,
        weightPercentage: e.weightPercentage,
        daysRemaining
      };
    });
    setExams(finalExams);

    // 4. Record Planner Agent Action
    const action: AgentAction = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentModule: 'PLANNER',
      agentType: 'planner',
      toolName: 'onboarding_sync',
      title: `Academic Baseline Synced`,
      description: `Persisted ${finalSubjects.length} subjects and ${finalExams.length} target milestones for ${updatedUser.name}.`,
      status: 'completed',
      payload: {
        userId: updatedUser.id,
        subjectsCount: finalSubjects.length,
        examsCount: finalExams.length
      }
    };
    setActionHistory(prev => [action, ...prev]);
  };

  const addSubject = (newSubj: Omit<Subject, 'id' | 'completedHours' | 'topicsCount' | 'completedTopicsCount'>) => {
    const id = `subj_${Date.now()}`;
    const subject: Subject = {
      ...newSubj,
      id,
      completedHours: 0,
      topicsCount: 5,
      completedTopicsCount: 0
    };
    setSubjects(prev => [...prev, subject]);

    const action: AgentAction = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentModule: 'PLANNER',
      agentType: 'planner',
      toolName: 'add_subject',
      title: `Subject Enrolled: ${subject.name}`,
      description: `Planner Agent initialized syllabus baseline for ${subject.name} with target confidence ${subject.currentConfidence}/5.`,
      status: 'completed',
      payload: { subjectId: id, name: subject.name }
    };
    setActionHistory(prev => [action, ...prev]);
  };

  const addExam = (newExam: Omit<Exam, 'id' | 'daysRemaining'>) => {
    const daysRemaining = calculateDaysRemaining(newExam.examDate);
    const exam: Exam = {
      ...newExam,
      id: `exam_${Date.now()}`,
      daysRemaining
    };
    setExams(prev => [...prev, exam]);
  };

  const completeTask = (taskId: string) => {
    const { updatedTasks, action, completedTask } = tools.complete_task(tasks, taskId);
    setTasks(updatedTasks);
    setActionHistory(prev => [action, ...prev]);

    // Celebratory confetti for student morale
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch {
      // safe fallback
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'daily',
      title: `Study Session Completed!`,
      message: `Completed "${completedTask?.title || 'Session'}". Velocity metric and study streak updated.`,
      timestamp: 'Just now',
      read: false,
      priority: 'low',
      relatedSubjectId: completedTask?.subjectId
    };
    setNotifications(prev => [notif, ...prev]);

    // Refresh daily briefing count
    setDailyBriefing(prev => ({
      ...prev,
      priorityTasksCount: Math.max(0, prev.priorityTasksCount - 1)
    }));
  };

  const markTaskMissed = async (taskId: string) => {
    try {
      // Invoke real Google Agent Framework event
      const agentRes = await tools.dispatch_agent_event({
        eventType: 'student_missed_task',
        taskId,
        state: { user, subjects, exams: liveExams, tasks, actionHistory, notifications }
      });

      if (agentRes.success && agentRes.updatedTasks) {
        setTasks(agentRes.updatedTasks);
        if (agentRes.newActions && agentRes.newActions.length > 0) {
          setActionHistory(prev => [...agentRes.newActions!, ...prev]);
        }
        if (agentRes.newNotifications && agentRes.newNotifications.length > 0) {
          setNotifications(prev => [...agentRes.newNotifications!, ...prev]);
        }
        return;
      }
    } catch {
      // Fallback to local deterministic agent tools if network unavailable
    }

    const { updatedTasks, action, missedTask } = tools.mark_task_missed(tasks, taskId);
    setTasks(updatedTasks);
    setActionHistory(prev => [action, ...prev]);
    
    if (missedTask) {
      const riskNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        type: 'risk',
        title: `Missed Study Session: ${missedTask.title}`,
        message: `Risk Agent flagged overdue study session for ${missedTask.subjectName}. Plan adaptation recommended.`,
        timestamp: 'Just now',
        read: false,
        priority: 'high',
        relatedSubjectId: missedTask.subjectId
      };
      setNotifications(prev => [riskNotif, ...prev]);
    }
  };

  const rescheduleTaskManually = (taskId: string, targetDate?: string, reason?: string) => {
    const nextDate = targetDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'rescheduled' as const,
          date: nextDate,
          rescheduledCount: (t.rescheduledCount || 0) + 1,
          rescheduleReason: reason || 'Manual adjustment by student request.',
          assignedAgent: 'orchestrator' as const
        };
      }
      return t;
    });

    const targetTask = tasks.find(t => t.id === taskId);
    const action: AgentAction = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentModule: 'ORCHESTRATOR',
      agentType: 'orchestrator',
      toolName: 'reschedule_task',
      title: `Session Shifted: ${targetTask?.title || 'Task'}`,
      description: `Orchestrator Agent shifted task to ${nextDate} at student request.`,
      status: 'completed',
      payload: { taskId, targetDate: nextDate }
    };

    setTasks(updated);
    setActionHistory(prev => [action, ...prev]);
  };

  const addTask = (input: CreateTaskInput) => {
    const newTask = tools.create_task(input);
    setTasks(prev => [newTask, ...prev]);

    const action: AgentAction = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentModule: 'PLANNER',
      agentType: 'planner',
      toolName: 'create_task',
      title: `Study Session Added: ${newTask.title}`,
      description: `Planner Agent scheduled ${newTask.durationMinutes} mins on ${newTask.date} for ${newTask.subjectName}.`,
      status: 'completed',
      payload: { taskId: newTask.id, date: newTask.date }
    };
    setActionHistory(prev => [action, ...prev]);
  };

  const clearSyllabusError = () => {
    setSyllabusAnalysisError(null);
  };

  const runSyllabusAnalysis = async (input: AnalyzeSyllabusInput): Promise<AnalyzeSyllabusOutput> => {
    setIsAnalyzingSyllabus(true);
    setSyllabusAnalysisError(null);
    try {
      const result = await plannerAgent.analyzeSyllabus(input);
      setAnalyzedResult(result);
      return result;
    } catch (err: any) {
      const msg = err?.message || 'AI analysis failed. Please try again.';
      setSyllabusAnalysisError(msg);
      throw err;
    } finally {
      setIsAnalyzingSyllabus(false);
    }
  };

  const applySyllabusToPlan = (result: AnalyzeSyllabusOutput) => {
    const subjectTitle = result.subject || result.subjectName;
    let existingSubj = subjects.find(s => s.name.toLowerCase() === subjectTitle.toLowerCase());
    let subjId = existingSubj ? existingSubj.id : `subj_${Date.now()}`;

    if (!existingSubj) {
      const newSubject: Subject = {
        id: subjId,
        name: subjectTitle,
        color: '#6366f1',
        currentConfidence: 3,
        totalEstimatedHours: result.estimatedStudyHours || result.estimatedTotalHours || 15,
        completedHours: 0,
        topicsCount: result.topics.length,
        completedTopicsCount: 0
      };
      setSubjects(prev => [...prev, newSubject]);
    }

    const { plan, tasks: newTasks, actions } = plannerAgent.createStudyPlan({
      userId: user.id,
      planTitle: `${subjectTitle} Intensive Sprint`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + (result.suggestedDurationDays || 30) * 86400000).toISOString().split('T')[0],
      availableHoursPerDay: user.availableHoursPerDay,
      preferredStudyTimes: user.preferredStudyTimes,
      subjects: existingSubj ? subjects : [...subjects, { id: subjId, name: subjectTitle, color: '#6366f1', currentConfidence: 3, totalEstimatedHours: result.estimatedTotalHours, completedHours: 0, topicsCount: result.topics.length, completedTopicsCount: 0 }],
      topics: result.topics.map((t, idx) => ({
        id: `topic_${idx}`,
        subjectId: subjId,
        subjectName: subjectTitle,
        title: t.title,
        difficulty: t.difficulty,
        estimatedHours: t.estimatedHours,
        completedHours: 0,
        isHighPriority: t.isHighPriority,
        completed: false,
        subtopics: t.subtopics.map((st, sidx) => ({ id: `sub_${idx}_${sidx}`, title: st, completed: false, estimatedMinutes: 45 }))
      })),
      exams: liveExams
    });

    setActivePlan(plan);
    setTasks(prev => [...newTasks, ...prev]);
    setActionHistory(prev => [...actions, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'daily',
      title: `Syllabus Synthesized into Adaptive Plan`,
      message: `Created ${newTasks.length} study tasks for ${subjectTitle} with ${result.highPriorityCount} high-priority exam topics prioritized.`,
      timestamp: 'Just now',
      read: false,
      priority: 'high'
    };
    setNotifications(prev => [notif, ...prev]);
    setAnalyzedResult(null);
    setCurrentView('dashboard');
  };

  /* =========================================================================
     AUTONOMOUS AGENT DEMO WORKFLOW (Real Google Agent Framework & ADK)
     ========================================================================= */
  const runAutonomousDemo = async () => {
    setIsDemoRunning(true);
    setCurrentView('dashboard');
    setDemoStep(1);
    setDemoLogs(['[Step 1/5] Initializing baseline scenario: Krishna Patel (3.5h/day, Physics exam in 4 days).']);

    await new Promise(r => setTimeout(r, 1500));

    // Step 2: Complete a DSA task
    setDemoStep(2);
    const dsaTask = tasks.find(t => t.subjectId === 'subj_dsa' && t.status === 'pending');
    if (dsaTask) {
      completeTask(dsaTask.id);
      setDemoLogs(prev => [...prev, `[Step 2/5] Progress Agent executed complete_task("${dsaTask.title}"). Mastery & study streak updated.`]);
    }

    await new Promise(r => setTimeout(r, 1800));

    // Step 3: Miss an urgent Physics task
    setDemoStep(3);
    const phyTask = tasks.find(t => t.subjectId === 'subj_physics' && t.status === 'pending') || tasks[0];
    setDemoLogs(prev => [...prev, `[Step 3/5] Event Trigger: Missed urgent session "${phyTask ? phyTask.title : 'Physics Session'}". Dispatching event to Google Agent Orchestrator.`]);

    await new Promise(r => setTimeout(r, 1200));

    // Step 4: Call Real Google Agent Framework
    setDemoStep(4);
    try {
      const agentRes = await tools.dispatch_agent_event({
        eventType: 'student_missed_task',
        taskId: phyTask?.id,
        state: { user, subjects, exams: liveExams, tasks, actionHistory, notifications }
      });

      if (agentRes.success && agentRes.updatedTasks) {
        setTasks(agentRes.updatedTasks);
        if (agentRes.newActions && agentRes.newActions.length > 0) {
          setActionHistory(prev => [...agentRes.newActions!, ...prev]);
        }
        if (agentRes.newNotifications && agentRes.newNotifications.length > 0) {
          setNotifications(prev => [...agentRes.newNotifications!, ...prev]);
        }

        const modeBadge = agentRes.isDemoMode ? '[Agent Engine Offline / Demo Mode]' : '[Real Google Agent Framework]';
        const logLines = [
          `[Step 4/5] ${modeBadge} Orchestrator invoked tools: ${agentRes.toolCalls.map(tc => tc.toolName).join(' ➔ ')}.`,
          `[Step 5/5] Result: ${agentRes.reason}`
        ];
        setDemoLogs(prev => [...prev, ...logLines]);
      }
    } catch {
      // Local fallback
      markTaskMissed(phyTask.id);
      setDemoLogs(prev => [
        ...prev,
        `[Step 4/5] Risk Agent recalculated risk score for Engineering Physics.`,
        `[Step 5/5] Orchestrator Agent autonomously rescheduled session to tomorrow 16:00 to safeguard exam deadline.`
      ]);
    }

    setDemoStep(5);
    await new Promise(r => setTimeout(r, 2200));
    setIsDemoRunning(false);
  };

  const resetToInitialScenario = () => {
    StorageRepository.clearState();
    setUser(INITIAL_USER);
    setSubjects(INITIAL_SUBJECTS);
    setExams(syncExamDaysRemaining(INITIAL_EXAMS));
    setTasks(INITIAL_TASKS);
    setActionHistory(INITIAL_ACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDailyBriefing(INITIAL_DAILY_BRIEFING);
    setDemoStep(0);
    setDemoLogs([]);
    setIsDemoRunning(false);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        subjects,
        exams: liveExams,
        tasks,
        activePlan,
        riskAssessment,
        progress,
        actionHistory,
        notifications,
        dailyBriefing,
        currentView,
        isDemoRunning,
        demoStep,
        demoLogs,
        isAnalyzingSyllabus,
        analyzedResult,
        syllabusAnalysisError,
        showOnboarding,
        showArchitecture,
        filterSubjectId,

        setCurrentView,
        setShowOnboarding,
        setShowArchitecture,
        setFilterSubjectId,
        updateUser,
        addSubject,
        addExam,
        saveOnboardingProfile,
        setSubjects,
        setExams,
        completeTask,
        markTaskMissed,
        rescheduleTaskManually,
        addTask,
        runSyllabusAnalysis,
        applySyllabusToPlan,
        clearSyllabusError,
        runAutonomousDemo,
        resetToInitialScenario,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
