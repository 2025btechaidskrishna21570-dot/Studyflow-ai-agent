/**
 * StudyFlow Navigation Header
 * Autonomous Academic Operations Agent
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Brain,
  Sparkles,
  Calendar,
  ShieldAlert,
  Activity,
  BarChart3,
  FileText,
  Play,
  RotateCcw,
  Bell,
  Layers,
  ChevronRight,
  User,
  GraduationCap
} from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    notifications,
    runAutonomousDemo,
    isDemoRunning,
    demoStep,
    resetToInitialScenario,
    setShowOnboarding,
    setShowArchitecture
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Brain },
    { id: 'adaptive_plan', label: 'Adaptive Plan', icon: Calendar },
    { id: 'risk_intelligence', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'activity_center', label: 'Agent Activity', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'syllabus_analyzer', label: 'Syllabus AI', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Demo Banner when active */}
      {isDemoRunning && (
        <div className="bg-gradient-to-r from-amber-600 via-indigo-600 to-emerald-600 text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>
              <strong>AUTONOMOUS DEMO RUNNING (Step {demoStep}/5):</strong> Simulating real-time missed task detection & autonomous plan rebalancing...
            </span>
          </div>
          <span className="text-xs bg-black/30 px-2 py-0.5 rounded font-mono">Real State Transitions Active</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              title="StudyFlow Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">StudyFlow</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Agent
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal">Autonomous Academic Ops</p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            
            {/* Run Autonomous Agent Demo Button */}
            <button
              onClick={() => runAutonomousDemo()}
              disabled={isDemoRunning}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50"
              title="Demonstrates task completion -> missed Physics session -> risk recalculation -> autonomous rescheduling"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Agent Demo</span>
            </button>

            {/* Architecture Inspector */}
            <button
              onClick={() => setShowArchitecture(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Inspect Google Cloud & Gemini Integration Architecture"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architecture</span>
            </button>

            {/* Reset Scenario */}
            <button
              onClick={resetToInitialScenario}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset to Initial Student Scenario (Krishna)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Agent Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                )}
              </button>
              {showNotifications && (
                <NotificationsPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Student Profile Quick Trigger */}
            <button
              onClick={() => setShowOnboarding(true)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-left transition-colors"
              title="Edit Student Onboarding Profile"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-200 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">{user.availableHoursPerDay}h/day</p>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
