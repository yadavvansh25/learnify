'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  BookOpen,
  FileText,
  Sliders,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { FormulaRenderer } from './shared/FormulaRenderer';
import { MarkBadge } from './shared/MarkBadge';

interface PdfViewerProps {
  docId: string;
  title: string;
  pageCount?: number;
  onSelectConcept?: (concept: string) => void;
  onOpenVisualizerForFormula?: (formula: string) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  docId,
  title,
  pageCount = 3,
  onSelectConcept,
  onOpenVisualizerForFormula
}) => {
  const [currentPage, setCurrentPage] = useState<number>(2); // Default to Chapter 2 (Carnot cycle)
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const PAGES = [
    {
      pageNumber: 1,
      chapter: 'Chapter 1: Foundations & The First Law',
      title: 'Internal Energy and Quasi-Static Work',
      content: `The First Law of Thermodynamics is the formulation of the principle of conservation of energy for thermodynamic systems. For an infinitesimal quasi-static transformation, the differential change in internal energy $dU$ is given by:

$$dU = \\delta Q - \\delta W$$

where $\\delta Q$ represents heat supplied to the system, and $\\delta W = P dV$ is the mechanical work performed by the system against external pressure $P$.

Important Note on Sign Convention: In modern IUPAC physics examinations, work done BY the system on the surroundings is treated as positive in $dU = \\delta Q - \\delta W$. When computing expansion work:

$$W = \\int_{V_i}^{V_f} P(V) \\, dV$$

For an ideal gas undergoing an isothermal process ($T = \\text{constant}$), the equation of state $PV = nRT$ yields:

$$W = nRT \\ln\\left(\\frac{V_f}{V_i}\\right) = nRT \\ln\\left(\\frac{P_i}{P_f}\\right)$$

Because temperature is constant for an ideal gas, $\\Delta U = 0$, implying $Q = W$. All absorbed heat is converted completely into boundary work during that single isothermal stroke.`,
      formulas: ['dU = \\delta Q - \\delta W', 'W = nRT \\ln(V_f / V_i)'],
      pyqs: [
        {
          year: 2023,
          paper: 'Paper 41',
          marks: 5,
          text: '0.50 moles of gas expands at 289 K to 3x volume. Calculate work done W.',
          trap: 'Using W = P*ΔV instead of logarithmic integral W = nRT ln(Vf/Vi).'
        }
      ]
    },
    {
      pageNumber: 2,
      chapter: 'Chapter 2: Reversible Cycles & The Carnot Engine',
      title: 'The Four Stages of the Carnot Cycle',
      content: `Nicolas Léonard Sadi Carnot established in 1824 that the maximum theoretical efficiency of any heat engine operating between two thermal reservoirs at temperatures $T_H$ (hot) and $T_C$ (cold) depends solely on these absolute temperatures.

The ideal Carnot Cycle consists of four sequential, reversible strokes:

1. Stage 1 -> 2: Reversible Isothermal Expansion at $T_H$. The gas expands from $V_1$ to $V_2$, absorbing heat $Q_H = nRT_H \\ln(V_2/V_1)$.
2. Stage 2 -> 3: Reversible Adiabatic Expansion from $T_H$ down to $T_C$. No heat enters or leaves ($Q = 0$). The gas obeys $P V^\\gamma = \\text{constant}$ and $T V^{\\gamma-1} = \\text{constant}$.
3. Stage 3 -> 4: Reversible Isothermal Compression at $T_C$. The gas is compressed from $V_3$ to $V_4$, ejecting heat $|Q_C| = nRT_C \\ln(V_3/V_4)$ to the cold sink.
4. Stage 4 -> 1: Reversible Adiabatic Compression back to $T_H$. Work is done ON the gas, elevating its temperature back to $T_H$ to close the state loop.

Net thermal efficiency is defined as:

$$\\eta = \\frac{W_{\\text{net}}}{Q_H} = \\frac{Q_H - |Q_C|}{Q_H} = 1 - \\frac{T_C}{T_H}$$

Crucial Exam Theorem: No real heat engine operating between two given reservoirs can be more efficient than a Carnot engine operating between the same reservoirs.`,
      formulas: ['\\eta = 1 - \\frac{T_C}{T_H}', 'P V^\\gamma = \\text{const}'],
      pyqs: [
        {
          year: 2024,
          paper: 'Paper 42',
          marks: 5,
          text: 'A geothermal plant operates between 280 °C and 25 °C. Calculate max efficiency.',
          trap: 'CRITICAL TRAP: Substituting Celsius directly into 1 - (25/280) = 91.1%! Must use Kelvin: 1 - (298/553) = 46.1%.'
        }
      ]
    },
    {
      pageNumber: 3,
      chapter: 'Chapter 3: Entropy & The Second Law',
      title: 'Clausius Inequality and Thermodynamic Entropy',
      content: `Rudolf Clausius formulated the Second Law of Thermodynamics mathematically through the Clausius Theorem. For any thermodynamic cycle:

$$\\oint \\frac{\\delta Q_{\\text{rev}}}{T} \\le 0$$

where equality holds strictly for reversible cycles, and the strict inequality holds for irreversible cycles. This guarantees the existence of a state function called Entropy $S$:

$$dS = \\frac{\\delta Q_{\\text{rev}}}{T}, \\quad \\Delta S = S_B - S_A = \\int_A^B \\frac{\\delta Q_{\\text{rev}}}{T}$$

For an isolated system undergoing any natural process:

$$\\Delta S_{\\text{isolated}} \\ge 0$$

Microscopic Boltzmann interpretation:
$$S = k_B \\ln(\\Omega)$$
where $k_B = 1.380649 \\times 10^{-23} \\, \\text{J/K}$ is the Boltzmann constant and $\\Omega$ represents the number of accessible microstates.`,
      formulas: ['dS = \\frac{\\delta Q_{\\text{rev}}}{T}', 'S = k_B \\ln(\\Omega)'],
      pyqs: [
        {
          year: 2022,
          paper: 'Paper 2',
          marks: 3,
          text: 'State Clausius Second Law and calculate entropy change of 0.2 kg melting ice at 0 °C.',
          trap: 'Using room temperature 298 K in denominator instead of melting ice temperature 273 K.'
        }
      ]
    }
  ];

  const activePageData = PAGES[currentPage - 1] || PAGES[0];

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
            {currentPage} / {pageCount}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
            disabled={currentPage >= pageCount}
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
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-xs bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border border-[#c4e3cb] dark:border-[#1e3b26]">
            Corpus B: 10-Yr PYQ Tagged
          </span>
        </div>

        <span className="font-mono text-[11px] font-semibold text-[var(--status-high-yield-text)]">
          +1.8x High-Yield Priority
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
                Page {currentPage} of {pageCount} • {title}
              </span>
              <MarkBadge variant="high_yield" text="High Exam Frequency" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {activePageData.title}
            </h1>
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
