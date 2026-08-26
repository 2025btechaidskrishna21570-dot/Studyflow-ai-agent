/**
 * StudyFlow Landing Page
 * Autonomous Academic Operations Agent
 * 
 * SaaS / Hackathon Presentation Quality
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Brain,
  Sparkles,
  Calendar,
  ShieldAlert,
  Activity,
  ArrowRight,
  Play,
  CheckCircle2,
  Cpu,
  Clock,
  Layers,
  Zap,
  TrendingUp,
  AlertOctagon,
  RefreshCw,
  GitBranch
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setShowOnboarding, runAutonomousDemo } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/20 via-cyan-900/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium shadow-sm hover:border-slate-700 transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 font-semibold">STUDYFLOW</span>
            <span className="text-slate-500">•</span>
            <span>Autonomous Academic Operations Agent</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Plan less. Learn smarter.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Let your AI agent manage the workload.
            </span>
          </h1>

          {/* Subtitle / Tagline */}
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Your autonomous AI study partner. Not just a static timetable generator — an active agent that audits progress, detects deadline risks, and autonomously reschedules tasks when plans change.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setShowOnboarding(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 group transition-all active:scale-98"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => runAutonomousDemo()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700/80 hover:border-slate-600 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
            >
              <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span>See Agent Demo</span>
            </button>
          </div>

          {/* Quick Features List */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Autonomous Rescheduling
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Syllabus AI Decomposition
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mathematical Risk Scoring
            </span>
          </div>

        </div>

        {/* Live Interactive Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur">
          <div className="p-4 bg-slate-850/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">StudyFlow Agent Operations Console</span>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Enter Dashboard →
            </button>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Daily Briefing Preview */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Daily Briefing</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Good morning, Krishna. You have 3 priority tasks today. Physics is currently high risk (exam in 4 days). I moved 30 mins from Java to Physics to protect your deadline.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60">
                <span>Autonomous Strategy</span>
                <span className="text-emerald-400 font-medium">Applied</span>
              </div>
            </div>

            {/* Column 2: Autonomous Risk Detector */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Risk Intelligence</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  HIGH RISK
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Engineering Physics is HIGH RISK because 62% of syllabus remains and only 4 study days are available.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60">
                <span>Risk Score</span>
                <span className="text-red-400 font-bold font-mono">72 / 100</span>
              </div>
            </div>

            {/* Column 3: Live Agent Workflow */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Agent Activity Stream</span>
              </div>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">18:15</span>
                  <span className="text-orange-400">Task marked overdue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">18:15</span>
                  <span className="text-red-400">Risk elevated (HIGH)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">18:16</span>
                  <span className="text-emerald-400">2 tasks rescheduled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">18:16</span>
                  <span className="text-indigo-400">Study plan updated</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-850">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Real Academic Operations
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Four specialized agent layers collaborate autonomously to ensure no college deadline slips through the cracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-white">Autonomous AI Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coordinates multi-step actions across syllabus parsing, task generation, schedule auditing, and automated risk mitigation.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-white">Adaptive Planning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a session is missed, StudyFlow instantly shifts flexible review blocks and reallocates time to protect upcoming exams.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-white">Smart Risk Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quantifies academic risk with four distinct levels (LOW, MEDIUM, HIGH, CRITICAL) factoring exam proximity and remaining workload.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-white">Progress Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tracks actual velocity, study streaks, subject mastery curves, and projects realistic syllabus completion trajectories.
            </p>
          </div>

        </div>
      </section>

      {/* Autonomous Workflow Demonstration Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-850">
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Autonomous Adaptation Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              How the Agent Handles a Missed Exam Topic
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Unlike static calendar apps that leave missed tasks behind, StudyFlow runs an autonomous 10-step recovery loop:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-850 border border-slate-800">
              <span className="text-indigo-400 font-bold font-mono">01.</span>
              <p className="font-semibold text-slate-200 mt-1">Missed Task Detected</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Physics 90-min session overdue</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-850 border border-slate-800">
              <span className="text-indigo-400 font-bold font-mono">02.</span>
              <p className="font-semibold text-slate-200 mt-1">Risk Recalculated</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Elevated to HIGH (4 days to exam)</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-850 border border-slate-800">
              <span className="text-indigo-400 font-bold font-mono">03.</span>
              <p className="font-semibold text-slate-200 mt-1">Capacity Analyzed</p>
              <p className="text-[11px] text-slate-400 mt-0.5">3.5 hrs available tomorrow</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-850 border border-slate-800">
              <span className="text-indigo-400 font-bold font-mono">04.</span>
              <p className="font-semibold text-slate-200 mt-1">Schedule Rebalanced</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Relocated to tomorrow 16:00</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-850 border border-slate-800">
              <span className="text-indigo-400 font-bold font-mono">05.</span>
              <p className="font-semibold text-slate-200 mt-1">Audit Logged</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Student notified & briefed</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-800/80">
            <div className="text-xs text-slate-400">
              Try the live interactive test scenario with real state changes.
            </div>
            <button
              onClick={() => runAutonomousDemo()}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Demo Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>StudyFlow • Autonomous Academic Operations Agent • Powered by Google AI</p>
      </footer>

    </div>
  );
};

export default LandingPage;
