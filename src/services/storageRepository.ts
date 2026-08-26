/**
 * StudyFlow Storage Repository
 * Autonomous Academic Operations Agent
 * 
 * Clean Repository Pattern isolating persistence logic.
 * Currently backs to localStorage with zero leakage, prepared for direct Google Cloud Firestore binding.
 */

import { UserProfile, Subject, Exam, Task, StudyPlan, AgentAction, NotificationItem, DailyBriefing } from '../types';
import { INITIAL_USER, INITIAL_SUBJECTS, INITIAL_EXAMS, INITIAL_TASKS, INITIAL_ACTIONS, INITIAL_NOTIFICATIONS, INITIAL_DAILY_BRIEFING } from './initialData';

const STORAGE_KEY = 'studyflow_app_state_v2';

export function calculateDaysRemaining(examDateStr: string): number {
  if (!examDateStr) return 0;
  const target = new Date(examDateStr);
  const now = new Date();
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.ceil((targetMidnight - nowMidnight) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function syncExamDaysRemaining(exams: Exam[]): Exam[] {
  return exams.map(e => ({
    ...e,
    daysRemaining: calculateDaysRemaining(e.examDate)
  }));
}

export interface AppStateData {
  user: UserProfile;
  subjects: Subject[];
  exams: Exam[];
  tasks: Task[];
  activePlan: StudyPlan | null;
  actionHistory: AgentAction[];
  notifications: NotificationItem[];
  dailyBriefing: DailyBriefing;
}

export class StorageRepository {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  static loadState(): AppStateData {
    if (!this.isBrowser()) {
      return {
        user: INITIAL_USER,
        subjects: INITIAL_SUBJECTS,
        exams: syncExamDaysRemaining(INITIAL_EXAMS),
        tasks: INITIAL_TASKS,
        activePlan: null,
        actionHistory: INITIAL_ACTIONS,
        notifications: INITIAL_NOTIFICATIONS,
        dailyBriefing: INITIAL_DAILY_BRIEFING
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('studyflow_app_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Migrate & sanitize UserProfile
        const rawUser = parsed.user || {};
        const targetCgpaVal = rawUser.targetCgpa ?? (rawUser.targetGpa && rawUser.targetGpa <= 4.0 ? +(rawUser.targetGpa * 2.4).toFixed(1) : (rawUser.targetGpa ?? 9.2));
        const user: UserProfile = {
          ...INITIAL_USER,
          ...rawUser,
          targetCgpa: targetCgpaVal,
          currentCgpa: rawUser.currentCgpa ?? 8.4,
          semester: rawUser.semester ?? 4,
          expectedGraduationYear: rawUser.expectedGraduationYear ?? 2026
        };

        const subjects: Subject[] = Array.isArray(parsed.subjects) && parsed.subjects.length > 0
          ? parsed.subjects
          : INITIAL_SUBJECTS;

        const rawExams: Exam[] = Array.isArray(parsed.exams) && parsed.exams.length > 0
          ? parsed.exams
          : INITIAL_EXAMS;

        // Dynamically compute days remaining from current date
        const exams: Exam[] = syncExamDaysRemaining(rawExams);

        const tasks: Task[] = Array.isArray(parsed.tasks) ? parsed.tasks : INITIAL_TASKS;
        const activePlan: StudyPlan | null = parsed.activePlan || null;
        const actionHistory: AgentAction[] = Array.isArray(parsed.actionHistory) ? parsed.actionHistory : INITIAL_ACTIONS;
        const notifications: NotificationItem[] = Array.isArray(parsed.notifications) ? parsed.notifications : INITIAL_NOTIFICATIONS;
        const dailyBriefing: DailyBriefing = parsed.dailyBriefing || INITIAL_DAILY_BRIEFING;

        return {
          user,
          subjects,
          exams,
          tasks,
          activePlan,
          actionHistory,
          notifications,
          dailyBriefing
        };
      }
    } catch (err) {
      console.warn('[StorageRepository] Error reading stored state, falling back to defaults:', err);
    }

    return {
      user: INITIAL_USER,
      subjects: INITIAL_SUBJECTS,
      exams: syncExamDaysRemaining(INITIAL_EXAMS),
      tasks: INITIAL_TASKS,
      activePlan: null,
      actionHistory: INITIAL_ACTIONS,
      notifications: INITIAL_NOTIFICATIONS,
      dailyBriefing: INITIAL_DAILY_BRIEFING
    };
  }

  static saveState(state: AppStateData): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[StorageRepository] Failed to save state to localStorage:', err);
    }
  }

  static clearState(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('studyflow_app_state_v1');
    } catch (err) {
      console.warn('[StorageRepository] Failed to clear storage:', err);
    }
  }
}
