'use client';

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  AlertTriangle,
  FileText,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { CorpusADocument, CorpusBDocument } from '@/lib/rag/types';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';

interface DocumentCanvasProps {
  documents: CorpusADocument[];
  pyqDocuments: CorpusBDocument[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onJumpToTool: (toolIndex: number, contextData?: any) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  documents,
  pyqDocuments,
  activeDocId,
  onSelectDoc,
  onJumpToTool
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormulaVariable, setSelectedFormulaVariable] = useState<string | null>(null);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  // Find PYQs associated with the active chapter/section
  const relatedPyqs = pyqDocuments.filter(pyq =>
    activeDoc.concepts.some(c =>
      pyq.topic.toLowerCase().includes(c.toLowerCase()) ||
      pyq.subtopic.toLowerCase().includes(c.toLowerCase())
    )
  );

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] border-r border-[var(--border-subtle)] overflow-hidden">
      {/* Top Document Metadata & Search Bar */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between gap-3">
        {/* Breadcrumb / Chapter Indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
          <div className="truncate text-xs font-mono text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">CH {activeDoc.chapterNumber}</span>
            <span className="mx-1.5 text-[var(--text-tertiary)]">/</span>
            <span>{activeDoc.sectionTitle}</span>
          </div>
        </div>

        {/* In-Document Search */}
        <div className="relative w-48 sm:w-60 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbook & PYQs..."
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
          />
        </div>
      </div>

      {/* Dual Corpus Ingestion Badge Strip */}
      <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">
            Dual Indexing:
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
            <span className="font-bold">Corpus A:</span> Syllabus (Ch 1-3)
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded-xs bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border border-[#c4e3cb] dark:border-[#1e3b26]">
            <span className="font-bold">Corpus B:</span> 10-Yr PYQ (2015-2024)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-secondary)] font-mono">
            Exam Priority:
          </span>
          <span className="font-mono font-semibold text-[var(--status-high-yield-text)]">
            +1.8x High-Yield Boost
          </span>
        </div>
      </div>

      {/* Main Canvas Document Scroll Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 selection:bg-[#d8e8dc] dark:selection:bg-[#203c27]">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Chapter Header */}
          <div className="border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] font-bold">
                Chapter {activeDoc.chapterNumber} • {activeDoc.courseTitle}
              </span>
              <MarkBadge variant="high_yield" text="92% Exam Frequency" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-sans">
              {activeDoc.chapterTitle}
            </h1>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1 font-sans">
              {activeDoc.sectionTitle}
            </p>
          </div>

          {/* Chapter Quick Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--border-subtle)]">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`px-2.5 py-1 text-xs rounded-sm font-sans transition-colors shrink-0 cursor-pointer ${
                  activeDocId === doc.id
                    ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-semibold'
                    : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                § {doc.chapterNumber}.{doc.sectionId.replace('sec-', '')}: {doc.sectionTitle}
              </button>
            ))}
          </div>

          {/* Concept Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">Core Nodes:</span>
            {activeDoc.concepts.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => onJumpToTool(1, { concept })}
                className="text-[11px] font-sans px-2 py-0.5 rounded-xs bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              >
                {concept} →
              </button>
            ))}
          </div>

          {/* Formatted Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed text-[var(--text-primary)] space-y-4 font-sans">
            {activeDoc.content.split('\n\n').map((paragraph, pIdx) => {
              // If paragraph contains block math: $$...$$
              if (paragraph.startsWith('$$') && paragraph.endsWith('$$')) {
                const math = paragraph.slice(2, -2).trim();
                return (
                  <div
                    key={pIdx}
                    className="my-5 p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] relative group hover:border-[var(--border-strong)] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                        Governing Thermodynamic Relation
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onJumpToTool(0, { formula: math })}
                          className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                          title="Open in Interactive Visualizer"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Simulate</span>
                        </button>
                      </div>
                    </div>
                    <FormulaRenderer math={math} block />
                  </div>
                );
              }

              // Normal text with potential inline math
              return (
                <div key={pIdx} className="leading-relaxed">
                  {paragraph.split('$').map((seg, sIdx) => {
                    // Odd indices are inline math
                    if (sIdx % 2 === 1) {
                      return <FormulaRenderer key={sIdx} math={seg} className="mx-1" />;
                    }
                    return <span key={sIdx}>{seg}</span>;
                  })}
                </div>
              );
            })}
          </div>

          {/* ANCHORED DUAL-CORPUS CALLOUT: Past Year Questions Linked to Section */}
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--status-high-yield-text)]" />
                <h3 className="font-sans font-bold text-sm tracking-tight text-[var(--text-primary)]">
                  Anchored Past 10-Year Exam Questions (Corpus B)
                </h3>
              </div>
              <span className="font-mono text-xs text-[var(--text-tertiary)]">
                {relatedPyqs.length} High-Yield Matches
              </span>
            </div>

            <div className="space-y-3">
              {relatedPyqs.map((pyq) => (
                <div
                  key={pyq.id}
                  className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] hover:border-[var(--border-strong)] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MarkBadge marks={pyq.allocatedMarks} />
                      <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                        {pyq.year} {pyq.paperCode} • {pyq.questionNumber}
                      </span>
                    </div>
                    <MarkBadge variant="high_yield" text={`Recurred ${pyq.recurrenceFrequency}x in 10 Yrs`} />
                  </div>

                  <p className="text-xs font-sans text-[var(--text-secondary)] line-clamp-2 my-2">
                    {pyq.questionText}
                  </p>

                  {/* Examiner Trap Highlight */}
                  {pyq.examinerTraps.length > 0 && (
                    <div className="my-2 p-2 rounded-xs bg-[var(--status-trap)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-[11px] text-[var(--status-trap-text)]">
                      <span className="font-bold">⚠️ Examiner Trap Alert: </span>
                      {pyq.examinerTraps[0]}
                    </div>
                  )}

                  {/* Quick Action Buttons to Launch into Right Pane Tools */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => onJumpToTool(3, { pyq })}
                      className="flex items-center gap-1 text-[11px] font-sans font-medium px-2 py-1 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all cursor-pointer"
                    >
                      <span>Socratic Step Check</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onJumpToTool(5, { pyq })}
                      className="flex items-center gap-1 text-[11px] font-sans font-medium px-2 py-1 rounded-xs bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border border-[#c4e3cb] dark:border-[#1e3b26] hover:opacity-90 transition-all cursor-pointer"
                    >
                      <span>Launch Timed Drill</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
