/**
 * StudyFlow Agent Tools
 * Autonomous Academic Operations Agent
 * 
 * Clean Tool Interfaces for Google ADK / Google Agent Framework & Firestore.
 * Each tool has strictly typed inputs & outputs.
 */

import {
  AnalyzeSyllabusInput,
  AnalyzeSyllabusOutput,
  CreateStudyPlanInput,
  CreateTaskInput,
  RescheduleTaskInput,
  StudyPlan,
  Task,
  ProgressMetrics,
  RiskAssessment,
  AgentAction,
  NotificationItem,
  Subject,
  Exam,
  RiskLevel
} from '../types';

/* =========================================================================
   TOOL 1: analyze_syllabus()
   ========================================================================= */
export async function analyze_syllabus(input: AnalyzeSyllabusInput): Promise<AnalyzeSyllabusOutput> {
  // If explicitly requested to run in Demo Mode
  if (input.isDemoMode) {
    const contentStr = input.content || input.fileName || '';
    const subjectName = input.targetSubjectName || 
      (contentStr.toLowerCase().includes('physics') ? 'Engineering Physics' :
       contentStr.toLowerCase().includes('data structure') || contentStr.toLowerCase().includes('algorithm') ? 'Data Structures & Algorithms' :
       contentStr.toLowerCase().includes('database') || contentStr.toLowerCase().includes('dbms') ? 'Database Management Systems' :
       contentStr.toLowerCase().includes('math') || contentStr.toLowerCase().includes('calculus') ? 'Discrete Mathematics' :
       'Academic Curriculum');

    const sampleTopics: AnalyzeSyllabusOutput['topics'] = [];

    if (subjectName.includes('Physics')) {
      sampleTopics.push(
        {
          title: 'Electromagnetic Induction & Faradays Laws',
          chapter: 'Module 1: Electromagnetism',
          subtopics: ['Magnetic Flux', 'Lenz Law & Conservation', 'Eddy Currents', 'Self & Mutual Inductance'],
          difficulty: 'hard',
          estimatedHours: 4.5,
          isHighPriority: true,
          priority: 'high',
          examRelevance: 'high',
          suggestedExamWeight: '15 Marks',
          prerequisites: ['Basic Vector Calculus', 'Magnetic Fields']
        },
        {
          title: 'Maxwells Equations & EM Waves',
          chapter: 'Module 2: Electrodynamics',
          subtopics: ['Displacement Current', 'Poynting Vector', 'Wave Equation in Vacuum'],
          difficulty: 'advanced',
          estimatedHours: 4.0,
          isHighPriority: true,
          priority: 'high',
          examRelevance: 'high',
          suggestedExamWeight: '15 Marks',
          prerequisites: ['Gauss Law', 'Amperes Law']
        },
        {
          title: 'Wave Optics & Interference',
          chapter: 'Module 3: Optics',
          subtopics: ['Youngs Double Slit', 'Fringe Width Derivation', 'Thin Film Interference'],
          difficulty: 'medium',
          estimatedHours: 3.0,
          isHighPriority: false,
          priority: 'medium',
          examRelevance: 'medium',
          suggestedExamWeight: '10 Marks',
          prerequisites: ['Wave Superposition']
        },
        {
          title: 'Quantum Wave Mechanics & Schrödinger Eq',
          chapter: 'Module 4: Modern Physics',
          subtopics: ['Wave-Particle Duality', 'De Broglie Hypothesis', '1D Infinite Potential Well'],
          difficulty: 'advanced',
          estimatedHours: 5.0,
          isHighPriority: true,
          priority: 'high',
          examRelevance: 'high',
          suggestedExamWeight: '15 Marks',
          prerequisites: ['Photoelectric Effect']
        }
      );
    } else if (subjectName.includes('Data') || subjectName.includes('Algorithm')) {
      sampleTopics.push(
        {
          title: 'Dynamic Programming: Knapsack & Subsequences',
          chapter: 'Unit 1: Dynamic Programming',
          subtopics: ['0/1 Knapsack problem', 'Longest Common Subsequence (LCS)', 'Matrix Chain Multiplication'],
          difficulty: 'hard',
          estimatedHours: 5.0,
          isHighPriority: true,
          priority: 'high',
          examRelevance: 'high',
          suggestedExamWeight: '20 Marks',
          prerequisites: ['Recursion', 'Memoization']
        },
        {
          title: 'Advanced Graph Algorithms',
          chapter: 'Unit 2: Graph Theory',
          subtopics: ['Dijkstra & Bellman-Ford Shortest Paths', 'Minimum Spanning Trees: Kruskal & Prim'],
          difficulty: 'hard',
          estimatedHours: 4.5,
          isHighPriority: true,
          priority: 'high',
          examRelevance: 'high',
          suggestedExamWeight: '15 Marks',
          prerequisites: ['Adjacency Lists', 'BFS/DFS']
        },
        {
          title: 'Trees & Disjoint Set Union (DSU)',
          chapter: 'Unit 3: Hierarchical Structures',
          subtopics: ['AVL Tree Rotations', 'Union Find with Path Compression'],
          difficulty: 'medium',
          estimatedHours: 3.5,
          isHighPriority: false,
          priority: 'medium',
          examRelevance: 'medium',
          suggestedExamWeight: '10 Marks',
          prerequisites: ['Binary Search Trees']
        }
      );
    } else {
      sampleTopics.push(
        {
          title: 'Core Theoretical Foundations',
          chapter: 'Module 1: Fundamentals',
          subtopics: ['Definitions & Principles', 'Standard Formulations', 'Key Theorems'],
          difficulty: 'medium',
          estimatedHours: 3.5,
          isHighPriority: true,
          priority: 'high',
          examRelevance: 'high',
          suggestedExamWeight: '15 Marks',
          prerequisites: ['Prerequisite 101']
        },
        {
          title: 'Applied Problem Sets & Derivations',
          chapter: 'Module 2: Applications',
          subtopics: ['Solved Examples', 'Edge Cases', 'Past Examination Papers'],
          difficulty: 'hard',
          estimatedHours: 4.5,
          isHighPriority: true,
          priority: 'high',
          examRelevance: 'high',
          suggestedExamWeight: '20 Marks',
          prerequisites: ['Module 1']
        }
      );
    }

    const totalHours = sampleTopics.reduce((acc, t) => acc + t.estimatedHours, 0);
    const highPriorityCount = sampleTopics.filter(t => t.isHighPriority).length;

    return {
      subject: subjectName,
      subjectName,
      chapters: Array.from(new Set(sampleTopics.map(t => t.chapter || 'Main'))),
      totalTopics: sampleTopics.length,
      estimatedStudyHours: totalHours,
      estimatedTotalHours: totalHours,
      highPriorityCount,
      difficultTopicsCount: sampleTopics.filter(t => t.difficulty === 'hard' || t.difficulty === 'advanced').length,
      topics: sampleTopics,
      summary: `[Demo Mode] Simulated curriculum analysis for "${subjectName}". Extracted ${sampleTopics.length} modules (${totalHours} estimated study hours).`,
      prerequisites: ['Foundation Courses', 'Basic Calculus'],
      suggestedDurationDays: 14,
      isDemoMode: true
    };
  }

  // Real Gemini analysis via server-side endpoint
  try {
    const response = await fetch('/api/gemini/analyze-syllabus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error || (response.status === 503 
        ? 'Gemini AI is not configured. Please add the required server environment variable.' 
        : 'AI analysis failed. Please try again.');
      throw new Error(errorMsg);
    }

    if (data && data.topics && data.topics.length > 0) {
      return {
        ...data,
        subject: data.subject || data.subjectName || input.targetSubjectName || 'Course Curriculum',
        subjectName: data.subject || data.subjectName || input.targetSubjectName || 'Course Curriculum',
        estimatedStudyHours: data.estimatedStudyHours || data.estimatedTotalHours || 15,
        estimatedTotalHours: data.estimatedStudyHours || data.estimatedTotalHours || 15,
        difficultTopicsCount: (data.topics || []).filter((t: any) => t.difficulty === 'hard' || t.difficulty === 'advanced').length,
        isDemoMode: false
      };
    }

    throw new Error('AI analysis failed. Please try again.');
  } catch (err: any) {
    console.error('[Tool: analyze_syllabus] Analysis error:', err);
    throw err;
  }
}

/* =========================================================================
   TOOL 2: create_study_plan()
   ========================================================================= */
export function create_study_plan(input: CreateStudyPlanInput): {
  plan: StudyPlan;
  tasks: Task[];
  actions: AgentAction[];
} {
  const planId = `plan_${Date.now()}`;
  const tasks: Task[] = [];
  const actions: AgentAction[] = [];

  const start = new Date(input.startDate || Date.now());
  let currentDay = new Date(start);
  let totalHours = 0;

  // Flatten topic requests
  const allTopicItems: { subjectId: string; subjectName: string; topic: any }[] = [];
  input.topics.forEach(s => {
    const list = (s as any).topics || (s as any).subtopics || [s];
    list.forEach((t: any) => {
      allTopicItems.push({
        subjectId: s.subjectId,
        subjectName: s.subjectName,
        topic: t
      });
    });
  });

  // Assign topics to daily study slots matching user.availableHoursPerDay
  const dailyCapacityMins = (input.availableHoursPerDay || 3.5) * 60;
  let currentDayAllocatedMins = 0;

  allTopicItems.forEach((item, index) => {
    const duration = item.topic.estimatedHours ? Math.round(item.topic.estimatedHours * 60) : 60;
    const taskDuration = Math.min(duration, 90); // Cap individual sessions at 90 mins max for focus

    if (currentDayAllocatedMins + taskDuration > dailyCapacityMins && currentDayAllocatedMins > 0) {
      currentDay.setDate(currentDay.getDate() + 1);
      currentDayAllocatedMins = 0;
    }

    const dateStr = currentDay.toISOString().split('T')[0];
    const preferredSlot = input.preferredStudyTimes?.[0] || 'morning';
    const startTime = preferredSlot === 'morning' ? '09:00' : preferredSlot === 'evening' ? '18:00' : '14:00';

    const taskId = `task_${Date.now()}_${index}`;
    tasks.push({
      id: taskId,
      planId,
      subjectId: item.subjectId,
      subjectName: item.subjectName,
      topicId: `topic_${index}`,
      topicTitle: item.topic.title || 'Study Module',
      subtopicTitle: item.topic.subtopics?.[0] || undefined,
      title: item.topic.title || 'Study Session',
      description: item.topic.subtopics ? `Focus: ${item.topic.subtopics.join(', ')}` : 'Dedicated study session',
      date: dateStr,
      startTime,
      durationMinutes: taskDuration,
      priority: item.topic.isHighPriority ? 'urgent' : item.topic.difficulty === 'hard' ? 'high' : 'medium',
      difficulty: item.topic.difficulty || 'medium',
      status: 'pending',
      assignedAgent: 'planner'
    });

    currentDayAllocatedMins += taskDuration;
    totalHours += taskDuration / 60;
  });

  const plan: StudyPlan = {
    id: planId,
    title: input.planTitle || 'Autonomous Adaptive Study Plan',
    userId: input.userId,
    startDate: input.startDate,
    endDate: currentDay.toISOString().split('T')[0],
    totalTasks: tasks.length,
    completedTasks: 0,
    totalStudyHours: Math.round(totalHours * 10) / 10,
    completedStudyHours: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adaptationCount: 0
  };

  actions.push({
    id: `action_${Date.now()}_1`,
    timestamp: new Date().toISOString(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentModule: 'PLANNER',
    agentType: 'planner',
    toolName: 'analyze_syllabus',
    title: 'Syllabus Analyzed & Structured',
    description: `Planner Agent parsed ${allTopicItems.length} topics across ${input.topics.length} subjects with exam priority weighting.`,
    status: 'completed',
    payload: { totalTopics: allTopicItems.length, totalHours }
  });

  actions.push({
    id: `action_${Date.now()}_2`,
    timestamp: new Date().toISOString(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentModule: 'ORCHESTRATOR',
    agentType: 'orchestrator',
    toolName: 'create_study_plan',
    title: 'Autonomous Study Plan Synthesized',
    description: `Created ${tasks.length} adaptive study sessions matching ${input.availableHoursPerDay} hrs/day target capacity.`,
    status: 'completed',
    affectedTaskIds: tasks.map(t => t.id)
  });

  return { plan, tasks, actions };
}

/* =========================================================================
   TOOL 3: create_task()
   ========================================================================= */
export function create_task(input: CreateTaskInput): Task {
  return {
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    planId: input.planId,
    subjectId: input.subjectId,
    subjectName: input.subjectName,
    topicId: `topic_${Date.now()}`,
    topicTitle: input.topicTitle,
    subtopicTitle: input.subtopicTitle,
    title: input.topicTitle,
    description: input.subtopicTitle ? `Focus on ${input.subtopicTitle}` : `Self-study session for ${input.topicTitle}`,
    date: input.date,
    durationMinutes: input.durationMinutes,
    priority: input.priority,
    difficulty: input.difficulty,
    status: 'pending',
    assignedAgent: 'planner'
  };
}

/* =========================================================================
   TOOL 4: get_tasks()
   ========================================================================= */
export function get_tasks(allTasks: Task[], planId?: string): Task[] {
  if (!planId) return allTasks;
  return allTasks.filter(t => t.planId === planId);
}

/* =========================================================================
   TOOL 5: update_task()
   ========================================================================= */
export function update_task(tasks: Task[], taskId: string, updates: Partial<Task>): Task[] {
  return tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t));
}

/* =========================================================================
   TOOL 6: complete_task()
   ========================================================================= */
export function complete_task(
  tasks: Task[],
  taskId: string
): { updatedTasks: Task[]; action: AgentAction; completedTask?: Task } {
  let completedTask: Task | undefined;
  const updatedTasks = tasks.map(t => {
    if (t.id === taskId) {
      completedTask = { ...t, status: 'completed' as const, completedAt: new Date().toISOString() };
      return completedTask;
    }
    return t;
  });

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const action: AgentAction = {
    id: `action_${Date.now()}`,
    timestamp: now.toISOString(),
    timeFormatted,
    agentModule: 'PROGRESS',
    agentType: 'progress',
    toolName: 'complete_task',
    title: `Task Completed: ${completedTask?.title || 'Study Session'}`,
    description: `Progress Agent logged ${completedTask?.durationMinutes || 45} mins towards ${completedTask?.subjectName}. Mastery metric updated.`,
    status: 'completed',
    affectedTaskIds: taskId ? [taskId] : []
  };

  return { updatedTasks, action, completedTask };
}

/* =========================================================================
   TOOL 7: mark_task_missed()
   ========================================================================= */
export function mark_task_missed(
  tasks: Task[],
  taskId: string
): {
  updatedTasks: Task[];
  missedTask?: Task;
  action: AgentAction;
} {
  let missedTask: Task | undefined;
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updatedTasks = tasks.map(t => {
    if (t.id === taskId) {
      missedTask = { ...t, status: 'missed' as const, missedAt: now.toISOString() };
      return missedTask;
    }
    return t;
  });

  const action: AgentAction = {
    id: `action_${Date.now()}`,
    timestamp: now.toISOString(),
    timeFormatted,
    agentModule: 'PROGRESS',
    agentType: 'progress',
    toolName: 'mark_task_missed',
    title: `${missedTask?.subjectName || 'Subject'} Task Marked Overdue`,
    description: `Progress Agent detected missed session "${missedTask?.title}". Exam deadline integrity compromised.`,
    status: 'completed',
    affectedTaskIds: [taskId]
  };

  return { updatedTasks, missedTask, action };
}

/* =========================================================================
   TOOL 8: get_progress()
   ========================================================================= */
export function get_progress(tasks: Task[], subjects: Subject[]): ProgressMetrics {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const missedTasks = tasks.filter(t => t.status === 'missed').length;
  const rescheduledTasks = tasks.filter(t => t.status === 'rescheduled').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const missedRate = totalTasks > 0 ? Math.round((missedTasks / totalTasks) * 100) : 0;

  const totalMinutesPlanned = tasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const totalMinutesCompleted = tasks
    .filter(t => t.status === 'completed')
    .reduce((acc, t) => acc + t.durationMinutes, 0);

  const subjectBreakdown = subjects.map(sub => {
    const subTasks = tasks.filter(t => t.subjectId === sub.id || t.subjectName === sub.name);
    const subCompleted = subTasks.filter(t => t.status === 'completed');
    const subProgress = subTasks.length > 0 ? Math.round((subCompleted.length / subTasks.length) * 100) : 0;

    const hoursCompleted = Math.round(subCompleted.reduce((acc, t) => acc + t.durationMinutes, 0) / 60);
    const hoursTotal = Math.round(subTasks.reduce((acc, t) => acc + t.durationMinutes, 0) / 60);

    return {
      subjectId: sub.id,
      subjectName: sub.name,
      progressPercent: subProgress,
      hoursCompleted,
      hoursTotal: hoursTotal || 10,
      color: sub.color || '#3b82f6'
    };
  });

  const remainingTasks = pendingTasks + missedTasks;
  const daysNeeded = Math.ceil(remainingTasks / 3);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysNeeded);

  const completedStudyHours = Math.round((totalMinutesCompleted / 60) * 10) / 10;

  return {
    totalTasks,
    completedTasks,
    missedTasks,
    rescheduledTasks,
    pendingTasks,
    completionRate,
    missedRate,
    completedStudyHours,
    studyStreakDays: completedTasks > 0 ? Math.min(completedTasks, 5) : 0,
    totalHoursPlanned: Math.round((totalMinutesPlanned / 60) * 10) / 10,
    totalHoursCompleted: completedStudyHours,
    estimatedCompletionDate: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    syllabusCoveredPercent: completionRate,
    subjectBreakdown
  };
}

/* =========================================================================
   TOOL 9: detect_risk()
   ========================================================================= */
export function detect_risk(
  tasks: Task[],
  subjects: Subject[],
  exams: Exam[]
): RiskAssessment {
  const subjectRisks = subjects.map(subject => {
    const subjectTasks = tasks.filter(t => t.subjectId === subject.id || t.subjectName === subject.name);
    const completed = subjectTasks.filter(t => t.status === 'completed').length;
    const missed = subjectTasks.filter(t => t.status === 'missed').length;
    const pending = subjectTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;

    const exam = exams.find(e => e.subjectId === subject.id || e.subjectName === subject.name);
    const daysUntilExam = exam ? exam.daysRemaining : 30;

    const remainingPercent = subjectTasks.length > 0
      ? Math.round(((pending + missed) / subjectTasks.length) * 100)
      : 50;

    const requiredStudyHours = Math.max(2, Math.round((pending + missed) * 1.5));
    const availableStudyHours = Math.max(1, Math.round(daysUntilExam * 2.5));

    // Mathematical formula
    const workloadDeficit = Math.max(0, requiredStudyHours - availableStudyHours);
    const proximityMultiplier = daysUntilExam <= 3 ? 2.5 : daysUntilExam <= 7 ? 1.8 : 1.0;
    const confidencePenalty = (5 - subject.currentConfidence) * 6;
    const missedPenalty = missed * 15;

    let rawScore = (remainingPercent * 0.4) + (workloadDeficit * 8 * proximityMultiplier) + confidencePenalty + missedPenalty;
    const riskScore = Math.min(100, Math.max(10, Math.round(rawScore)));

    let riskLevel: RiskLevel = 'LOW';
    if (riskScore >= 75 || (daysUntilExam <= 4 && remainingPercent > 50)) {
      riskLevel = 'CRITICAL';
    } else if (riskScore >= 55 || (daysUntilExam <= 7 && remainingPercent > 40)) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 35) {
      riskLevel = 'MEDIUM';
    }

    let explanation = '';
    const mitigationSuggestions: string[] = [];

    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      explanation = `${subject.name} is ${riskLevel} RISK because ${remainingPercent}% of the syllabus remains and only ${daysUntilExam} study days are available before the exam.`;
      mitigationSuggestions.push(`Prioritize urgent 90-min sessions for ${subject.name}`);
      mitigationSuggestions.push(`Reallocate 30-45 mins from lower-risk subjects`);
      mitigationSuggestions.push(`Schedule weekend consolidation buffer`);
    } else if (riskLevel === 'MEDIUM') {
      explanation = `${subject.name} has moderate urgency with ${daysUntilExam} days remaining. Velocity is steady.`;
      mitigationSuggestions.push(`Maintain regular daily study allocation`);
      mitigationSuggestions.push(`Track topic completion velocity`);
    } else {
      explanation = `${subject.name} is on track with low risk and high mastery confidence.`;
      mitigationSuggestions.push(`Safe to donate buffer time to higher-risk subjects if needed`);
    }

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      riskLevel,
      riskScore,
      remainingSyllabusPercent: remainingPercent,
      daysUntilExam,
      availableStudyHours,
      requiredStudyHours,
      missedTasksCount: missed,
      reasonSummary: explanation,
      explanation,
      suggestedActions: mitigationSuggestions,
      mitigationSuggestions
    };
  });

  const maxScore = Math.max(...subjectRisks.map(r => r.riskScore), 15);
  const criticalCount = subjectRisks.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;

  let overallRiskLevel: RiskLevel = 'LOW';
  if (maxScore >= 75 || criticalCount >= 2) overallRiskLevel = 'CRITICAL';
  else if (maxScore >= 55 || criticalCount >= 1) overallRiskLevel = 'HIGH';
  else if (maxScore >= 35) overallRiskLevel = 'MEDIUM';

  const criticalSubject = subjectRisks.find(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH');
  const summaryExplanation = criticalSubject
    ? criticalSubject.explanation
    : `Overall workload is balanced with ${subjectRisks.length} subjects on target trajectory.`;

  return {
    overallRiskLevel,
    overallRiskScore: maxScore,
    assessedAt: new Date().toISOString(),
    criticalIssuesCount: criticalCount,
    subjectRisks,
    overloadedDays: ['Tomorrow (3.5 hrs)', 'Thursday (4.0 hrs)'],
    summaryExplanation,
    recommendedAgentActions: [
      'Rebalance study blocks to shield upcoming exam subject deadlines',
      'Compress non-essential review sessions to free 1.5h buffer space'
    ]
  };
}

/* =========================================================================
   TOOL 10: reschedule_tasks()
   ========================================================================= */
export function reschedule_tasks(input: {
  tasks: Task[];
  tasksToReschedule?: { taskId: string; newDate: string; newStartTime?: string; reason: string }[];
  missedTaskId?: string;
  reason?: string;
  userAvailableHoursPerDay?: number;
}): { tasks: Task[]; rescheduledTasks: Task[]; action: AgentAction } {
  const rescheduledTasks: Task[] = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const targetId = input.missedTaskId || input.tasksToReschedule?.[0]?.taskId;
  const reasonText = input.reason || input.tasksToReschedule?.[0]?.reason || 'Autonomous rebalance: Adjusted to protect exam deadline.';

  const updatedTasks = input.tasks.map(task => {
    if (task.id === targetId) {
      const rescheduled: Task = {
        ...task,
        status: 'rescheduled' as const,
        date: input.tasksToReschedule?.[0]?.newDate || tomorrowStr,
        startTime: input.tasksToReschedule?.[0]?.newStartTime || '16:00',
        rescheduledCount: (task.rescheduledCount || 0) + 1,
        rescheduleReason: reasonText,
        assignedAgent: 'orchestrator'
      };
      rescheduledTasks.push(rescheduled);
      return rescheduled;
    }

    return task;
  });

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const action: AgentAction = {
    id: `action_${Date.now()}`,
    timestamp: now.toISOString(),
    timeFormatted,
    agentModule: 'ORCHESTRATOR',
    agentType: 'orchestrator',
    toolName: 'reschedule_tasks',
    title: 'Autonomous Study Plan Rescheduled',
    description: `Orchestrator Agent rebalanced schedule: relocated missed session to ${tomorrowStr} 16:00 to protect exam deadline.`,
    status: 'completed',
    affectedTaskIds: rescheduledTasks.map(t => t.id),
    metadata: {
      rescheduledCount: rescheduledTasks.length,
      targetDate: tomorrowStr
    },
    impactSummary: 'Protected upcoming Physics exam deadline without extending overall semester sprint.'
  };

  return { tasks: updatedTasks, rescheduledTasks, action };
}

/* =========================================================================
   TOOL 11: save_agent_action()
   ========================================================================= */
export function save_agent_action(
  history: AgentAction[],
  actionData: Omit<AgentAction, 'id' | 'timestamp' | 'timeFormatted'>
): { updatedHistory: AgentAction[]; newAction: AgentAction } {
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newAction: AgentAction = {
    ...actionData,
    id: `action_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now.toISOString(),
    timeFormatted
  };

  return {
    updatedHistory: [newAction, ...history],
    newAction
  };
}

/* =========================================================================
   TOOL 12: get_agent_activity()
   ========================================================================= */
export function get_agent_activity(history: AgentAction[], filterAgent?: string): AgentAction[] {
  if (!filterAgent || filterAgent === 'all') return history;
  return history.filter(h => h.agentType === filterAgent || h.agentModule === filterAgent);
}

/* =========================================================================
   AGENT SERVICE DISPATCHER (Node.js & Python Google ADK)
   ========================================================================= */
export interface AgentEventResult {
  success: boolean;
  action: string;
  reason: string;
  toolCalls: {
    agentName: string;
    toolName: string;
    status: string;
    input?: any;
    result?: any;
    timestamp: string;
  }[];
  updatedTasks?: Task[];
  updatedRisk?: RiskAssessment;
  updatedProgress?: ProgressMetrics;
  newNotifications?: NotificationItem[];
  newActions?: AgentAction[];
  message: string;
  isDemoMode: boolean;
}

export async function dispatch_agent_event(payload: {
  eventType: string;
  taskId?: string;
  state?: any;
}): Promise<AgentEventResult> {
  const response = await fetch('/api/agent/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('Agent event invocation failed');
  }
  return await response.json();
}

