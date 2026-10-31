'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  FileText,
  Upload,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import { globalDualCorpusEngine } from '@/lib/rag/dual-corpus-engine';
import { MarkBadge } from '../shared/MarkBadge';

interface DualCorpusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCorpusUpdated?: () => void;
}

export const DualCorpusModal: React.FC<DualCorpusModalProps> = ({
  isOpen,
  onClose,
  onCorpusUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'ingestA' | 'ingestB'>('stats');
  const [stats, setStats] = useState(() => globalDualCorpusEngine.getCorpusStats());

  // Input states for new document ingestion
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleIngestCorpusA = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    globalDualCorpusEngine.ingestCorpusADocument({
      type: 'corpus_a',
      courseId: 'phys-101',
      courseTitle: 'Thermodynamics & Statistical Mechanics',
      chapterNumber: stats.corpusADocsCount + 1,
      chapterTitle: newTitle,
      sectionId: `sec-${stats.corpusADocsCount + 1}.1`,
      sectionTitle: newTitle,
      content: newContent,
      concepts: [newTitle],
      pageNumber: 80
    });

    setStats(globalDualCorpusEngine.getCorpusStats());
    setSuccessMsg('Successfully indexed into Corpus A (Syllabus & Formulas extracted)!');
    setNewTitle('');
    setNewContent('');
    onCorpusUpdated?.();
  };

  const handleIngestCorpusB = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    globalDualCorpusEngine.ingestCorpusBDocument({
      type: 'corpus_b',
      courseId: 'phys-101',
      examBoard: 'Cambridge A-Level',
      year: parseInt(newYear, 10) || 2024,
      paperCode: 'Paper 42',
      questionNumber: 'Q5',
      topic: newTitle,
      subtopic: newTitle,
      questionText: newContent,
      rawTextWithMarks: newContent,
      markingScheme: [
        { stepNumber: 1, description: 'State initial formula', allocatedMarks: 1 },
        { stepNumber: 2, description: 'Substitute numerical quantities', allocatedMarks: 2 },
        { stepNumber: 3, description: 'Final answer with proper SI units', allocatedMarks: 2 }
      ],
      examinerTraps: ['Watch sign convention and Kelvin unit conversions.'],
      recurrenceFrequency: 8,
      recencyWeight: 1.0,
      relatedConceptIds: ['carnot-efficiency']
    });

    setStats(globalDualCorpusEngine.getCorpusStats());
    setSuccessMsg('Successfully indexed into Corpus B (PYQ & Marking Rubric tagged)!');
    setNewTitle('');
    setNewContent('');
    onCorpusUpdated?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-sm shadow-xl flex flex-col max-h-[85vh] overflow-hidden font-sans">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Dual-Corpus Ingestion & Weightage Inversion Engine
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-4 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex gap-2">
          <button
            onClick={() => { setActiveTab('stats'); setSuccessMsg(''); }}
            className={`py-2 px-3 text-xs font-mono font-medium border-b-2 cursor-pointer transition-colors ${
              activeTab === 'stats'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)]'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => { setActiveTab('ingestA'); setSuccessMsg(''); }}
            className={`py-2 px-3 text-xs font-mono font-medium border-b-2 cursor-pointer transition-colors ${
              activeTab === 'ingestA'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)]'
            }`}
          >
            + Ingest Corpus A (Textbook)
          </button>
          <button
            onClick={() => { setActiveTab('ingestB'); setSuccessMsg(''); }}
            className={`py-2 px-3 text-xs font-mono font-medium border-b-2 cursor-pointer transition-colors ${
              activeTab === 'ingestB'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)]'
            }`}
          >
            + Ingest Corpus B (Past Papers)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {successMsg && (
            <div className="p-3 rounded-xs bg-[var(--status-high-yield)] border border-[#c4e3cb] text-xs text-[var(--status-high-yield-text)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Corpus A Docs</span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">{stats.corpusADocsCount} Chapters</span>
                </div>
                <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Corpus B PYQs</span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">{stats.totalExamQuestions} Questions</span>
                </div>
                <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Marks Indexed</span>
                  <span className="text-lg font-bold text-[var(--status-high-yield-text)]">{stats.totalMarksIndexed} Marks</span>
                </div>
                <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Recurrence Avg</span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">{stats.averageRecurrenceFrequency}x / 10 Yr</span>
                </div>
              </div>

              {/* Inversion Formula Explain Box */}
              <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--status-high-yield-text)]" />
                  <h4 className="font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider font-mono">
                    Weightage Inversion Algorithm (EPS)
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Unlike conventional RAG which blindly scores text solely on semantic cosine proximity, Learnify computes a tri-factor Exam Probability Score:
                </p>
                <div className="p-2.5 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] text-center font-semibold">
                  EPS = (SemanticSimilarity × 0.40) + (RecurrenceFrequency × 0.40) + (Recency × 0.20)
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
                  This guarantees that core theorems appearing across 8+ past examination papers receive priority retrieval during crunch study sessions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ingestA' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] mb-1">
                  Chapter / Topic Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Chapter 4: Phase Transitions & Latent Heat"
                  className="w-full p-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] mb-1">
                  Syllabus Content (Markdown & LaTeX $$...$$):
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  placeholder="Enter textbook theory, derivations with LaTeX formulas like $$dQ = mL_f$$..."
                  className="w-full p-2 text-xs font-mono rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] leading-relaxed"
                />
              </div>

              <button
                onClick={handleIngestCorpusA}
                className="w-full py-2 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Index Into Corpus A
              </button>
            </div>
          )}

          {activeTab === 'ingestB' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] mb-1">
                    Exam Topic:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Clausius Clapeyron Equation"
                    className="w-full p-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] mb-1">
                    Exam Year:
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full p-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] mb-1">
                  Past Question Text (Include [5 Marks] tag):
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  placeholder="A thermodynamic system changes phase from liquid to gas... [5 Marks]"
                  className="w-full p-2 text-xs font-mono rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] leading-relaxed"
                />
              </div>

              <button
                onClick={handleIngestCorpusB}
                className="w-full py-2 rounded-sm bg-[var(--status-high-yield-text)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Index Into Corpus B (With PYQ Mark Extraction)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
