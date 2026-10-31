'use client';

import React, { useState } from 'react';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const FormulaView: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const STEPS = [
    {
      step: 1,
      title: 'First Law for Reversible Isothermal Expansion',
      formula: 'dU = \\delta Q - \\delta W = 0 \\implies Q_H = W = \\int_{V_1}^{V_2} P \\, dV',
      marks: 1,
      explanation: 'Since internal energy U depends solely on temperature for an ideal gas (Joule expansion experiment), ΔU = 0. All absorbed heat is converted to boundary work.',
      variables: [
        { symbol: 'dU', meaning: 'Differential internal energy change (0 for isotherm)' },
        { symbol: 'Q_H', meaning: 'Heat absorbed from high-temperature reservoir' },
        { symbol: 'W', meaning: 'Mechanical boundary work performed BY expanding gas' }
      ]
    },
    {
      step: 2,
      title: 'Integration of Ideal Gas Equation of State',
      formula: 'W = \\int_{V_1}^{V_2} \\frac{nRT_H}{V} \\, dV = nRT_H \\ln\\left(\\frac{V_2}{V_1}\\right)',
      marks: 2,
      explanation: 'Substituting P = nRT/V into work integral. Logarithmic volume ratio arises from hyperbolic P-V relationship.',
      variables: [
        { symbol: 'n', meaning: 'Number of moles of gas' },
        { symbol: 'R', meaning: 'Universal gas constant = 8.314 J/(mol·K)' },
        { symbol: 'V_2/V_1', meaning: 'Volume expansion ratio (> 1)' }
      ]
    },
    {
      step: 3,
      title: 'Carnot Cycle Thermal Efficiency Formulation',
      formula: '\\eta = \\frac{W_{\\text{net}}}{Q_H} = \\frac{Q_H - |Q_C|}{Q_H} = 1 - \\frac{T_C}{T_H}',
      marks: 2,
      explanation: 'Net work equals enclosed loop area. Ratio of heat transfers equals ratio of absolute thermodynamic temperatures.',
      variables: [
        { symbol: '\\eta', meaning: 'Thermal efficiency (< 1 always)' },
        { symbol: 'T_H', meaning: 'Absolute temperature of hot reservoir in Kelvin' },
        { symbol: 'T_C', meaning: 'Absolute temperature of cold sink in Kelvin' }
      ]
    }
  ];

  return (
    <div className="space-y-4 font-sans">
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
        <h4 className="font-bold text-sm text-[var(--text-primary)]">
          Step-by-Step KaTeX Derivations & Variable Dictionary
        </h4>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Official examination derivation steps with variable definitions and allocated marking rubrics.
        </p>
      </div>

      <div className="space-y-3">
        {STEPS.map((s) => {
          const isExpanded = expandedStep === s.step;

          return (
            <div
              key={s.step}
              className="p-3.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] hover:border-[var(--border-strong)] transition-all"
            >
              <div
                onClick={() => setExpandedStep(isExpanded ? null : s.step)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    Step {s.step}: {s.title}
                  </span>
                  <MarkBadge marks={s.marks} />
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />}
              </div>

              <div className="my-2 p-2 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                <FormulaRenderer math={s.formula} block />
              </div>

              {isExpanded && (
                <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {s.explanation}
                  </p>

                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">
                      Variable Dictionary:
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {s.variables.map((v, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-2 font-mono text-[11px] p-1 rounded-xs bg-[var(--surface-sunken)]">
                          <span className="font-bold text-[var(--text-primary)] w-14 shrink-0">{v.symbol}:</span>
                          <span className="text-[var(--text-secondary)]">{v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
