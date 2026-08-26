/**
 * StudyFlow Syllabus Decomposition Engine
 * Powered by Gemini 3.7 Flash Multimodal & Planner Agent
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  UploadCloud,
  Sparkles,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Check,
  RefreshCw,
  BookOpen,
  FileCheck,
  Zap,
  AlertTriangle,
  Play
} from 'lucide-react';
import { AnalyzeSyllabusInput } from '../types';

export const SyllabusAnalyzerView: React.FC = () => {
  const {
    runSyllabusAnalysis,
    applySyllabusToPlan,
    isAnalyzingSyllabus,
    analyzedResult,
    syllabusAnalysisError,
    clearSyllabusError,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'text' | 'pdf' | 'image' | 'notes'>('text');
  const [syllabusText, setSyllabusText] = useState(
`COURSE: Engineering Physics (PHY-201)
MODULE 1: Electromagnetic Induction & Faraday's Laws
- Magnetic Flux, Faraday's experiments
- Lenz's Law and energy conservation
- Self and Mutual Inductance derivations
- High Exam Weight: 15 marks

MODULE 2: Maxwell's Equations & EM Wave Propagation
- Displacement Current concept
- Maxwell's four equations in differential and integral forms
- Wave equation in free space and dielectric media
- Poynting vector and radiation pressure

MODULE 3: Wave Optics & Interference
- Young's Double Slit Experiment analytical formulation
- Fringe width calculations and thin film interference
- Newton's rings method for wavelength determination

MODULE 4: Quantum Mechanics Foundations
- De Broglie hypothesis & wave-particle duality
- 1D Time-independent Schrödinger wave equation
- Particle trapped in a 1D infinite potential well (eigenvalues)`
  );

  const [targetSubject, setTargetSubject] = useState('Engineering Physics');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePresets = [
    {
      label: 'Physics Mid-Term Syllabus',
      subject: 'Engineering Physics',
      text: `COURSE: Engineering Physics (PHY-201)
MODULE 1: Electromagnetic Induction & Faraday's Laws
- Magnetic Flux, Faraday's experiments
- Lenz's Law and energy conservation
- Self and Mutual Inductance derivations
- High Exam Weight: 15 marks

MODULE 2: Maxwell's Equations & EM Wave Propagation
- Displacement Current concept
- Maxwell's four equations in differential & integral forms
- Wave equation in free space and dielectric media
- Poynting vector and radiation pressure

MODULE 3: Quantum Mechanics Foundations
- De Broglie hypothesis & wave-particle duality
- 1D Time-independent Schrödinger wave equation
- Particle in 1D infinite box`
    },
    {
      label: 'DSA & Graph Algorithms',
      subject: 'Data Structures & Algorithms',
      text: `COURSE: Data Structures & Algorithms (CS-202)
UNIT 1: Dynamic Programming Paradigms
- Optimal Substructure & Overlapping Subproblems
- 0/1 Knapsack problem and Matrix Chain Multiplication
- Longest Common Subsequence derivation

UNIT 2: Advanced Graph Algorithms
- Shortest Path: Dijkstra, Bellman-Ford, Floyd-Warshall
- Minimum Spanning Trees: Kruskal & Prim
- Network Flow: Ford-Fulkerson algorithm`
    },
    {
      label: 'DBMS Normalization & SQL',
      subject: 'Database Management Systems',
      text: `COURSE: Database Management Systems (CS-204)
TOPIC 1: Relational Schema Design & Normalization
- Functional dependencies and Armstrong's axioms
- Normal forms: 1NF, 2NF, 3NF, and Boyce-Codd (BCNF)
- Lossless join decomposition and dependency preservation

TOPIC 2: Transaction Management & Concurrency Control
- ACID properties, Serializability and Conflict equivalence
- Two-Phase Locking (2PL) protocols and Deadlock handling`
    }
  ];

  const processFile = (file: File) => {
    setFileError(null);
    clearSyllabusError();

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('Uploaded file exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
      setSelectedFile(file);

      // Auto hint subject name if detected in filename
      const fn = file.name.toLowerCase();
      if (fn.includes('physics')) setTargetSubject('Engineering Physics');
      else if (fn.includes('dsa') || fn.includes('algo')) setTargetSubject('Data Structures & Algorithms');
      else if (fn.includes('dbms') || fn.includes('database')) setTargetSubject('Database Management Systems');
      else if (fn.includes('math') || fn.includes('calculus')) setTargetSubject('Discrete Mathematics');
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRunAnalysis = async (runAsDemo = false) => {
    clearSyllabusError();
    setFileError(null);

    const isFileTab = activeTab === 'pdf' || activeTab === 'image';
    
    if (isFileTab && !fileBase64 && !selectedFile) {
      setFileError('Please select or upload a syllabus file to analyze.');
      return;
    }

    if (!isFileTab && (!syllabusText || syllabusText.trim().length === 0)) {
      setFileError('Please enter syllabus text or choose a preset.');
      return;
    }

    const payload: AnalyzeSyllabusInput = {
      contentType: activeTab,
      content: !isFileTab ? syllabusText : undefined,
      fileData: isFileTab ? fileBase64 || undefined : undefined,
      mimeType: isFileTab && selectedFile ? selectedFile.type || (activeTab === 'pdf' ? 'application/pdf' : 'image/jpeg') : undefined,
      fileName: selectedFile?.name || (activeTab === 'pdf' ? 'syllabus.pdf' : activeTab === 'image' ? 'syllabus.png' : 'syllabus.txt'),
      fileSize: selectedFile?.size,
      targetSubjectName: targetSubject,
      isDemoMode: runAsDemo
    };

    try {
      await runSyllabusAnalysis(payload);
    } catch {
      // Error handled via syllabusAnalysisError state in useApp
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.7 Flash & Planner Agent</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Syllabus Decomposition Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload PDF syllabi, exam schedules, lecture notes, or pasted outlines. The Planner Agent decomposes the curriculum into structured chapters, topics, difficulty ratings, and exam priorities.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('dashboard')}
          className="self-start md:self-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Format Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {[
              { id: 'text', label: 'Pasted Syllabus', icon: FileText },
              { id: 'pdf', label: 'PDF Document', icon: UploadCloud },
              { id: 'image', label: 'Image / Screenshot', icon: ImageIcon },
              { id: 'notes', label: 'Lecture Notes', icon: FileCode }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setFileError(null);
                    clearSyllabusError();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Presets for Text & Notes */}
          {(activeTab === 'text' || activeTab === 'notes') && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-400">Sample Curriculums:</span>
              <div className="flex flex-wrap gap-2">
                {samplePresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSyllabusText(p.text);
                      setTargetSubject(p.subject);
                      clearSyllabusError();
                      setFileError(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Subject Hint */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Subject or Course Title</label>
            <input
              type="text"
              value={targetSubject}
              onChange={e => setTargetSubject(e.target.value)}
              placeholder="e.g. Engineering Physics (Auto-detect if blank)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* File Error Alert */}
          {fileError && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Input Area: Text / Notes */}
          {activeTab === 'text' || activeTab === 'notes' ? (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Syllabus Text / Outline</label>
              <textarea
                rows={11}
                value={syllabusText}
                onChange={e => setSyllabusText(e.target.value)}
                placeholder="Paste syllabus modules, chapters, topics, marks distribution, or lecture notes..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          ) : (
            /* Input Area: Multimodal PDF / Image File Dropzone */
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-950/20'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={activeTab === 'pdf' ? '.pdf,application/pdf' : 'image/png,image/jpeg,image/jpg,image/webp'}
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Multimodal Analysis
                  </p>
                  <p className="text-[11px] text-indigo-300 underline">Click to change file</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">
                    {activeTab === 'pdf' ? 'Upload PDF Syllabus Document' : 'Upload Syllabus Screenshot or Photo'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Drag and drop your file here or click to browse. Max size 10MB.
                  </p>
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                    Select {activeTab === 'pdf' ? 'PDF' : 'Image'} File
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleRunAnalysis(false)}
              disabled={isAnalyzingSyllabus}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-98 transition-all disabled:opacity-50"
            >
              {isAnalyzingSyllabus ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Planner Agent Analyzing Syllabus with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Decompose Syllabus with Gemini AI</span>
                </>
              )}
            </button>

            {/* Error Message with Explicit Retry and Demo Mode Fallback */}
            {syllabusAnalysisError && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-300">Analysis Error</h4>
                    <p className="text-xs text-red-200 mt-0.5">{syllabusAnalysisError}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleRunAnalysis(false)}
                    className="px-3 py-1.5 rounded-lg bg-red-800/80 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Analysis
                  </button>
                  <button
                    onClick={() => handleRunAnalysis(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-indigo-400" /> Run in Demo Mode
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Analysis Result Preview (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm text-white">Extracted Curriculum</h3>
              </div>
              {analyzedResult && (
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                  analyzedResult.isDemoMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {analyzedResult.isDemoMode ? 'Demo Mode' : 'Gemini 3.7 Output'}
                </span>
              )}
            </div>

            {!analyzedResult && !isAnalyzingSyllabus && (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-600 opacity-60" />
                <p className="text-xs font-medium text-slate-400">No syllabus analyzed yet.</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Provide syllabus content or upload a document, then click &ldquo;Decompose Syllabus&rdquo; to generate structured study units.
                </p>
              </div>
            )}

            {isAnalyzingSyllabus && (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-200">Planner Agent Decomposing Curriculum...</p>
                <p className="text-[11px] text-slate-400">Extracting chapters, calculating study hours & identifying exam bottlenecks</p>
              </div>
            )}

            {analyzedResult && (
              <div className="space-y-4 animate-in fade-in duration-200">
                
                {/* Subject Header */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      {analyzedResult.subject || analyzedResult.subjectName}
                    </span>
                    {analyzedResult.subjectCode && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {analyzedResult.subjectCode}
                      </span>
                    )}
                  </div>
                  
                  {/* Meta metrics grid */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-900">
                    <div className="p-2 rounded-lg bg-slate-900/60">
                      <p className="text-[10px] text-slate-400 uppercase">Topics</p>
                      <p className="text-sm font-bold text-white font-mono">{analyzedResult.totalTopics}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60">
                      <p className="text-[10px] text-slate-400 uppercase">Est. Hours</p>
                      <p className="text-sm font-bold text-indigo-400 font-mono">
                        {analyzedResult.estimatedStudyHours || analyzedResult.estimatedTotalHours}h
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60">
                      <p className="text-[10px] text-slate-400 uppercase">High Priority</p>
                      <p className="text-sm font-bold text-red-400 font-mono">{analyzedResult.highPriorityCount}</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  {analyzedResult.summary}
                </p>

                {/* Prerequisites if any */}
                {analyzedResult.prerequisites && analyzedResult.prerequisites.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400">Identified Prerequisites:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analyzedResult.prerequisites.map((p, pIdx) => (
                        <span key={pIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics Breakdown List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {analyzedResult.topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                            <span>{t.title}</span>
                          </p>
                          {t.chapter && (
                            <p className="text-[10px] text-indigo-400/80 mt-0.5">{t.chapter}</p>
                          )}
                        </div>
                        {t.isHighPriority && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">
                            Exam Priority
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" /> {t.estimatedHours} hrs
                        </span>
                        <span className="capitalize text-slate-300">
                          Difficulty: <strong className="text-slate-200">{t.difficulty}</strong>
                        </span>
                        {t.suggestedExamWeight && (
                          <span className="text-amber-400 font-medium text-[10px]">
                            {t.suggestedExamWeight}
                          </span>
                        )}
                      </div>

                      {t.subtopics && t.subtopics.length > 0 && (
                        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 flex flex-wrap gap-1">
                          {t.subtopics.map((sub, sIdx) => (
                            <span key={sIdx} className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">
                              • {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Create Plan CTA */}
                <button
                  onClick={() => applySyllabusToPlan(analyzedResult)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Synthesize Extracted Syllabus into Study Plan</span>
                </button>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SyllabusAnalyzerView;
