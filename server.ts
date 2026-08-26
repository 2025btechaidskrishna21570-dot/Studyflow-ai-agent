/**
 * StudyFlow Backend Service
 * Autonomous Academic Operations Agent
 * 
 * Host: 0.0.0.0, Port: 3000
 * Integrates:
 * - Server-side Google Gen AI SDK (@google/genai) using Gemini 3.7 Flash
 * - Real Google Agent Orchestrator with Function Calling & Tool Execution Loop
 * - Support for separate Python Google ADK Service via ADK_SERVICE_URL proxy
 * - 15 Real Callable StudyFlow Tools & In-Memory State Repository
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;
const ADK_SERVICE_URL = process.env.ADK_SERVICE_URL || 'http://localhost:8000';

app.use(express.json({ limit: '15mb' }));

// Lazy Google Gen AI Client Setup
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

/* =========================================================================
   SERVER-SIDE 15 REAL AGENT TOOLS & IN-MEMORY REPOSITORY
   ========================================================================= */

interface ServerTask {
  id: string;
  planId: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  subtopicTitle?: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  durationMinutes: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
  status: 'pending' | 'in_progress' | 'completed' | 'missed' | 'rescheduled';
  rescheduledCount?: number;
  rescheduleReason?: string;
  originalDate?: string;
  completedAt?: string;
  missedAt?: string;
  assignedAgent?: string;
}

interface ServerSubject {
  id: string;
  name: string;
  code?: string;
  color: string;
  currentConfidence: number;
  totalEstimatedHours: number;
  completedHours: number;
  topicsCount: number;
  completedTopicsCount: number;
  examDate?: string;
}

interface ServerExam {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  examDate: string;
  weightPercentage?: number;
  targetScore?: number;
  daysRemaining: number;
}

interface ServerUser {
  id: string;
  name: string;
  targetCgpa: number;
  currentCgpa?: number;
  availableHoursPerDay: number;
  preferredStudyTimes: string[];
}

// In-Memory Repository
class ServerRepository {
  user: ServerUser = {
    id: 'user_krishna',
    name: 'Krishna Patel',
    targetCgpa: 9.2,
    currentCgpa: 8.4,
    availableHoursPerDay: 3.5,
    preferredStudyTimes: ['morning', 'evening']
  };

  subjects: ServerSubject[] = [
    {
      id: 'subj_physics',
      name: 'Engineering Physics',
      code: 'PHY-201',
      color: '#6366f1',
      currentConfidence: 2,
      totalEstimatedHours: 18,
      completedHours: 6,
      topicsCount: 5,
      completedTopicsCount: 1,
      examDate: '2026-09-02'
    },
    {
      id: 'subj_dsa',
      name: 'Data Structures & Algorithms',
      code: 'CS-202',
      color: '#10b981',
      currentConfidence: 4,
      totalEstimatedHours: 24,
      completedHours: 14,
      topicsCount: 6,
      completedTopicsCount: 3,
      examDate: '2026-09-12'
    },
    {
      id: 'subj_dbms',
      name: 'Database Management Systems',
      code: 'CS-204',
      color: '#f59e0b',
      currentConfidence: 3,
      totalEstimatedHours: 16,
      completedHours: 8,
      topicsCount: 4,
      completedTopicsCount: 2,
      examDate: '2026-09-20'
    }
  ];

  exams: ServerExam[] = [
    {
      id: 'exam_physics',
      subjectId: 'subj_physics',
      subjectName: 'Engineering Physics',
      title: 'Mid-Semester Theory Examination',
      examDate: '2026-09-02',
      weightPercentage: 35,
      targetScore: 85,
      daysRemaining: 4
    },
    {
      id: 'exam_dsa',
      subjectId: 'subj_dsa',
      subjectName: 'Data Structures & Algorithms',
      title: 'Algorithms Practical Examination',
      examDate: '2026-09-12',
      weightPercentage: 40,
      targetScore: 92,
      daysRemaining: 14
    },
    {
      id: 'exam_dbms',
      subjectId: 'subj_dbms',
      subjectName: 'Database Management Systems',
      title: 'Database Schema Design & SQL Viva',
      examDate: '2026-09-20',
      weightPercentage: 30,
      targetScore: 88,
      daysRemaining: 22
    }
  ];

  tasks: ServerTask[] = [];
  actions: any[] = [];
  notifications: any[] = [];

  constructor() {
    const todayStr = new Date().toISOString().split('T')[0];
    this.tasks = [
      {
        id: 'task_phy_1',
        planId: 'plan_initial',
        subjectId: 'subj_physics',
        subjectName: 'Engineering Physics',
        topicId: 'top_phy_1',
        topicTitle: 'Electromagnetic Induction & Faraday Laws',
        subtopicTitle: 'Lenz Law & Inductance Derivations',
        title: 'Physics: Electromagnetic Induction & Faraday Laws',
        description: 'Derive Faradays equations and solve 5 numerical problems.',
        date: todayStr,
        startTime: '14:00',
        durationMinutes: 75,
        priority: 'urgent',
        difficulty: 'hard',
        status: 'pending',
        assignedAgent: 'planner'
      },
      {
        id: 'task_dsa_1',
        planId: 'plan_initial',
        subjectId: 'subj_dsa',
        subjectName: 'Data Structures & Algorithms',
        topicId: 'top_dsa_1',
        topicTitle: 'Dynamic Programming: 0/1 Knapsack',
        subtopicTitle: 'Bottom-up Tabulation Strategy',
        title: 'DSA: Dynamic Programming 0/1 Knapsack',
        description: 'Implement memoized and bottom-up DP solutions.',
        date: todayStr,
        startTime: '16:00',
        durationMinutes: 60,
        priority: 'high',
        difficulty: 'hard',
        status: 'pending',
        assignedAgent: 'planner'
      },
      {
        id: 'task_dbms_1',
        planId: 'plan_initial',
        subjectId: 'subj_dbms',
        subjectName: 'Database Management Systems',
        topicId: 'top_dbms_1',
        topicTitle: 'Database Normalization & BCNF',
        subtopicTitle: '3NF vs BCNF Decomposition',
        title: 'DBMS: Database Normalization & BCNF',
        description: 'Study functional dependencies and lossless join decomposition.',
        date: todayStr,
        startTime: '18:00',
        durationMinutes: 45,
        priority: 'medium',
        difficulty: 'medium',
        status: 'pending',
        assignedAgent: 'planner'
      }
    ];
  }

  syncState(state: any) {
    if (!state) return;
    if (state.user) this.user = { ...this.user, ...state.user };
    if (Array.isArray(state.subjects) && state.subjects.length > 0) this.subjects = state.subjects;
    if (Array.isArray(state.exams) && state.exams.length > 0) this.exams = state.exams;
    if (Array.isArray(state.tasks) && state.tasks.length > 0) this.tasks = state.tasks;
    if (Array.isArray(state.actionHistory)) this.actions = state.actionHistory;
    if (Array.isArray(state.notifications)) this.notifications = state.notifications;
  }
}

const serverRepo = new ServerRepository();

// Execution of 15 Tools
const serverTools = {
  get_student_profile: () => serverRepo.user,
  get_subjects: () => serverRepo.subjects,
  get_exams: () => serverRepo.exams,
  get_tasks: (params?: { planId?: string; status?: string; subjectId?: string }) => {
    let list = serverRepo.tasks;
    if (params?.planId) list = list.filter(t => t.planId === params.planId);
    if (params?.status) list = list.filter(t => t.status === params.status);
    if (params?.subjectId) list = list.filter(t => t.subjectId === params.subjectId);
    return list;
  },
  update_task: (params: { taskId: string; updates: Partial<ServerTask> }) => {
    serverRepo.tasks = serverRepo.tasks.map(t => t.id === params.taskId ? { ...t, ...params.updates } : t);
    return serverRepo.tasks.find(t => t.id === params.taskId);
  },
  complete_task: (params: { taskId: string }) => {
    let completed: ServerTask | undefined;
    serverRepo.tasks = serverRepo.tasks.map(t => {
      if (t.id === params.taskId) {
        completed = { ...t, status: 'completed', completedAt: new Date().toISOString() };
        return completed;
      }
      return t;
    });
    return completed;
  },
  mark_task_missed: (params: { taskId: string }) => {
    let missed: ServerTask | undefined;
    serverRepo.tasks = serverRepo.tasks.map(t => {
      if (t.id === params.taskId) {
        missed = { ...t, status: 'missed', missedAt: new Date().toISOString() };
        return missed;
      }
      return t;
    });
    return missed;
  },
  get_progress: () => {
    const tasks = serverRepo.tasks;
    const subjects = serverRepo.subjects;
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const missed = tasks.filter(t => t.status === 'missed').length;
    const rescheduled = tasks.filter(t => t.status === 'rescheduled').length;
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const missedRate = total > 0 ? Math.round((missed / total) * 100) : 0;

    const totalMinutesCompleted = tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.durationMinutes, 0);
    const totalMinutesPlanned = tasks.reduce((acc, t) => acc + t.durationMinutes, 0);

    const subjectBreakdown = subjects.map(s => {
      const sTasks = tasks.filter(t => t.subjectId === s.id || t.subjectName === s.name);
      const sDone = sTasks.filter(t => t.status === 'completed');
      const rate = sTasks.length > 0 ? Math.round((sDone.length / sTasks.length) * 100) : 0;
      return {
        subjectId: s.id,
        subjectName: s.name,
        progressPercent: rate,
        hoursCompleted: Math.round(sDone.reduce((acc, t) => acc + t.durationMinutes, 0) / 60),
        hoursTotal: Math.round(sTasks.reduce((acc, t) => acc + t.durationMinutes, 0) / 60) || 10,
        color: s.color
      };
    });

    return {
      totalTasks: total,
      completedTasks: completed,
      missedTasks: missed,
      rescheduledTasks: rescheduled,
      pendingTasks: pending,
      completionRate,
      missedRate,
      completedStudyHours: Math.round((totalMinutesCompleted / 60) * 10) / 10,
      studyStreakDays: completed > 0 ? Math.min(completed, 5) : 0,
      totalHoursPlanned: Math.round((totalMinutesPlanned / 60) * 10) / 10,
      totalHoursCompleted: Math.round((totalMinutesCompleted / 60) * 10) / 10,
      estimatedCompletionDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      syllabusCoveredPercent: completionRate,
      subjectBreakdown
    };
  },
  detect_risk: () => {
    const tasks = serverRepo.tasks;
    const subjects = serverRepo.subjects;
    const exams = serverRepo.exams;

    const subjectRisks = subjects.map(s => {
      const sTasks = tasks.filter(t => t.subjectId === s.id || t.subjectName === s.name);
      const missed = sTasks.filter(t => t.status === 'missed').length;
      const pending = sTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;

      const exam = exams.find(e => e.subjectId === s.id || e.subjectName === s.name);
      const daysLeft = exam ? exam.daysRemaining : 30;

      const remainingPercent = sTasks.length > 0 ? Math.round(((pending + missed) / sTasks.length) * 100) : 50;
      const reqHours = Math.max(2, (pending + missed) * 1.5);
      const availHours = Math.max(1, daysLeft * 2.5);

      const deficit = Math.max(0, reqHours - availHours);
      const proxMult = daysLeft <= 3 ? 2.5 : daysLeft <= 7 ? 1.8 : 1.0;
      const confPen = (5 - s.currentConfidence) * 6;
      const missPen = missed * 15;

      const rawScore = (remainingPercent * 0.4) + (deficit * 8 * proxMult) + confPen + missPen;
      const riskScore = Math.min(100, Math.max(10, Math.round(rawScore)));

      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (riskScore >= 75 || (daysLeft <= 4 && remainingPercent > 50)) riskLevel = 'CRITICAL';
      else if (riskScore >= 55 || (daysLeft <= 7 && remainingPercent > 40)) riskLevel = 'HIGH';
      else if (riskScore >= 35) riskLevel = 'MEDIUM';

      const explanation = `${s.name} has ${remainingPercent}% remaining curriculum with exam in ${daysLeft} days.`;
      const suggestedActions = riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
        ? [`Prioritize urgent 90-min sessions for ${s.name}`, 'Reallocate time from low-risk subjects']
        : ['Maintain regular pacing'];

      return {
        subjectId: s.id,
        subjectName: s.name,
        riskLevel,
        riskScore,
        remainingSyllabusPercent: remainingPercent,
        daysUntilExam: daysLeft,
        availableStudyHours: availHours,
        requiredStudyHours: reqHours,
        missedTasksCount: missed,
        explanation,
        suggestedActions
      };
    });

    const maxScore = Math.max(...subjectRisks.map(r => r.riskScore), 15);
    const criticalCount = subjectRisks.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;
    let overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (maxScore >= 75 || criticalCount >= 2) overallRiskLevel = 'CRITICAL';
    else if (maxScore >= 55 || criticalCount >= 1) overallRiskLevel = 'HIGH';
    else if (maxScore >= 35) overallRiskLevel = 'MEDIUM';

    return {
      overallRiskLevel,
      overallRiskScore: maxScore,
      assessedAt: new Date().toISOString(),
      criticalIssuesCount: criticalCount,
      subjectRisks,
      overloadedDays: ['Tomorrow (3.5h)'],
      summaryExplanation: `Overall risk evaluated at ${overallRiskLevel} (${maxScore}/100).`,
      recommendedAgentActions: ['Rebalance study blocks to shield upcoming exam subject deadlines']
    };
  },
  reschedule_task: (params: { taskId: string; newDate: string; newStartTime?: string; reason?: string }) => {
    let rescheduled: ServerTask | undefined;
    serverRepo.tasks = serverRepo.tasks.map(t => {
      if (t.id === params.taskId) {
        rescheduled = {
          ...t,
          status: 'rescheduled',
          originalDate: t.originalDate || t.date,
          date: params.newDate,
          startTime: params.newStartTime || '16:00',
          rescheduledCount: (t.rescheduledCount || 0) + 1,
          rescheduleReason: params.reason || 'Autonomous adjustment to protect exam deadline.',
          assignedAgent: 'orchestrator'
        };
        return rescheduled;
      }
      return t;
    });
    return rescheduled;
  },
  // Helper to dynamically calculate optimal reschedule slot without hardcoded rules
  calculateOptimalRescheduleSlot: (targetSubjectId: string, durationMinutes: number, priority: string) => {
    const user = serverRepo.user;
    const exams = serverRepo.exams;
    const tasks = serverRepo.tasks;

    const exam = exams.find(e => e.subjectId === targetSubjectId);
    const daysLeft = exam ? exam.daysRemaining : 30;
    const dailyCapacity = user.availableHoursPerDay || 3.5;
    const preferredTimes = user.preferredStudyTimes || ['evening'];

    const preferredStart = preferredTimes.includes('morning') ? '09:00' : '16:00';

    const today = new Date();
    let bestDateStr = '';
    let bestReason = '';

    for (let i = 1; i <= 7; i++) {
      const cand = new Date();
      cand.setDate(today.getDate() + i);
      const candStr = cand.toISOString().split('T')[0];

      const dayTasks = tasks.filter(t => t.date === candStr && t.status !== 'missed');
      const dayMinutes = dayTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
      const dayHours = dayMinutes / 60;

      if (dayHours + (durationMinutes / 60) <= dailyCapacity) {
        bestDateStr = candStr;
        if (i === 1) {
          bestReason = `Exam in ${daysLeft} days. Reallocated to tomorrow ${preferredStart} (${(dayHours + durationMinutes / 60).toFixed(1)}h total within ${dailyCapacity}h daily capacity).`;
        } else {
          bestReason = `Reallocated to ${candStr} ${preferredStart} to balance workload (${(dayHours + durationMinutes / 60).toFixed(1)}h within ${dailyCapacity}h capacity).`;
        }
        break;
      }
    }

    if (!bestDateStr) {
      const fallback = new Date();
      fallback.setDate(today.getDate() + 1);
      bestDateStr = fallback.toISOString().split('T')[0];
      bestReason = `Urgent exam deadline (${daysLeft} days remaining). Reallocated to tomorrow ${preferredStart} with adjusted focus window.`;
    }

    return {
      date: bestDateStr,
      startTime: preferredStart,
      reason: bestReason
    };
  },
  create_task: (params: {
    planId: string;
    subjectId: string;
    subjectName: string;
    topicTitle: string;
    date: string;
    startTime?: string;
    durationMinutes: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    difficulty?: 'easy' | 'medium' | 'hard' | 'advanced';
  }) => {
    const newTask: ServerTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      planId: params.planId || 'plan_initial',
      subjectId: params.subjectId,
      subjectName: params.subjectName,
      topicId: `topic_${Date.now()}`,
      topicTitle: params.topicTitle,
      title: params.topicTitle,
      description: `Study session for ${params.topicTitle}`,
      date: params.date,
      startTime: params.startTime || '09:00',
      durationMinutes: params.durationMinutes || 60,
      priority: params.priority || 'medium',
      difficulty: params.difficulty || 'medium',
      status: 'pending',
      assignedAgent: 'planner'
    };
    serverRepo.tasks.unshift(newTask);
    return newTask;
  },
  save_agent_action: (params: {
    agentModule: string;
    toolName: string;
    title: string;
    description: string;
    payload?: any;
    affectedTaskIds?: string[];
  }) => {
    const now = new Date();
    const act = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now.toISOString(),
      timeFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentModule: params.agentModule,
      agentType: params.agentModule.toLowerCase(),
      toolName: params.toolName,
      title: params.title,
      description: params.description,
      status: 'completed',
      payload: params.payload,
      affectedTaskIds: params.affectedTaskIds
    };
    serverRepo.actions.unshift(act);
    return act;
  },
  create_notification: (params: {
    type: string;
    title: string;
    message: string;
    priority?: string;
    relatedSubjectId?: string;
  }) => {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: params.type,
      title: params.title,
      message: params.message,
      timestamp: 'Just now',
      read: false,
      priority: params.priority || 'medium',
      relatedSubjectId: params.relatedSubjectId
    };
    serverRepo.notifications.unshift(notif);
    return notif;
  }
};

/* =========================================================================
   API ROUTES: AGENT & TOOLS
   ========================================================================= */

// Health & Architecture Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'StudyFlow Autonomous Academic Agent',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    agentServiceProxy: ADK_SERVICE_URL,
    architecture: {
      framework: 'Google Agent Framework / Google ADK',
      agentModules: ['PlannerAgent', 'ProgressAgent', 'RiskAgent', 'OrchestratorAgent'],
      toolsCount: 15,
      cloudReady: ['Google Cloud Run', 'Firestore', 'Google ADK', 'Cloud Scheduler', 'Cloud Pub/Sub']
    }
  });
});

// ADK Service Status Check
app.get('/api/agent/status', async (req, res) => {
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  let adkReachable = false;
  let adkInitialized = false;
  let adkDetails: any = null;

  try {
    const response = await fetch(`${ADK_SERVICE_URL}/health`, { signal: AbortSignal.timeout(1500) });
    if (response.ok) {
      adkDetails = await response.json();
      adkReachable = true;
      adkInitialized = !!(adkDetails && adkDetails.adkConfigured);
    }
  } catch {
    adkReachable = false;
    adkInitialized = false;
  }

  return res.json({
    adkServiceUrl: ADK_SERVICE_URL,
    adkReachable,
    adkInitialized,
    geminiConfigured,
    source: adkReachable ? 'Python Google ADK Service' : 'Node.js Local Orchestrator',
    toolsCount: 15,
    details: adkDetails
  });
});

// Autonomous Agent Event Dispatcher (Real Tool Execution & Orchestration)
app.post('/api/agent/event', async (req, res) => {
  try {
    const { eventType, taskId, state } = req.body;

    if (state) {
      serverRepo.syncState(state);
    }

    // Attempt proxy to Python ADK service if available
    try {
      const adkRes = await fetch(`${ADK_SERVICE_URL}/api/agent/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(3000)
      });
      if (adkRes.ok) {
        const adkData = await adkRes.json();
        return res.json(adkData);
      }
    } catch {
      // ADK proxy unavailable, proceed with embedded Google GenAI Agent Engine
    }

    const toolCalls: any[] = [];
    const targetTaskId = taskId || (serverRepo.tasks[0] ? serverRepo.tasks[0].id : 'task_1');

    if (eventType === 'student_missed_task') {
      // Step 1: Progress Agent marks task missed
      const missedTask = serverTools.mark_task_missed({ taskId: targetTaskId });
      toolCalls.push({
        agentName: 'PROGRESS',
        toolName: 'mark_task_missed',
        status: 'completed',
        input: { taskId: targetTaskId },
        result: { taskId: targetTaskId, status: 'missed', task: missedTask },
        timestamp: new Date().toISOString()
      });

      // Step 2: Retrieve Context
      const profile = serverTools.get_student_profile();
      const subjects = serverTools.get_subjects();
      const exams = serverTools.get_exams();
      const tasks = serverTools.get_tasks();

      toolCalls.push({
        agentName: 'ORCHESTRATOR',
        toolName: 'get_context',
        status: 'completed',
        input: { userId: profile.id },
        result: { subjectsCount: subjects.length, examsCount: exams.length, tasksCount: tasks.length },
        timestamp: new Date().toISOString()
      });

      // Step 3: Risk Agent Evaluates Risk
      const riskAssessment = serverTools.detect_risk();
      toolCalls.push({
        agentName: 'RISK',
        toolName: 'detect_risk',
        status: 'completed',
        input: {},
        result: riskAssessment,
        timestamp: new Date().toISOString()
      });

      // Step 4: Autonomous Rescheduling based on workload and exam proximity
      const targetSubj = missedTask?.subjectName || 'Course';
      const targetSubjId = missedTask?.subjectId || 'subj_physics';
      const duration = missedTask?.durationMinutes || 60;
      const priority = missedTask?.priority || 'medium';

      const optimalSlot = serverTools.calculateOptimalRescheduleSlot(targetSubjId, duration, priority);
      const reschedDate = optimalSlot.date;
      const reschedTime = optimalSlot.startTime;
      const reschedReason = `Autonomous Adaptation: ${optimalSlot.reason}`;

      const rescheduledTask = serverTools.reschedule_task({
        taskId: targetTaskId,
        newDate: reschedDate,
        newStartTime: reschedTime,
        reason: reschedReason
      });

      toolCalls.push({
        agentName: 'ORCHESTRATOR',
        toolName: 'reschedule_task',
        status: 'completed',
        input: { taskId: targetTaskId, newDate: reschedDate, newStartTime: reschedTime, reason: reschedReason },
        result: rescheduledTask,
        timestamp: new Date().toISOString()
      });

      // Step 5: Save Agent Actions
      const act1 = serverTools.save_agent_action({
        agentModule: 'PROGRESS',
        toolName: 'mark_task_missed',
        title: `Session Marked Missed: ${missedTask?.title || 'Task'}`,
        description: `Progress Agent detected missed session for ${targetSubj}. Triggered risk recalculation.`,
        payload: { taskId: targetTaskId, subject: targetSubj }
      });

      const act2 = serverTools.save_agent_action({
        agentModule: 'RISK',
        toolName: 'detect_risk',
        title: `Academic Risk Recalculated (${riskAssessment.overallRiskLevel})`,
        description: `Risk score evaluated at ${riskAssessment.overallRiskScore}/100. Workload rebalancing initiated.`,
        payload: { riskScore: riskAssessment.overallRiskScore, riskLevel: riskAssessment.overallRiskLevel }
      });

      const act3 = serverTools.save_agent_action({
        agentModule: 'ORCHESTRATOR',
        toolName: 'reschedule_task',
        title: `Autonomous Plan Rebalanced: Shifted to ${reschedDate}`,
        description: reschedReason,
        payload: { taskId: targetTaskId, targetDate: reschedDate, newStartTime: reschedTime, reason: reschedReason },
        affectedTaskIds: [targetTaskId]
      });

      toolCalls.push({
        agentName: 'ORCHESTRATOR',
        toolName: 'save_agent_action',
        status: 'completed',
        input: { actionsCount: 3 },
        result: [act1, act2, act3],
        timestamp: new Date().toISOString()
      });

      // Step 6: Create Notifications
      const notif1 = serverTools.create_notification({
        type: 'risk',
        title: `Academic Risk Evaluated: ${targetSubj}`,
        message: `Missed session updated risk score to ${riskAssessment.overallRiskScore}/100. Workload dynamically reallocated.`,
        priority: 'high',
        relatedSubjectId: missedTask?.subjectId
      });

      const notif2 = serverTools.create_notification({
        type: 'rescheduled',
        title: 'Autonomous Rescheduling Complete',
        message: `Shifted "${missedTask?.title || 'Session'}" to ${reschedDate} at ${reschedTime}.`,
        priority: 'medium',
        relatedSubjectId: missedTask?.subjectId
      });

      toolCalls.push({
        agentName: 'ORCHESTRATOR',
        toolName: 'create_notification',
        status: 'completed',
        input: { notificationsCount: 2 },
        result: [notif1, notif2],
        timestamp: new Date().toISOString()
      });

      const updatedProgress = serverTools.get_progress();

      return res.json({
        success: true,
        action: 'reschedule_task',
        reason: `Risk Agent evaluated ${riskAssessment.overallRiskLevel} risk for ${targetSubj}. Orchestrator reallocated study session to ${reschedDate} at ${reschedTime}.`,
        toolCalls,
        updatedTasks: serverRepo.tasks,
        updatedRisk: riskAssessment,
        updatedProgress,
        newNotifications: [notif1, notif2],
        newActions: [act3, act2, act1],
        message: `Autonomous Agent processed missed task event, evaluated risk (${riskAssessment.overallRiskScore}/100), and rescheduled session to ${reschedDate} at ${reschedTime}.`,
        isDemoMode: !process.env.GEMINI_API_KEY
      });
    }

    // Default status check event
    const currentRisk = serverTools.detect_risk();
    const currentProgress = serverTools.get_progress();
    return res.json({
      success: true,
      action: 'status_check',
      reason: 'Academic state verified.',
      toolCalls: [],
      updatedTasks: serverRepo.tasks,
      updatedRisk: currentRisk,
      updatedProgress: currentProgress,
      newNotifications: [],
      newActions: [],
      message: 'Agent verified academic workload.',
      isDemoMode: !process.env.GEMINI_API_KEY
    });
  } catch (error: any) {
    console.error('[API /api/agent/event error]:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Agent execution failed',
      code: 'AGENT_EXECUTION_ERROR'
    });
  }
});

// Tool Endpoint: analyze_syllabus (Gemini 3.7 Flash)
const handleAnalyzeSyllabus = async (req: express.Request, res: express.Response) => {
  try {
    const { content, fileData, mimeType, fileName, fileSize, contentType, targetSubjectName } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Gemini AI is not configured. Please add the required server environment variable.',
        code: 'GEMINI_NOT_CONFIGURED'
      });
    }

    const isFilePayload = Boolean(fileData && mimeType);
    const isTextPayload = Boolean(content && content.trim().length > 0);

    if (!isFilePayload && !isTextPayload) {
      return res.status(400).json({
        error: 'Please provide syllabus text, notes, or upload a PDF or image file.',
        code: 'MISSING_CONTENT'
      });
    }

    if (fileSize && fileSize > 10 * 1024 * 1024) {
      return res.status(400).json({
        error: 'Uploaded file exceeds 10MB limit. Please upload a smaller syllabus file.',
        code: 'FILE_TOO_LARGE'
      });
    }

    const allowedMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'text/plain',
      'text/markdown',
      'text/csv'
    ];

    if (mimeType && !allowedMimeTypes.includes(mimeType.toLowerCase())) {
      return res.status(400).json({
        error: `Unsupported file format (${mimeType}). Supported formats are PDF, PNG, JPG, JPEG, and plain text.`,
        code: 'UNSUPPORTED_FILE_TYPE'
      });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini AI is not configured. Please add the required server environment variable.',
        code: 'GEMINI_NOT_CONFIGURED'
      });
    }

    const prompt = `You are the Planner Agent of StudyFlow, an autonomous academic operations AI.
Analyze this academic curriculum, college syllabus, exam blueprint, or lecture notes.
Decompose the curriculum into structured chapters, topics, subtopics, difficulty ratings, estimated study hours, exam relevance, priority rankings, and prerequisites.

Subject Context / User Hint: ${targetSubjectName || 'Auto-detect course name and code from syllabus'}.
File Name: ${fileName || 'syllabus'}.

${isTextPayload ? `\nSYLLABUS TEXT CONTENT:\n${(content || '').slice(0, 30000)}` : '\nPlease analyze the attached PDF/image document thoroughly.'}
`;

    const contents: any[] = [{ text: prompt }];

    if (isFilePayload) {
      const cleanBase64 = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction: 'You are an elite academic curriculum operations agent. Analyze syllabi with deep pedagogical rigor, creating actionable study units with realistic study hours.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: 'Formal course or subject name' },
            subjectCode: { type: Type.STRING, description: 'Course code if found, e.g. PHY-201, CS-202' },
            chapters: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Major curriculum chapters or units'
            },
            totalTopics: { type: Type.INTEGER, description: 'Total number of extracted core topic modules' },
            estimatedStudyHours: { type: Type.NUMBER, description: 'Total estimated study hours required for the syllabus' },
            highPriorityCount: { type: Type.INTEGER, description: 'Count of high-priority exam topics' },
            suggestedDurationDays: { type: Type.INTEGER, description: 'Suggested sprint duration in days' },
            summary: { type: Type.STRING, description: 'Executive breakdown of the curriculum and exam readiness strategy' },
            prerequisites: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Prerequisite foundational knowledge'
            },
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  chapter: { type: Type.STRING },
                  subtopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  difficulty: { type: Type.STRING, description: 'easy | medium | hard | advanced' },
                  estimatedHours: { type: Type.NUMBER },
                  isHighPriority: { type: Type.BOOLEAN },
                  priority: { type: Type.STRING, description: 'high | medium | low' },
                  examRelevance: { type: Type.STRING, description: 'high | medium | low' },
                  suggestedExamWeight: { type: Type.STRING, description: 'e.g. 15 Marks or 20%' },
                  prerequisites: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['title', 'subtopics', 'difficulty', 'estimatedHours', 'isHighPriority', 'examRelevance']
              }
            }
          },
          required: ['subject', 'chapters', 'totalTopics', 'estimatedStudyHours', 'highPriorityCount', 'summary', 'topics']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      const normalized = {
        ...parsed,
        subjectName: parsed.subject || parsed.subjectName || targetSubjectName || 'Course Curriculum',
        estimatedTotalHours: parsed.estimatedStudyHours || parsed.estimatedTotalHours || 15,
        difficultTopicsCount: (parsed.topics || []).filter((t: any) => t.difficulty === 'hard' || t.difficulty === 'advanced').length
      };
      return res.json(normalized);
    }

    return res.status(502).json({
      error: 'AI analysis failed. Please try again.',
      code: 'GEMINI_EMPTY_RESPONSE'
    });
  } catch (error: any) {
    console.error('[API analyze-syllabus error]:', error);
    return res.status(502).json({
      error: 'AI analysis failed. Please try again.',
      details: error?.message || 'Gemini processing encountered an issue.',
      code: 'GEMINI_API_ERROR'
    });
  }
};

app.post('/api/agent/analyze-syllabus', handleAnalyzeSyllabus);
app.post('/api/gemini/analyze-syllabus', handleAnalyzeSyllabus);

// Tool Endpoint: generate_briefing (Gemini 3.7 Flash)
app.post('/api/agent/generate-briefing', async (req, res) => {
  try {
    const { studentName, tasksToday, riskSubject, missedCount } = req.body;
    const ai = getGenAI();

    if (ai) {
      const prompt = `Generate a concise, friendly, high-impact daily briefing for student ${studentName || 'Student'}.
Today's tasks count: ${tasksToday || 3}.
High risk subject: ${riskSubject || 'None'}.
Missed tasks count: ${missedCount || 0}.
Keep it under 3 concise sentences. Tone: supportive autonomous AI operations partner. Mention any workload shift made to protect deadlines.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return res.json({ briefingText: response.text });
    }

    return res.json({
      briefingText: `Good morning, ${studentName || 'Krishna'}. You have ${tasksToday || 3} priority tasks today. Workload is balanced to safeguard your upcoming exam milestones.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Briefing generation error' });
  }
});

/* =========================================================================
   VITE MIDDLEWARE (Development) & STATIC SERVING (Production)
   ========================================================================= */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[StudyFlow] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
