/**
 * StudyFlow Student Onboarding Modal
 * Multi-Step Academic Configuration Flow
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Sparkles,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { Subject, Exam } from '../types';

interface Props {
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ onClose }) => {
  const { user, subjects, exams, saveOnboardingProfile, setCurrentView } = useApp();

  const [step, setStep] = useState(1);
  
  // Step 1: Personal info
  const [name, setName] = useState(user.name || '');
  const [college, setCollege] = useState(user.college || user.university || '');
  const [major, setMajor] = useState(user.major || user.degree || '');
  const [semester, setSemester] = useState(user.semester || 4);
  const [currentCgpa, setCurrentCgpa] = useState(user.currentCgpa || 8.4);
  const [targetCgpa, setTargetCgpa] = useState(user.targetCgpa || 9.2);
  const [expectedGraduationYear, setExpectedGraduationYear] = useState(user.expectedGraduationYear || 2026);

  // Step 2: Dynamic Subjects
  const [subjectList, setSubjectList] = useState<Subject[]>(subjects);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjConfidence, setNewSubjConfidence] = useState(3);

  // Step 3: Exam Dates
  const [examList, setExamList] = useState<Exam[]>(exams);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubj, setNewExamSubj] = useState(subjectList[0]?.name || '');
  const [newExamDate, setNewExamDate] = useState('');

  // Step 4: Study Habits & Goals
  const [hoursPerDay, setHoursPerDay] = useState(user.availableHoursPerDay || 3.5);
  const [preferredTimes, setPreferredTimes] = useState<('morning' | 'afternoon' | 'evening' | 'night')[]>(
    user.preferredStudyTimes || ['morning', 'evening']
  );
  const [goalText, setGoalText] = useState(user.studyGoals.join('\n'));

  const handleAddSubject = () => {
    if (!newSubjName.trim()) return;
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
    const newSubject: Subject = {
      id: `subj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newSubjName.trim(),
      code: newSubjCode.trim() || `CRS-10${subjectList.length + 1}`,
      color: colors[subjectList.length % colors.length],
      currentConfidence: newSubjConfidence,
      totalEstimatedHours: 20,
      completedHours: 0,
      topicsCount: 5,
      completedTopicsCount: 0
    };
    setSubjectList(prev => [...prev, newSubject]);
    setNewSubjName('');
    setNewSubjCode('');
    setNewSubjConfidence(3);
  };

  const handleRemoveSubject = (id: string) => {
    setSubjectList(prev => prev.filter(s => s.id !== id));
  };

  const handleAddExam = () => {
    if (!newExamTitle.trim() || !newExamDate) return;
    const targetSubj = subjectList.find(s => s.name === newExamSubj) || subjectList[0];
    const diffTime = Math.abs(new Date(newExamDate).getTime() - new Date().getTime());
    const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const newExam: Exam = {
      id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      subjectId: targetSubj ? targetSubj.id : 'subj_gen',
      subjectName: targetSubj ? targetSubj.name : 'General',
      title: newExamTitle.trim(),
      examDate: newExamDate,
      daysRemaining
    };
    setExamList(prev => [...prev, newExam]);
    setNewExamTitle('');
    setNewExamDate('');
  };

  const handleFinish = () => {
    saveOnboardingProfile(
      {
        name: name.trim() || user.name,
        college: college.trim() || user.college,
        university: college.trim() || user.university,
        degree: major.trim() || user.degree,
        major: major.trim() || user.major,
        semester: Number(semester),
        currentCgpa: Number(currentCgpa),
        targetCgpa: Number(targetCgpa),
        targetGpa: Number(targetCgpa),
        expectedGraduationYear: Number(expectedGraduationYear),
        availableHoursPerDay: Number(hoursPerDay),
        preferredStudyTimes: preferredTimes,
        studyGoals: goalText.split('\n').filter(g => g.trim().length > 0)
      },
      subjectList,
      examList
    );
    onClose();
    setCurrentView('dashboard');
  };

  const toggleTimePreference = (time: 'morning' | 'afternoon' | 'evening' | 'night') => {
    setPreferredTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Student Academic Onboarding</h2>
              <p className="text-xs text-slate-400">Step {step} of 4 • Configure Planner & Risk Agent parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-white">Student Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Let StudyFlow know your academic identity and target metrics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Krishna Sharma"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. Poornima College of Engineering"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Degree & Major</label>
                  <input
                    type="text"
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    placeholder="e.g. B.Tech AI & Data Science"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Semester</label>
                  <select
                    value={semester}
                    onChange={e => setSemester(parseInt(e.target.value) || 4)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current CGPA (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.0"
                    max="10.0"
                    value={currentCgpa}
                    onChange={e => setCurrentCgpa(parseFloat(e.target.value) || 8.0)}
                    placeholder="e.g. 8.4"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Semester CGPA (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.0"
                    max="10.0"
                    value={targetCgpa}
                    onChange={e => setTargetCgpa(parseFloat(e.target.value) || 9.0)}
                    placeholder="e.g. 9.2"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expected Graduation Year</label>
                  <input
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 8}
                    value={expectedGraduationYear}
                    onChange={e => setExpectedGraduationYear(parseInt(e.target.value) || 2026)}
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dynamic Subjects & Confidence */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-white">Enrolled Subjects & Confidence</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set your current confidence (1 = struggling, 5 = mastered). Lower confidence subjects receive higher AI study weighting.
                </p>
              </div>

              {/* Add Subject Input Bar */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-indigo-300">Add New Subject</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newSubjName}
                    onChange={e => setNewSubjName(e.target.value)}
                    placeholder="Subject Name (e.g. Linear Algebra)"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={newSubjCode}
                    onChange={e => setNewSubjCode(e.target.value)}
                    placeholder="Course Code (e.g. MAT-201)"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={newSubjConfidence}
                      onChange={e => setNewSubjConfidence(parseInt(e.target.value))}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white flex-1 focus:outline-none"
                    >
                      <option value={1}>Confidence: 1 (Struggling)</option>
                      <option value={2}>Confidence: 2 (Need Help)</option>
                      <option value={3}>Confidence: 3 (Moderate)</option>
                      <option value={4}>Confidence: 4 (Strong)</option>
                      <option value={5}>Confidence: 5 (Mastered)</option>
                    </select>
                    <button
                      onClick={handleAddSubject}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Subject List */}
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {subjectList.map(subj => (
                  <div
                    key={subj.id}
                    className="p-3 rounded-lg bg-slate-850/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subj.color }} />
                      <div>
                        <p className="text-xs font-semibold text-white">{subj.name}</p>
                        <p className="text-[11px] text-slate-400">{subj.code || 'Course'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        subj.currentConfidence <= 2
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : subj.currentConfidence === 3
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        Confidence: {subj.currentConfidence}/5
                      </span>
                      <button
                        onClick={() => handleRemoveSubject(subj.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Exam Deadlines */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-white">Upcoming Exams & Target Deadlines</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The Risk Agent recalculates urgency continuously based on days remaining until each exam.
                </p>
              </div>

              {/* Add Exam Input */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-indigo-300">Add Exam Milestone</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newExamTitle}
                    onChange={e => setNewExamTitle(e.target.value)}
                    placeholder="Exam Title (e.g. Mid-Term 1)"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                  <select
                    value={newExamSubj}
                    onChange={e => setNewExamSubj(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    {subjectList.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={newExamDate}
                      onChange={e => setNewExamDate(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white flex-1 focus:outline-none"
                    />
                    <button
                      onClick={handleAddExam}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Exam List */}
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {examList.map(ex => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-lg bg-slate-850/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">{ex.title}</p>
                        <p className="text-[11px] text-slate-400">{ex.subjectName}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold font-mono ${ex.daysRemaining <= 5 ? 'text-red-400' : 'text-slate-300'}`}>
                        {ex.daysRemaining} days away
                      </span>
                      <p className="text-[10px] text-slate-500">{ex.examDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Available Study Hours & Times */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-white">Study Capacity & Habits</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The Planner Agent matches study task block durations to your daily bandwidth.
                </p>
              </div>

              {/* Available hours slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-200">Available Study Time Per Day</label>
                  <span className="text-sm font-bold text-indigo-400 font-mono">{hoursPerDay} Hours/Day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={e => setHoursPerDay(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1.0 hr (Light)</span>
                  <span>3.5 hrs (Recommended)</span>
                  <span>8.0 hrs (Intensive)</span>
                </div>
              </div>

              {/* Preferred times */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Preferred Study Time Slots</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['morning', 'afternoon', 'evening', 'night'] as const).map(time => {
                    const isSelected = preferredTimes.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => toggleTimePreference(time)}
                        className={`p-2.5 rounded-lg border text-xs capitalize flex items-center justify-center gap-1.5 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200 font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Study Goals</label>
                <textarea
                  rows={3}
                  value={goalText}
                  onChange={e => setGoalText(e.target.value)}
                  placeholder="One goal per line (e.g. Master Physics derivations, Keep 3-day study streak)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Sparkles className="w-4 h-4" /> Save Profile & Launch Agent
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OnboardingModal;
