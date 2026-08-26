/**
 * StudyFlow Autonomous Agent Engine
 * Core Agent Architecture with 4 Conceptual Modules:
 * 
 * 1. Planner Agent: Syllabus analysis, task breakdown, duration estimation, priority weighting.
 * 2. Progress Agent: Task completion tracking, velocity, subject drift detection.
 * 3. Risk Agent: Mathematical risk scoring, capacity deficit calculation, deadline proximity evaluation.
 * 4. Action / Orchestrator Agent: Autonomous adaptation workflow, task rescheduling, schedule rebalancing, audit logging.
 * 
 * Ready for Google ADK (Agent Development Kit) & Firestore synchronization.
 */

import {
  AnalyzeSyllabusInput,
  AnalyzeSyllabusOutput,
  CreateStudyPlanInput,
  Task,
  Subject,
  Exam,
  RiskAssessment,
  ProgressMetrics,
  AgentAction,
  NotificationItem,
  DailyBriefing,
  UserProfile
} from '../types';
import * as tools from './agentTools';

/* =========================================================================
   1. PLANNER AGENT
   ========================================================================= */
export class PlannerAgent {
  static readonly agentName = 'Planner Agent';
  static readonly role = 'Academic Workload Decomposition & Priority Sequencing';

  /**
   * Analyzes syllabus and breaks down complex curriculum into granular study modules
   */
  async analyzeSyllabus(input: AnalyzeSyllabusInput): Promise<AnalyzeSyllabusOutput> {
    return await tools.analyze_syllabus(input);
  }

  /**
   * Creates an optimized multi-day study plan matching student available hours
   */
  createStudyPlan(input: CreateStudyPlanInput) {
    return tools.create_study_plan(input);
  }

  /**
   * Prioritizes topics based on exam weight, difficulty, and current student confidence
   */
  prioritizeTopics(topics: AnalyzeSyllabusOutput['topics'], studentConfidence: number) {
    return [...topics].sort((a, b) => {
      // Low confidence increases priority weight
      const confMultiplier = studentConfidence <= 2 ? 1.5 : 1.0;
      const scoreA = (a.isHighPriority ? 10 : 0) + (a.difficulty === 'advanced' ? 5 : a.difficulty === 'hard' ? 3 : 1) * confMultiplier;
      const scoreB = (b.isHighPriority ? 10 : 0) + (b.difficulty === 'advanced' ? 5 : b.difficulty === 'hard' ? 3 : 1) * confMultiplier;
      return scoreB - scoreA;
    });
  }
}

/* =========================================================================
   2. PROGRESS AGENT
   ========================================================================= */
export class ProgressAgent {
  static readonly agentName = 'Progress Agent';
  static readonly role = 'Velocity Tracking, Completion Auditing & Drift Detection';

  /**
   * Calculates overall and per-subject progress metrics
   */
  calculateProgress(tasks: Task[], subjects: Subject[]): ProgressMetrics {
    return tools.get_progress(tasks, subjects);
  }

  /**
   * Audits task completion and logs mastery update
   */
  recordCompletion(tasks: Task[], taskId: string) {
    return tools.complete_task(tasks, taskId);
  }

  /**
   * Detects missed or overdue tasks
   */
  detectOverdueTasks(tasks: Task[], currentDateStr: string): Task[] {
    return tasks.filter(t => t.date < currentDateStr && (t.status === 'pending' || t.status === 'in_progress'));
  }
}

/* =========================================================================
   3. RISK AGENT
   ========================================================================= */
export class RiskAgent {
  static readonly agentName = 'Risk Agent';
  static readonly role = 'Predictive Academic Risk Scoring & Deadline Proximity Guard';

  /**
   * Computes multi-factor risk assessment (0-100) and actionable explanations
   */
  evaluateAcademicRisk(tasks: Task[], subjects: Subject[], exams: Exam[]): RiskAssessment {
    return tools.detect_risk(tasks, subjects, exams);
  }
}

/* =========================================================================
   4. ACTION / ORCHESTRATOR AGENT
   ========================================================================= */
export class OrchestratorAgent {
  static readonly agentName = 'Action / Orchestrator Agent';
  static readonly role = 'Autonomous Decision Coordination, Rescheduling & Event Dispatch';

  /**
   * Executes the full 10-step Autonomous Adaptation Workflow:
   * 1. Missed task detected
   * 2. Remaining workload analyzed
   * 3. Exam deadline checked
   * 4. Subject risk recalculated
   * 5. Available study time checked
   * 6. New schedule generated
   * 7. Affected tasks rescheduled
   * 8. Updated plan saved
   * 9. Student notified
   * 10. Agent activity recorded
   */
  static executeAutonomousAdaptation(params: {
    tasks: Task[];
    taskId: string;
    subjects: Subject[];
    exams: Exam[];
    user: UserProfile;
  }) {
    const { tasks, taskId, subjects, exams, user } = params;

    // Step 1: Mark missed
    const missedRes = tools.mark_task_missed(tasks, taskId);
    const targetTask = tasks.find(t => t.id === taskId);

    // Step 2 & 3: Recalculate Risk
    const newRisk = tools.detect_risk(missedRes.updatedTasks, subjects, exams);

    // Step 4 & 5 & 6: Autonomously reschedule
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const rescheduleRes = tools.reschedule_tasks({
      tasks: missedRes.updatedTasks,
      tasksToReschedule: [
        {
          taskId,
          newDate: tomorrowStr,
          newStartTime: '16:00',
          reason: `Autonomous Adaptation: Rescheduled missed session for ${targetTask?.subjectName || 'course'} to protect upcoming exam readiness.`
        }
      ],
      userAvailableHoursPerDay: user.availableHoursPerDay
    });

    // Step 7: Calculate updated progress
    const newProgress = tools.get_progress(rescheduleRes.tasks, subjects);

    // Step 8 & 9: Create notifications
    const newNotifications: NotificationItem[] = [
      {
        id: `notif_${Date.now()}_1`,
        type: 'risk',
        title: `Academic Risk Elevated: ${targetTask?.subjectName || 'Subject'}`,
        message: `Missed session increased risk score to ${newRisk.overallRiskScore}/100. Emergency rebalancing initiated.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        priority: 'high'
      },
      {
        id: `notif_${Date.now()}_2`,
        type: 'rescheduled',
        title: `Autonomous Rescheduling Complete`,
        message: `Shifted "${targetTask?.title || 'Study Session'}" to tomorrow at 16:00. Next week buffer preserved.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        priority: 'medium'
      }
    ];

    // Step 10: Log agent actions
    const newActions: AgentAction[] = [
      {
        id: `act_${Date.now()}_1`,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentModule: 'PROGRESS',
        toolName: 'mark_task_missed',
        title: `Session Marked Missed: ${targetTask?.title || 'Task'}`,
        description: `Progress Agent detected incomplete session for ${targetTask?.subjectName}. Triggered risk recalculation.`,
        status: 'completed',
        payload: { taskId, subject: targetTask?.subjectName, previousDate: targetTask?.date }
      },
      {
        id: `act_${Date.now()}_2`,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentModule: 'RISK',
        toolName: 'detect_risk',
        title: `Academic Risk Recalculated (${newRisk.overallRiskLevel})`,
        description: `Risk score shifted to ${newRisk.overallRiskScore}/100 with ${targetTask?.subjectName} reaching high risk tier.`,
        status: 'completed',
        payload: { overallRiskLevel: newRisk.overallRiskLevel, score: newRisk.overallRiskScore }
      },
      {
        id: `act_${Date.now()}_3`,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentModule: 'ORCHESTRATOR',
        toolName: 'reschedule_tasks',
        title: `Autonomous Plan Rebalanced: 1 Task Relocated`,
        description: `Rescheduled to ${tomorrowStr} 16:00. Time reallocated to safeguard exam deadline.`,
        status: 'completed',
        payload: { taskId, targetDate: tomorrowStr, reason: 'Exam proximity protection' }
      }
    ];

    return {
      updatedTasks: rescheduleRes.tasks,
      updatedRisk: newRisk,
      updatedProgress: newProgress,
      newNotifications,
      newActions
    };
  }
}
