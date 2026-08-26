/**
 * StudyFlow AI Daily Briefing
 * Concise, high-impact morning briefing synthesized by the Autonomous Agent
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldAlert,
  Calendar,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';

export const DailyBriefingCard: React.FC = () => {
  const { dailyBriefing, user, tasks, riskAssessment, setCurrentView } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date === todayStr);
  const pendingToday = todaysTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/40 border border-slate-800 p-6 shadow-xl">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="space-y-3 max-w-2xl">
          {/* Header Tag */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autonomous AI Daily Briefing</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Student Greeting */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {dailyBriefing.studentGreeting}
          </h2>

          {/* Core Briefing Text */}
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            You have <strong className="text-white font-semibold">{pendingToday.length} priority tasks</strong> scheduled for today. {dailyBriefing.autonomousAdjustmentSummary}
          </p>

          {/* Suggested Focus */}
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800/80">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-slate-100">Recommended Focus:</strong> {dailyBriefing.suggestedFocus}
            </span>
          </div>
        </div>

        {/* Right CTA / Quick Actions */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
          <div className="text-left md:text-right">
            <span className="text-[11px] text-slate-400">Daily Workload</span>
            <p className="text-lg font-bold text-white font-mono">
              {todaysTasks.reduce((acc, t) => acc + t.durationMinutes, 0) / 60} hrs
            </p>
          </div>

          <button
            onClick={() => setCurrentView('adaptive_plan')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <span>View Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default DailyBriefingCard;
