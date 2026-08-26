/**
 * StudyFlow Agent Activity Center
 * Transparent, multi-agent audit log with state change inspections
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Brain,
  Calendar,
  ShieldAlert,
  Sparkles,
  RotateCw,
  Clock,
  Layers,
  Code,
  CheckCircle2,
  AlertTriangle,
  Play,
  Filter
} from 'lucide-react';
import { AgentModule, AgentAction } from '../types';

export const AgentActivityCenter: React.FC = () => {
  const { actionHistory, runAutonomousDemo, isDemoRunning } = useApp();
  const [selectedModule, setSelectedModule] = useState<'ALL' | AgentModule>('ALL');
  const [inspectedAction, setInspectedAction] = useState<AgentAction | null>(null);

  const filteredActions = actionHistory.filter(act =>
    selectedModule === 'ALL' ? true : act.agentModule === selectedModule
  );

  const getModuleBadge = (module: AgentModule) => {
    switch (module) {
      case 'PLANNER':
        return { label: 'Planner Agent', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'PROGRESS':
        return { label: 'Progress Agent', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'RISK':
        return { label: 'Risk Agent', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      case 'ORCHESTRATOR':
        return { label: 'Orchestrator Agent', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      default:
        return { label: 'System Agent', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Autonomous Orchestration Trace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Agent Activity & Execution Audit Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time event stream showing continuous collaboration between Planner, Progress, Risk, and Orchestrator Agents.
          </p>
        </div>

        <button
          onClick={() => runAutonomousDemo()}
          disabled={isDemoRunning}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isDemoRunning ? 'Executing Live Trace...' : 'Trigger Trace Demo'}</span>
        </button>
      </div>

      {/* Module Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Agent Module:
          </span>
          {(['ALL', 'ORCHESTRATOR', 'PLANNER', 'RISK', 'PROGRESS'] as const).map(mod => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedModule === mod
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {mod === 'ALL' ? 'All Agents' : mod.charAt(0) + mod.slice(1).toLowerCase() + ' Agent'}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {filteredActions.length} recorded events
        </span>
      </div>

      {/* Audit Log Timeline Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Event List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredActions.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No agent actions recorded for this filter.</p>
            </div>
          ) : (
            filteredActions.map((act, index) => {
              const badge = getModuleBadge(act.agentModule);
              const isInspected = inspectedAction?.id === act.id;

              return (
                <div
                  key={act.id}
                  onClick={() => setInspectedAction(act)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                    isInspected
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono font-bold">{act.timeFormatted}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      Tool: {act.toolName}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">
                    {act.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>Status: <strong className="text-emerald-400 capitalize">{act.status}</strong></span>
                    <span className="text-indigo-400 hover:text-indigo-300 font-medium">Inspect Payload →</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Payload & State Inspector (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Tool Invocation Payload Inspector</h3>
              </div>
              {inspectedAction && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {inspectedAction.id}
                </span>
              )}
            </div>

            {!inspectedAction ? (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Layers className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-xs">Click any event from the timeline to view its tool parameters and state transitions.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <p className="text-xs font-semibold text-white">{inspectedAction.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{inspectedAction.description}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">State Transition Metadata (JSON)</label>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-72 leading-relaxed">
                    {JSON.stringify(inspectedAction.payload || { tool: inspectedAction.toolName, timestamp: inspectedAction.timestamp }, null, 2)}
                  </pre>
                </div>

                <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p className="text-slate-300 font-semibold">Google ADK & Cloud Readiness</p>
                  <p className="text-[11px] leading-relaxed">
                    This event is formatted to be dispatched to Cloud Pub/Sub or Google Cloud Run, where autonomous agents can execute remote tool calls and persist state to Firestore.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AgentActivityCenter;
