'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  BookOpen,
  FileText,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { FormulaRenderer } from './shared/FormulaRenderer';
import { MarkBadge } from './shared/MarkBadge';
import { getSubjectCurriculum, ConceptChip } from '@/lib/subjects-data';

interface PdfViewerProps {
  docId: string;
  title: string;
  pageCount?: number;
  onSelectConcept?: (concept: string) => void;
  onSelectConceptChip?: (chip: ConceptChip) => void;
  onChapterChange?: (chapter: string) => void;
  onOpenVisualizerForFormula?: (formula: string) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  docId,
  title,
  pageCount,
  onSelectConcept,
  onSelectConceptChip,
  onChapterChange,
  onOpenVisualizerForFormula
}) => {
  const curriculum = getSubjectCurriculum(docId);
  const PAGES = curriculum.pages;
  const effectivePageCount = pageCount || PAGES.length;

  const [currentPage, setCurrentPage] = useState<number>(() => {
    return PAGES.length >= 2 ? 2 : 1;
  });
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeChipId, setActiveChipId] = useState<string | null>(null);

  const activePageData = PAGES[currentPage - 1] || PAGES[0];

  // Notify parent of chapter change whenever current page or active page changes
  useEffect(() => {
    if (activePageData?.chapter) {
      onChapterChange?.(activePageData.chapter);
    }
  }, [currentPage, activePageData, onChapterChange]);

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] border-r border-[var(--border-subtle)] overflow-hidden font-sans">
      {/* Top Document Controls Bar */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between gap-2">
        {/* Breadcrumb info */}
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
          <div className="truncate text-xs font-mono text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">{activePageData.chapter}</span>
          </div>
        </div>

        {/* Page navigation & Zoom controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs px-2 text-[var(--text-primary)]">
            {currentPage} / {effectivePageCount}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(effectivePageCount, p + 1))}
            disabled={currentPage >= effectivePageCount}
            className="p-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

          <button
            onClick={() => setZoomLevel(z => Math.max(80, z - 10))}
            className="p-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-[var(--text-secondary)] w-9 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(z => Math.min(150, z + 10))}
            className="p-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dual Ingestion Strip */}
      <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">
            Dual Indexing:
          </span>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
            Corpus A: Syllabus §{currentPage}.1
          </span>
          <span className="text-[var(--text-tertiary)]">↔</span>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-xs bg-[var(--status-high-yield)] border border-[#c5e4cc] text-[var(--status-high-yield-text)] font-semibold">
            Corpus B: Past 10-Year Exam Questions
          </span>
        </div>

        <span className="font-mono text-[11px] font-semibold text-[var(--status-high-yield-text)]">
          {curriculum.examYield}
        </span>
      </div>

      {/* Main Canvas Document Scroll View */}
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 bg-[var(--surface-raised)]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="max-w-2xl mx-auto space-y-6 transition-transform"
        >
          {/* Chapter Heading */}
          <div className="border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] font-bold">
                Page {currentPage} of {effectivePageCount} • {curriculum.title}
              </span>
              <MarkBadge variant="high_yield" text="High Exam Frequency" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {activePageData.title}
            </h1>
          </div>

          {/* Interactive Inline Concept Pills (Subject-Scoped - Click to sync Right Pane) */}
          <div className="p-3.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-sunken)] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
              <span>Interactive Inline Concepts & Citations:</span>
              <span className="font-mono text-[10px] text-[var(--text-tertiary)]">Click to sync right pane</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activePageData.conceptChips && activePageData.conceptChips.length > 0 ? (
                activePageData.conceptChips.map((chip) => {
                  const isFocused = activeChipId === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => {
                        setActiveChipId(chip.id);
                        onSelectConceptChip?.(chip);
                        onSelectConcept?.(chip.label);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-sm border transition-all cursor-pointer font-medium ${
                        chip.badge === 'PYQ' || chip.badge === 'Trap'
                          ? 'bg-[var(--status-trap)] text-[var(--status-trap-text)] border-red-200 hover:border-red-400'
                          : chip.targetTool === 'visualizer' && chip.targetTab?.includes('3d')
                          ? 'bg-[var(--status-concept-tag)] text-[var(--status-concept-tag-text)] border-purple-200 hover:border-purple-400'
                          : chip.targetTool === 'visualizer' && chip.targetTab?.includes('2d')
                          ? 'bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border-green-200 hover:border-green-400'
                          : 'bg-[var(--surface-raised)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-black'
                      } ${isFocused ? 'chip-focused ring-1 ring-[var(--text-primary)]' : ''}`}
                    >
                      {chip.label}
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-[var(--text-tertiary)]">No concept chips for this page</div>
              )}
            </div>
          </div>

          {/* Formatted Content with KaTeX */}
          <div className="text-sm md:text-base leading-relaxed text-[var(--text-primary)] space-y-4">
            {activePageData.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('$$') && paragraph.endsWith('$$')) {
                const math = paragraph.slice(2, -2).trim();
                return (
                  <div
                    key={pIdx}
                    className="my-4 p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] relative group hover:border-[var(--border-strong)] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                        Governing Relation
                      </span>
                      <button
                        onClick={() => onOpenVisualizerForFormula?.(math)}
                        className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Simulate</span>
                      </button>
                    </div>
                    <FormulaRenderer math={math} block />
                  </div>
                );
              }

              return (
                <div key={pIdx}>
                  {paragraph.split('$').map((seg, sIdx) => {
                    if (sIdx % 2 === 1) {
                      return <FormulaRenderer key={sIdx} math={seg} className="mx-1" />;
                    }
                    return <span key={sIdx}>{seg}</span>;
                  })}
                </div>
              );
            })}
          </div>

          {/* Anchored PYQ Card on this Page */}
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--status-high-yield-text)]" />
                <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                  Anchored Past 10-Year Exam Questions (Corpus B)
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {activePageData.pyqs.map((pyq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] hover:border-[var(--border-strong)] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MarkBadge marks={pyq.marks} />
                      <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                        PYQ {pyq.year} • {pyq.paper}
                      </span>
                    </div>
                    <MarkBadge variant="high_yield" text="High Yield Exam Match" />
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] my-2">
                    {pyq.text}
                  </p>

                  <div className="my-2 p-2 rounded-xs bg-[var(--status-trap)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-[11px] text-[var(--status-trap-text)]">
                    <span className="font-bold">⚠️ Examiner Trap Alert: </span>
                    {pyq.trap}
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

export default PdfViewer;
