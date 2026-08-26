/**
 * StudyFlow Risk Intelligence View
 * Real-time academic risk monitoring and mathematical risk engine
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  RotateCw,
  Cpu,
  CheckCircle2,
  TrendingDown,
  Percent,
  Check
} from 'lucide-react';

export const RiskIntelligenceView: React.FC = () => {
  const {
    riskAssessment,
    subjects,
    exams,
    user,
    recalculateRisk,
    runAutonomousDemo,
    setCurrentView
  } = useApp();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'HIGH':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Autonomous Risk Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Academic Risk Intelligence & Early Warning System
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Continuously calculates workload feasibility, exam proximity decay, and topic difficulty to prevent last-minute cramming.
          </p>
        </div>

        <button
          onClick={recalculateRisk}
          className="self-start md:self-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Recalculate Risk Engine</span>
        </button>
      </div>

      {/* Top Banner: Overall Risk Assessment */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-red-950/30 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: Overall Badge & Score (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Academic Status</span>
            <div className="flex items-center gap-4">
              <span className={`text-3xl sm:text-4xl font-extrabold font-mono px-4 py-1.5 rounded-xl border ${getRiskColor(riskAssessment.overallRiskLevel)}`}>
                {riskAssessment.overallRiskLevel} RISK
              </span>
              <div>
                <p className="text-2xl font-bold text-white font-mono">{riskAssessment.overallRiskScore} / 100</p>
                <p className="text-[11px] text-slate-400">Composite Risk Index</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {riskAssessment.overallRiskScore > 65
                ? 'Action Required: Several core milestones are currently bottlenecked. The agent has prepared adaptive reallocation strategies.'
                : 'Study velocity is on track with current exam proximity thresholds.'}
            </p>
          </div>

          {/* Right: Risk Factor Breakdown (7 cols) */}
          <div className="md:col-span-7 bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Mathematical Risk Engine Formula
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500">Exam Proximity</span>
                <p className="font-bold text-white mt-0.5">Exponential Decay</p>
                <p className="text-[10px] text-slate-400 mt-0.5">High weight &lt; 7 days</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500">Remaining Syllabus</span>
                <p className="font-bold text-white mt-0.5">Workload Ratio</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Hours needed vs left</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500">Missed Penalty</span>
                <p className="font-bold text-white mt-0.5">+15 pts / Missed</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Triggers instant alert</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500">Student Confidence</span>
                <p className="font-bold text-white mt-0.5">Inverse Rating</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Low confidence boosted</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Subject-by-Subject Deep Risk Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Subject-Level Risk & Mitigation Radar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {riskAssessment.subjectRisks.map(sr => {
            const subject = subjects.find(s => s.id === sr.subjectId || s.name === sr.subjectName);
            const exam = exams.find(e => e.subjectId === sr.subjectId || e.subjectName === sr.subjectName);

            return (
              <div
                key={sr.subjectId}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: subject?.color || '#3b82f6' }} />
                      <h3 className="font-bold text-base text-white">{sr.subjectName}</h3>
                      <span className="text-xs text-slate-500">({subject?.code || 'CRS'})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {exam ? `${exam.title} in ${exam.daysRemaining} days (${exam.examDate})` : 'No upcoming exam configured'}
                    </p>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg border ${getRiskColor(sr.riskLevel)}`}>
                    {sr.riskLevel} RISK ({sr.riskScore})
                  </span>
                </div>

                {/* Quantitative Metric Badges */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                  <div>
                    <p className="text-[11px] text-slate-400">Remaining</p>
                    <p className="text-sm font-bold text-white font-mono">{sr.remainingSyllabusPercent}%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Days to Exam</p>
                    <p className={`text-sm font-bold font-mono ${sr.daysUntilExam <= 5 ? 'text-red-400' : 'text-slate-200'}`}>
                      {sr.daysUntilExam} Days
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Missed Sessions</p>
                    <p className={`text-sm font-bold font-mono ${sr.missedTasksCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {sr.missedTasksCount}
                    </p>
                  </div>
                </div>

                {/* Autonomous Analysis Summary */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    {sr.reasonSummary}
                  </p>
                </div>

                {/* AI Actionable Mitigation Suggestions */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Agent Mitigation Strategy:</span>
                  </span>
                  <div className="space-y-1.5">
                    {sr.suggestedActions.map((action, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-start gap-2 text-xs text-slate-300 bg-slate-850 p-2.5 rounded-lg border border-slate-800"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => setCurrentView('adaptive_plan')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    Adjust {sr.subjectName} in Schedule →
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default RiskIntelligenceView;
