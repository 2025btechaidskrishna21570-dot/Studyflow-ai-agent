/**
 * StudyFlow Architecture & Cloud Readiness Inspector
 * Transparent system architecture & Google Cloud Roadmap
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Layers,
  Cpu,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'tools' | 'firestore' | 'scheduler'>('architecture');

  const toolsList = [
    { name: 'analyze_syllabus', description: 'Parses raw text/PDF syllabus into structured topics with difficulty ratings and study hours.' },
    { name: 'create_initial_study_plan', description: 'Synthesizes student capacity, exams, and topics into an optimized schedule.' },
    { name: 'create_task', description: 'Inserts custom study sessions into the active timeline.' },
    { name: 'mark_task_completed', description: 'Updates velocity, logs study streak, and advances subject mastery.' },
    { name: 'mark_task_missed', description: 'Triggers emergency risk recalculation and signals Orchestrator Agent.' },
    { name: 'reschedule_tasks', description: 'Autonomously moves overdue or bottlenecked tasks to available future slots.' },
    { name: 'detect_risk', description: 'Runs mathematical risk formula evaluating proximity decay, syllabus weight, and capacity.' },
    { name: 'generate_daily_briefing', description: 'Synthesizes concise morning briefing highlighting priorities and adjustments.' },
    { name: 'rebalance_workload', description: 'Reallocates time from high-confidence courses to critical exam subjects.' },
    { name: 'audit_agent_actions', description: 'Appends audit trace to the activity center log.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">System Architecture & Cloud Readiness</h2>
              <p className="text-xs text-slate-400">Google Gemini • Google ADK • Firestore • Cloud Run • Cloud Scheduler</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 gap-2 text-xs">
          {[
            { id: 'architecture', label: '4-Tier Architecture' },
            { id: 'tools', label: 'Gemini Tool Registry' },
            { id: 'firestore', label: 'Firestore Schema' },
            { id: 'scheduler', label: 'Cloud Scheduler / PubSub' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* TAB 1: 4-Tier Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Honest Status Callout */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Integration Status & Separation of Concerns</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  StudyFlow strictly enforces clean architectural boundaries. The <strong>Agent Engine</strong>, <strong>Tool Layer</strong>, <strong>Data Layer</strong>, and <strong>UI Presentation</strong> are isolated. Active operations are handled via the Node orchestrator and live server-side Gemini Flash API, with full support for connecting the external Python <strong>Google ADK (Agent Development Kit)</strong> service.
                </p>
              </div>

              {/* 4 Agent Modules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-400" /> 1. Planner Agent
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Parses curriculums, evaluates topic difficulty weights, aligns tasks with student daily capacity, and generates balanced study milestones.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-emerald-400" /> 2. Progress Agent
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Audits session completions, calculates actual study velocity against planned hours, updates streaks, and tracks subject mastery percentages.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-red-400" /> 3. Risk Agent
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Executes mathematical risk scoring factoring exam proximity decay, remaining syllabus volume, and missed task penalties to trigger alerts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-cyan-400" /> 4. Orchestrator Agent
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Coordinates multi-agent state loops. When a missed task occurs, it shifts flexible review buffers and autonomously rebalances future days.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Tool Registry */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                10 structured tools compatible with <strong>Google ADK (Agent Development Kit)</strong> and Gemini 3.5/3.7 Function Calling:
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {toolsList.map((tool, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono">
                    <div className="flex items-center justify-between text-indigo-300 font-bold">
                      <span>{tool.name}()</span>
                      <span className="text-[10px] text-slate-500 font-sans">JSON Schema Standard</span>
                    </div>
                    <p className="text-slate-400 font-sans text-xs">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Firestore Schema */}
          {activeTab === 'firestore' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Data models are designed 1:1 for <strong>Google Cloud Firestore</strong> collections:
              </p>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-[11px] leading-relaxed overflow-x-auto">
{`// Cloud Firestore Collections Schema
/users/{userId}
  - name: string
  - availableHoursPerDay: number
  - targetGpa: number
  - preferredStudyTimes: array<string>

/users/{userId}/subjects/{subjectId}
  - name: string
  - code: string
  - currentConfidence: number (1-5)
  - totalEstimatedHours: number
  - completedHours: number

/users/{userId}/tasks/{taskId}
  - subjectId: string
  - title: string
  - date: string (YYYY-MM-DD)
  - durationMinutes: number
  - status: "pending" | "completed" | "missed" | "rescheduled"
  - priority: "urgent" | "high" | "medium" | "low"
  - rescheduleReason?: string

/users/{userId}/agent_actions/{actionId}
  - agentModule: "PLANNER" | "PROGRESS" | "RISK" | "ORCHESTRATOR"
  - toolName: string
  - title: string
  - description: string
  - timestamp: ISO8601`}
              </pre>
            </div>
          )}

          {/* TAB 4: Scheduler / PubSub */}
          {activeTab === 'scheduler' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Autonomous triggers configured for <strong>Google Cloud Scheduler</strong> and <strong>Cloud Pub/Sub</strong>:
              </p>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-indigo-300 font-semibold">
                    <span>1. Daily Morning Briefing Generator</span>
                    <span className="font-mono text-slate-500">Cron: 0 7 * * *</span>
                  </div>
                  <p className="text-slate-400">
                    Triggers <code>generate_daily_briefing()</code> at 07:00 daily to synthesize student focus and adjustments.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-cyan-300 font-semibold">
                    <span>2. Continuous Workload & Deadline Audit</span>
                    <span className="font-mono text-slate-500">Pub/Sub Event-Driven</span>
                  </div>
                  <p className="text-slate-400">
                    When a session is marked missed or overdue, a Pub/Sub message triggers the Orchestrator Agent to execute <code>reschedule_tasks()</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">StudyFlow Core Architecture v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArchitectureModal;
