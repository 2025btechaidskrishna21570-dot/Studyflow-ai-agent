/**
 * StudyFlow Adaptive Study Plan View
 * Calendar & Timeline views with autonomous task state transitions
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ListFilter,
  Check,
  X,
  RotateCw,
  Plus,
  Clock,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  CalendarCheck,
  Flame,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, DifficultyLevel, CreateTaskInput } from '../types';

export const AdaptivePlanView: React.FC = () => {
  const {
    tasks,
    subjects,
    activePlan,
    completeTask,
    markTaskMissed,
    rescheduleTaskManually,
    addTask,
    user
  } = useApp();

  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  // Reschedule Dialog State
  const [reschedulingTaskId, setReschedulingTaskId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [rescheduleReason, setRescheduleReason] = useState('Autonomous rebalance: Adjusted around exam deadline.');

  // Add Task Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || 'subj_physics');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskDuration, setNewTaskDuration] = useState(60);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<DifficultyLevel>('medium');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSubj = selectedSubjectFilter === 'all' || t.subjectId === selectedSubjectFilter || t.subjectName === selectedSubjectFilter;
    const matchesStatus = selectedStatusFilter === 'all' || t.status === selectedStatusFilter;
    return matchesSubj && matchesStatus;
  });

  // Group tasks by date for timeline
  const tasksByDate = filteredTasks.reduce((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(tasksByDate).sort();

  const handleCreateTask = () => {
    if (!newTopicTitle.trim()) return;
    const subj = subjects.find(s => s.id === newSubjectId) || subjects[0];
    const input: CreateTaskInput = {
      planId: activePlan?.id || 'plan_default',
      subjectId: subj.id,
      subjectName: subj.name,
      topicTitle: newTopicTitle,
      subtopicTitle: newSubtopicTitle || undefined,
      date: newTaskDate,
      durationMinutes: newTaskDuration,
      priority: newTaskPriority,
      difficulty: newTaskDifficulty
    };
    addTask(input);
    setShowAddModal(false);
    setNewTopicTitle('');
    setNewSubtopicTitle('');
  };

  const handleConfirmReschedule = () => {
    if (reschedulingTaskId) {
      rescheduleTaskManually(reschedulingTaskId, rescheduleDate, rescheduleReason);
      setReschedulingTaskId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Schedule Dispatcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Adaptive Study Plan & Timeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic study sessions automatically re-balanced by the Orchestrator Agent upon missed tasks or exam shifts.
          </p>
        </div>

        {/* View Toggle & Add Task Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Calendar Matrix
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        
        {/* Subject Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5" /> Subject:
          </span>
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedSubjectFilter === 'all'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectFilter(s.id)}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedSubjectFilter === s.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>

      </div>

      {/* TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-8">
          {sortedDates.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <CalendarCheck className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No study tasks match the active filters.</p>
              <p className="text-xs text-slate-500">Try changing subject filters or adding a new session.</p>
            </div>
          ) : (
            sortedDates.map(dateStr => {
              const dayTasks = tasksByDate[dateStr];
              const dateObj = new Date(dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const dayTotalMinutes = dayTasks.reduce((acc, t) => acc + t.durationMinutes, 0);

              return (
                <div key={dateStr} className="space-y-4">
                  
                  {/* Date Section Header */}
                  <div className="flex items-center justify-between bg-slate-850/60 px-4 py-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className={`w-4 h-4 ${isToday ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <h3 className="text-sm font-bold text-white">
                        {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h3>
                      {isToday && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {Math.round((dayTotalMinutes / 60) * 10) / 10} hrs planned ({dayTasks.length} sessions)
                    </span>
                  </div>

                  {/* Day Tasks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dayTasks.map(task => {
                      const subject = subjects.find(s => s.id === task.subjectId || s.name === task.subjectName);
                      const isCompleted = task.status === 'completed';
                      const isMissed = task.status === 'missed';
                      const isRescheduled = task.status === 'rescheduled';

                      return (
                        <div
                          key={task.id}
                          className={`p-5 rounded-2xl border transition-all space-y-4 ${
                            isCompleted
                              ? 'bg-slate-950/70 border-slate-850 opacity-80'
                              : isMissed
                              ? 'bg-red-950/20 border-red-900/40'
                              : isRescheduled
                              ? 'bg-indigo-950/30 border-indigo-500/40 shadow-lg shadow-indigo-950/20'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Card Header Tags */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: subject?.color || '#3b82f6' }}
                              >
                                {task.subjectName}
                              </span>

                              <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                                task.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {task.priority}
                              </span>

                              <span className="text-[10px] capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {task.difficulty}
                              </span>
                            </div>

                            {/* Status Badge */}
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              isMissed ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              isRescheduled ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {task.status}
                            </span>
                          </div>

                          {/* Task Info */}
                          <div className="space-y-1.5">
                            <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {task.description}
                            </p>

                            {isRescheduled && task.rescheduleReason && (
                              <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-500/20 text-[11px] text-cyan-300 leading-relaxed font-mono">
                                <strong>Autonomous Action:</strong> {task.rescheduleReason}
                              </div>
                            )}
                          </div>

                          {/* Footer & Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                            <div className="flex items-center gap-2 text-slate-400 font-mono">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{task.startTime || '14:00'} • {task.durationMinutes} mins</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {!isCompleted && !isMissed && (
                                <>
                                  <button
                                    onClick={() => completeTask(task.id)}
                                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                                    title="Complete Task"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => markTaskMissed(task.id)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                                    title="Mark Missed"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setReschedulingTaskId(task.id);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                                    title="Manual Reschedule"
                                  >
                                    <RotateCw className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              {isCompleted && (
                                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* CALENDAR MATRIX VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = new Date();
              day.setDate(day.getDate() + i);
              const dStr = day.toISOString().split('T')[0];
              const dayTasks = tasks.filter(t => t.date === dStr);

              return (
                <div key={dStr} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 min-h-56">
                  <div className="border-b border-slate-800 pb-2">
                    <p className="text-xs font-bold text-white">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.map(t => (
                      <div
                        key={t.id}
                        className={`p-2 rounded-lg text-left text-[11px] border ${
                          t.status === 'completed' ? 'bg-slate-900 border-slate-800 opacity-60' :
                          t.status === 'rescheduled' ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200' :
                          'bg-slate-850 border-slate-800 text-slate-200'
                        }`}
                      >
                        <p className="font-semibold truncate">{t.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{t.durationMinutes}m • {t.subjectName}</p>
                      </div>
                    ))}

                    {dayTasks.length === 0 && (
                      <p className="text-[11px] text-slate-600 text-center py-4">No tasks</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Reschedule Dialog */}
      {reschedulingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-white">Reschedule Study Session</h3>
            <p className="text-xs text-slate-400">
              Shift this session to a new date. The agent will automatically adjust subsequent review buffers.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason / Trigger Note</label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setReschedulingTaskId(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Study Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-white">Create Custom Study Session</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubjectId}
                  onChange={e => setNewSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code || 'Course'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Topic Title</label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={e => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Electromagnetic Inductance Solved Derivations"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Subtopics / Description</label>
                <input
                  type="text"
                  value={newSubtopicTitle}
                  onChange={e => setNewSubtopicTitle(e.target.value)}
                  placeholder="e.g. Self-inductance formulas & 4 past exam questions"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={e => setNewTaskDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    max="240"
                    value={newTaskDuration}
                    onChange={e => setNewTaskDuration(parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={newTaskDifficulty}
                    onChange={e => setNewTaskDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Add to Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdaptivePlanView;
