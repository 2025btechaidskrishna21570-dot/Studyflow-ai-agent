/**
 * StudyFlow Academic Analytics View
 * Recharts visualization of study velocity, risk trends, and subject mastery
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { subjects, tasks, progress, user } = useApp();

  // Weekly study hours data
  const weeklyData = [
    { day: 'Mon', hours: 3.5, planned: 3.5 },
    { day: 'Tue', hours: 3.0, planned: 3.5 },
    { day: 'Wed', hours: 4.0, planned: 3.5 },
    { day: 'Thu', hours: 2.5, planned: 3.5 },
    { day: 'Fri', hours: 3.5, planned: 3.5 },
    { day: 'Sat', hours: 4.5, planned: 4.0 },
    { day: 'Sun', hours: 3.2, planned: 3.5 }
  ];

  // Subject completion distribution
  const subjectDistribution = subjects.map(s => ({
    name: s.name,
    completed: s.completedHours,
    remaining: Math.max(0, s.totalEstimatedHours - s.completedHours),
    color: s.color
  }));

  // Task Status distribution for pie chart
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const missedCount = tasks.filter(t => t.status === 'missed').length;
  const rescheduledCount = tasks.filter(t => t.status === 'rescheduled').length;

  const pieData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#6366f1' },
    { name: 'Rescheduled', value: rescheduledCount, color: '#06b6d4' },
    { name: 'Missed', value: missedCount, color: '#ef4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Progress Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Academic Performance & Velocity Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual breakdown of study hours, velocity consistency, and syllabus completion projections.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Active Streak: <strong className="text-white">{progress.studyStreakDays} Days</strong></span>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Study Logged</span>
          <p className="text-2xl font-bold text-white font-mono">{progress.completedStudyHours} Hours</p>
          <p className="text-xs text-emerald-400">+4.5 hrs vs last week</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Sprint Completion Rate</span>
          <p className="text-2xl font-bold text-white font-mono">{progress.completionRate}%</p>
          <p className="text-xs text-indigo-400">{progress.completedTasks} / {progress.totalTasks} study sessions</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Target Semester Milestone</span>
          <p className="text-2xl font-bold text-cyan-300 font-mono">CGPA {user.targetCgpa || 9.2} / 10.0</p>
          <p className="text-xs text-slate-400">Current: {user.currentCgpa || 8.4} • Pacing on track for finals</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Hours Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white">Daily Study Hours vs Planned Bandwidth</h3>
              <p className="text-xs text-slate-400">Actual logged study time compared with daily {user.availableHoursPerDay}h allocation</p>
            </div>
            <span className="text-xs font-mono text-indigo-400">This Week</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="hours" name="Logged Hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="planned" name="Target Capacity" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution Pie (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white">Task Execution Health</h3>
            <p className="text-xs text-slate-400">Completed vs Rescheduled vs Missed</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.name}:</span>
                <strong className="text-white font-mono">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white">Subject Mastery & Syllabus Completion Trajectory</h3>
          <p className="text-xs text-slate-400">Total estimated study hours completed per course</p>
        </div>

        <div className="space-y-4">
          {subjects.map(s => {
            const percent = Math.min(100, Math.round((s.completedHours / Math.max(1, s.totalEstimatedHours)) * 100));
            return (
              <div key={s.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.name} ({s.code || 'CRS'})</span>
                  </span>
                  <span className="font-mono text-slate-300">
                    {s.completedHours}h / {s.totalEstimatedHours}h ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsView;
