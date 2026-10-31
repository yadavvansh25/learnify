'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  ArrowRight,
  BookOpen,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SocraticStepAudit } from '@/lib/rag/types';
import { MarkBadge } from '../shared/MarkBadge';

interface SocraticDebuggerProps {
  initialProblem?: string;
}

export const SocraticDebugger: React.FC<SocraticDebuggerProps> = ({
  initialProblem
}) => {
  const [topic, setTopic] = useState('Carnot Efficiency & Kelvin Temperature');
  const [stepsInput, setStepsInput] = useState(
`Step 1: Given boiler temperature T_H = 280 °C and condenser T_C = 25 °C.
Step 2: Apply Carnot efficiency formula: eta = 1 - (T_C / T_H)
Step 3: Substitute: eta = 1 - (25 / 280) = 1 - 0.089 = 0.911 = 91.1%
Step 4: Output work = 120 MW, so Heat In = 120 / 0.911 = 131.7 MW.`
  );

  const [auditResult, setAuditResult] = useState<SocraticStepAudit | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAuditSteps = async (customSteps?: string) => {
    const textToAudit = customSteps || stepsInput;
    setIsAuditing(true);

    try {
      const res = await fetch('/api/socratic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentSteps: textToAudit, topic })
      });
      const data = await res.json();
      setAuditResult(data.audit);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleLoadPresavedExample = (type: 'celsius_trap' | 'isothermal_trap' | 'correct_run') => {
    if (type === 'celsius_trap') {
      setTopic('Carnot Efficiency & Kelvin Temperature');
      const steps = `Step 1: Given T_H = 280 °C, T_C = 25 °C.
Step 2: eta = 1 - (25 / 280) = 0.911 = 91.1%
Step 3: Heat rejected = Heat in - Work.`;
      setStepsInput(steps);
      handleAuditSteps(steps);
    } else if (type === 'isothermal_trap') {
      setTopic('First Law: Isothermal Work');
      const steps = `Step 1: Given initial pressure P_1 = 3.0e5 Pa, V_1 = 4.0e-3 m^3, expanding to V_2 = 12.0e-3 m^3.
Step 2: Work done W = P * (V2 - V1) = 3.0e5 * (12e-3 - 4e-3) = 2400 J.
Step 3: Heat absorbed Q = W = 2400 J.`;
      setStepsInput(steps);
      handleAuditSteps(steps);
    } else {
      setTopic('Carnot Efficiency & Kelvin Temperature (Correct)');
      const steps = `Step 1: Convert temperatures to absolute Kelvin:
T_H = 280 + 273.15 = 553.15 K
T_C = 25 + 273.15 = 298.15 K
Step 2: eta = 1 - (298.15 / 553.15) = 1 - 0.5390 = 0.4610 (46.1%)
Step 3: Heat rejected Q_C = (120 MW / 0.4610) - 120 MW = 140.3 MW.`;
      setStepsInput(steps);
      handleAuditSteps(steps);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto font-sans">
      {/* Top Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            Socratic Step Debugger
          </span>
          <MarkBadge variant="high_yield" text="Zero Passive Cheating" />
        </div>

        {/* Preset test examples */}
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className="text-[var(--text-tertiary)] hidden sm:inline">Presets:</span>
          <button
            onClick={() => handleLoadPresavedExample('celsius_trap')}
            className="px-2 py-0.5 rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Trap 1 (Celsius)
          </button>
          <button
            onClick={() => handleLoadPresavedExample('isothermal_trap')}
            className="px-2 py-0.5 rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Trap 2 (P·ΔV)
          </button>
          <button
            onClick={() => handleLoadPresavedExample('correct_run')}
            className="px-2 py-0.5 rounded-xs border border-[#c4e3cb] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] cursor-pointer"
          >
            Correct Model
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Working Scratchpad Input Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Paste Rough Calculation Steps or Scratchpad Notes:
            </label>
            <span className="text-xs text-[var(--text-tertiary)]">
              Auditor will isolate failure point without spoiling answer
            </span>
          </div>

          <textarea
            value={stepsInput}
            onChange={(e) => setStepsInput(e.target.value)}
            rows={5}
            placeholder="Step 1: ...&#10;Step 2: ...&#10;Step 3: ..."
            className="w-full p-3 font-mono text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={() => handleAuditSteps()}
              disabled={isAuditing || !stepsInput.trim()}
              className="px-3.5 py-1.5 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAuditing ? 'Auditing Steps...' : 'Audit Scratchpad Steps'}</span>
            </button>
          </div>
        </div>

        {/* Audit Report Result Box */}
        {auditResult && (
          <div className="space-y-3 pt-2">
            {/* Status Strip */}
            <div
              className={`p-3.5 rounded-sm border ${
                auditResult.status === 'correct'
                  ? 'bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border-[#c4e3cb] dark:border-[#1e3b26]'
                  : 'bg-[var(--status-trap)] text-[var(--status-trap-text)] border-[#f5c6c6] dark:border-[#4d1f1f]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {auditResult.status === 'correct' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertOctagon className="w-4 h-4" />
                  )}
                  <span className="font-bold text-xs uppercase tracking-wider font-mono">
                    {auditResult.status === 'correct'
                      ? 'All Steps Mathematically & Conceptually Verified'
                      : `Precise Point of Failure Isolated: Step ${auditResult.faultyStepIndex}`}
                  </span>
                </div>
                <span className="font-mono text-xs">
                  {auditResult.faultType ? `Fault: ${auditResult.faultType}` : 'Verified'}
                </span>
              </div>
            </div>

            {/* Socratic Hint & First Principles Guidance */}
            <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">
                  Socratic First-Principles Hint:
                </span>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed mt-1">
                  {auditResult.socraticHint}
                </p>
              </div>

              {/* Guiding Question */}
              <div className="p-3 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-[var(--text-primary)]">
                      Probing Question:
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {auditResult.guidingQuestion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strict Citations */}
              <div className="pt-2 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                  <span>{auditResult.relevantSyllabusSection}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--status-high-yield-text)]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{auditResult.pyqMarkSchemeCitation}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
