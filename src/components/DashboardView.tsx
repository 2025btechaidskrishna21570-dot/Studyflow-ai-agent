/**
 * StudyFlow Main Dashboard View
 * Autonomous Academic Operations Agent
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DailyBriefingCard from './DailyBriefingCard';
import {
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Play,
  RotateCw,
  Plus,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { Task } from '../types';

export const DashboardView: React.FC = () => {
  const {
    user,
    subjects,
    exams,
    tasks,
    progress,
    riskAssessment,
    actionHistory,
    completeTask,
    markTaskMissed,
    rescheduleTaskManually,
    setCurrentView,
    runAutonomousDemo,
    isDemoRunning
  } = useApp();

  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date === todayStr);
  const overdueTasks = tasks.filter(t => t.date < todayStr && t.status === 'pending');
  const missedTasks = tasks.filter(t => t.status === 'missed');
  const rescheduledTasks = tasks.filter(t => t.status === 'rescheduled');

  // Next nearest exam
  const sortedExams = [...exams].sort((a, b) => a.daysRemaining - b.daysRemaining);
  const nearestExam = sortedExams[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Daily Briefing Card */}
      <DailyBriefingCard />

      {/* 2. Top 4 High-Contrast KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Overall Progress */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Syllabus Progress</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{progress.completionRate}%</span>
            <span className="text-xs text-slate-400">{progress.completedTasks} / {progress.totalTasks} sessions</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.completionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Today's Workload */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today&apos;s Workload</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {Math.round((todaysTasks.reduce((acc, t) => acc + t.durationMinutes, 0) / 60) * 10) / 10}h
            </span>
            <span className="text-xs text-slate-400">{todaysTasks.length} planned sessions</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Capacity: {user.availableHoursPerDay}h max</span>
            <span className="text-emerald-400 font-medium">Optimal</span>
          </div>
        </div>

        {/* Metric 3: Academic Risk Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
          onClick={() => setCurrentView('risk_intelligence')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Academic Risk Level</span>
            <div className={`p-2 rounded-lg ${
              riskAssessment.overallRiskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
              riskAssessment.overallRiskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
              riskAssessment.overallRiskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
              'bg-emerald-500/20 text-emerald-400'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${
              riskAssessment.overallRiskLevel === 'CRITICAL' || riskAssessment.overallRiskLevel === 'HIGH' ? 'text-red-400' : 'text-white'
            }`}>
              {riskAssessment.overallRiskLevel}
            </span>
            <span className="text-xs text-slate-400">Score: {riskAssessment.overallRiskScore}/100</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {nearestExam ? `${nearestExam.subjectName} in ${nearestExam.daysRemaining} days` : 'Exams safeguarded'}
          </div>
        </div>

        {/* Metric 4: Study Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Study Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{progress.studyStreakDays} Days</span>
            <span className="text-xs text-slate-400">Target: 7 Days</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Est. Sprint Complete: <strong className="text-slate-200">{progress.estimatedCompletionDate}</strong>
          </div>
        </div>

      </div>

      {/* 3. Main Operational Grid: Today's Tasks (Left 8 cols) & Subject Risk / Agent Stream (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Today's Tasks & Overdue Reschedule Banner (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Overdue / Missed Alert Banner (if applicable) */}
          {(overdueTasks.length > 0 || missedTasks.length > 0) && (
            <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/80 flex items-start justify-between gap-3 text-orange-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-orange-300">
                    {missedTasks.length > 0 ? `${missedTasks.length} Missed Session(s) Handled by Autonomous Agent` : `${overdueTasks.length} Overdue Session(s) Detected`}
                  </h4>
                  <p className="text-xs text-orange-200/80 mt-0.5 leading-relaxed">
                    {missedTasks.length > 0
                      ? 'The Orchestrator Agent detected missed milestone requirements and automatically rescheduled them to protect exam proximity.'
                      : 'Unfinished sessions from previous days may compromise exam milestone confidence.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('adaptive_plan')}
                className="px-3 py-1.5 rounded-lg bg-orange-800 hover:bg-orange-700 text-white text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Inspect Plan
              </button>
            </div>
          )}

          {/* Today's Tasks Header & Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-white">Today&apos;s Study Operations</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Autonomous task schedule allocated for {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('adaptive_plan')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  Full Timeline <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Task Item Cards */}
            {todaysTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/50" />
                <p className="text-xs">No pending tasks for today. You are fully caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map(task => {
                  const subject = subjects.find(s => s.id === task.subjectId || s.name === task.subjectName);
                  const isCompleted = task.status === 'completed';
                  const isMissed = task.status === 'missed';
                  const isRescheduled = task.status === 'rescheduled';

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? 'bg-slate-950/60 border-slate-850 opacity-75'
                          : isMissed
                          ? 'bg-red-950/20 border-red-900/40'
                          : isRescheduled
                          ? 'bg-indigo-950/20 border-indigo-900/40'
                          : 'bg-slate-850/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Task Subject & Title */}
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: subject?.color || '#3b82f6' }}
                            >
                              {task.subjectName}
                            </span>

                            <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                              task.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {task.priority}
                            </span>

                            {isRescheduled && (
                              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                                <RotateCw className="w-2.5 h-2.5" /> Rescheduled
                              </span>
                            )}
                          </div>

                          <h4 className={`text-sm font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {task.title}
                          </h4>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {task.description}
                          </p>

                          {isRescheduled && task.rescheduleReason && (
                            <p className="text-[11px] text-cyan-300/90 font-mono pt-1">
                              ↳ {task.rescheduleReason}
                            </p>
                          )}
                        </div>

                        {/* Task Meta & Interactive Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                            <span>{task.startTime || '14:00'}</span>
                            <span>•</span>
                            <span>{task.durationMinutes} mins</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {!isCompleted && !isMissed && (
                              <>
                                <button
                                  onClick={() => completeTask(task.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                                  title="Mark Completed"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Complete</span>
                                </button>

                                <button
                                  onClick={() => markTaskMissed(task.id)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 text-xs font-medium transition-colors"
                                  title="Mark Missed & Trigger Autonomous Adaptation"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Missed</span>
                                </button>
                              </>
                            )}

                            {isCompleted && (
                              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Completed
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Recommendations Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Planner & Risk Agent Recommendations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-amber-400 font-semibold font-mono">Exam Buffer Rule</span>
                <p className="text-slate-300 leading-relaxed">
                  Physics Mid-Term is 4 days away. The agent maintains a 45-minute derivation practice reserve.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-cyan-400 font-semibold font-mono">Workload Balancing</span>
                <p className="text-slate-300 leading-relaxed">
                  DSA confidence is high (4/5). 30 mins can be safely reallocated to Physics if additional delay occurs.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Subject Risk Cards & Live Agent Audit Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Subject Risk Mini-Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Subject Risk Radar</span>
              </h3>
              <button
                onClick={() => setCurrentView('risk_intelligence')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                Deep Dive →
              </button>
            </div>

            <div className="space-y-2.5">
              {riskAssessment.subjectRisks.map(sr => (
                <div
                  key={sr.subjectId}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{sr.subjectName}</span>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      sr.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      sr.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      sr.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {sr.riskLevel} RISK
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sr.remainingSyllabusPercent}% syllabus left</span>
                    <span className="font-mono text-slate-300">{sr.daysUntilExam} days to exam</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        sr.riskLevel === 'CRITICAL' || sr.riskLevel === 'HIGH' ? 'bg-red-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${100 - sr.remainingSyllabusPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Agent Activity Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Agent Activity Stream</span>
              </h3>
              <button
                onClick={() => setCurrentView('activity_center')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                Full Audit Log →
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {actionHistory.slice(0, 5).map(act => (
                <div key={act.id} className="flex items-start gap-2.5 text-slate-300">
                  <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">{act.timeFormatted}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{act.title}</p>
                    <p className="text-[11px] text-slate-400 font-sans leading-tight mt-0.5">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Launch Autonomous Demo CTA Box */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-5 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
              Interactive Hackathon Demo
            </span>
            <h4 className="text-sm font-bold text-white leading-snug">
              Demonstrate Real-Time Agent Adaptation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Triggers simulated missed Physics task, risk elevation, and autonomous multi-task rescheduling.
            </p>
            <button
              onClick={() => runAutonomousDemo()}
              disabled={isDemoRunning}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isDemoRunning ? 'Running Demo Simulation...' : 'Run Autonomous Agent Demo'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardView;
