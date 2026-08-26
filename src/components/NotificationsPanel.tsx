/**
 * StudyFlow Notification Center Drawer
 * Real-time event dispatches from Planner, Progress, Risk, and Orchestrator Agents
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  Calendar,
  Sparkles,
  AlertTriangle,
  RotateCw,
  X,
  CheckCircle2
} from 'lucide-react';
import { NotificationType } from '../types';

interface Props {
  onClose: () => void;
}

export const NotificationsPanel: React.FC<Props> = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'all' | NotificationType>('all');

  const filtered = notifications.filter(n => (filter === 'all' ? true : n.type === filter));

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'risk':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'exam':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'rescheduled':
        return <RotateCw className="w-4 h-4 text-cyan-400" />;
      case 'missed':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Header */}
      <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-sm text-slate-100">Agent Dispatches</h3>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-medium px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {(['all', 'risk', 'rescheduled', 'daily', 'exam'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded-md capitalize whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {f === 'all' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/50 p-1">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            No notifications in this filter
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.type === 'risk') setCurrentView('risk_intelligence');
                else if (notif.type === 'rescheduled' || notif.type === 'missed') setCurrentView('adaptive_plan');
                onClose();
              }}
              className={`p-3 rounded-lg text-left cursor-pointer transition-colors ${
                notif.read ? 'opacity-70 hover:opacity-100 hover:bg-slate-850/50' : 'bg-slate-850/90 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1 rounded-md bg-slate-800">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold ${notif.read ? 'text-slate-300' : 'text-slate-100'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 text-center">
        <button
          onClick={() => {
            setCurrentView('activity_center');
            onClose();
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
        >
          View Full Agent Activity Stream →
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
