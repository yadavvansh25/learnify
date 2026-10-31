'use client';

import React from 'react';
import { MarkBadge } from '../shared/MarkBadge';
import { BookOpen, GitBranch, Terminal } from 'lucide-react';

interface TwoDTextViewProps {
  title?: string;
  asciiTree?: string;
  sourceCitation?: {
    quote: string;
    author: string;
    source: string;
    justification: string;
  };
}

export const TwoDTextView: React.FC<TwoDTextViewProps> = ({
  title = "Concept Hierarchy & Structural Citation",
  asciiTree = `
Thermodynamic Systems & State Functions
│
├── First Law of Thermodynamics: dU = δQ - δW
│   ├── Isothermal Process: ΔU = 0, W = nRT ln(V_f / V_i)
│   ├── Isochoric Process: W = 0, ΔU = Q_v = n C_v ΔT
│   └── Adiabatic Process: Q = 0, P V^γ = constant
│
├── Second Law & Heat Engines:
│   ├── Carnot Upper Bound: η = 1 - (T_C / T_H) [MUST USE KELVIN]
│   └── Clausius Inequality: ∮ (dQ / T) ≤ 0
│
└── Microscopic Statistical Interpretation:
    └── Boltzmann Multiplicity: S = k_B ln(Ω)
`.trim(),
  sourceCitation = {
    quote: "The electron pairs in the valence shell of a central atom tend to occupy positions in space that maximise their separation. For four pairs around the central equilibrium position lie at the corners of a regular tetrahedron, with bond angles of 109°28'.",
    author: "Linus Pauling",
    source: "The Nature of the Chemical Bond, 3rd ed., Cornell University Press, 1960, pp. 111–120.",
    justification: "Pauling formalised the geometric argument that modern textbooks summarise in one paragraph. The 109°28' figure is exact for an ideal tetrahedron; the small deviations real molecules show follow from lone-pair repulsion out-weighing bond-pair repulsion."
  }
}) => {
  return (
    <div className="space-y-4 font-sans h-full overflow-y-auto pr-1">
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--text-secondary)]" />
            {title}
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Structural concept hierarchy tree and academic source citation.
          </p>
        </div>
        <MarkBadge variant="high_yield" text="ASCII Concept Tree" />
      </div>

      {/* ASCII Concept Tree Box */}
      <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[var(--text-tertiary)] uppercase">
          <Terminal className="w-3.5 h-3.5" />
          <span>Dependency Structure</span>
        </div>
        <pre className="font-mono text-xs text-[var(--text-primary)] leading-relaxed overflow-x-auto whitespace-pre p-2 bg-[var(--surface-canvas)] rounded border border-[var(--border-subtle)]">
          {asciiTree}
        </pre>
      </div>

      {/* Cited Source Quotation */}
      {sourceCitation && (
        <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Primary Literature Citation</span>
          </div>

          <blockquote className="border-l-2 border-[var(--text-primary)] pl-4 py-1 italic text-xs leading-relaxed text-[var(--text-primary)] bg-[var(--surface-sunken)]/50 rounded-r">
            &#34;{sourceCitation.quote}&#34;
          </blockquote>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-1 text-xs">
            <div className="font-semibold text-[var(--text-primary)]">
              {sourceCitation.author}
            </div>
            <div className="text-[11px] font-mono text-[var(--text-tertiary)]">
              {sourceCitation.source}
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
              {sourceCitation.justification}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoDTextView;
