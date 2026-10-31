'use client';

import React, { useState } from 'react';
import { Lightbulb, Send, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';
import { VoiceBlob, VoiceState } from './VoiceBlob';
import { MarkBadge } from '../shared/MarkBadge';
import { FeynmanTurn } from '@/lib/schemas';
import { globalStore } from '@/lib/store';

interface FeynmanViewProps {
  docId?: string;
  concept?: string;
}

export const FeynmanView: React.FC<FeynmanViewProps> = ({
  docId = 'doc-thermo-101',
  concept = 'Carnot Engine & Maximum Efficiency'
}) => {
  const [currentConcept, setCurrentConcept] = useState(concept);
  const [explanation, setExplanation] = useState('');
  const [turnNumber, setTurnNumber] = useState(1);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [audioLevel, setAudioLevel] = useState(0.5);
  const [turnResult, setTurnResult] = useState<FeynmanTurn | null>(null);
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Explain "${concept}" simply as if you were teaching a 12-year-old friend. Avoid heavy academic jargon, use a real-world physical metaphor, and watch out for common exam traps.`
    }
  ]);

  const handleEvaluate = async (textToEvaluate?: string) => {
    const text = (textToEvaluate || explanation).trim();
    if (!text) return;

    setHistory(prev => [...prev, { role: 'user', text }]);
    setExplanation('');
    setVoiceState('thinking');

    try {
      const res = await fetch(`/api/feynman/${docId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: currentConcept,
          userExplanation: text,
          turnNumber
        })
      });
      const data = await res.json();
      const turn: FeynmanTurn = data.turn;

      setTurnResult(turn);
      setVoiceState('speaking');

      setHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `[Turn ${turn.turnNumber}/4 Evaluator Feedback]:\n${turn.evaluatorFeedback}\n\n👉 Followup Question: ${turn.followupQuestion}`
        }
      ]);

      // If good grounding, update node mastery
      if (turn.clarityScore >= 70 && turn.analogyScore >= 70) {
        globalStore.updateNodeMastery(docId, 'n-carnot-engine', 80, 'mastered');
      }

      setTurnNumber(prev => Math.min(4, prev + 1));

      setTimeout(() => setVoiceState('idle'), 3000);
    } catch {
      setVoiceState('idle');
    }
  };

  const handleVoiceOrbClick = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setAudioLevel(0.8);
      setTimeout(() => {
        const spoken = 'A Carnot engine is like a waterwheel where heat drops from a high reservoir to a low pond, spinning the wheel to extract work.';
        setExplanation(spoken);
        setVoiceState('thinking');
        handleEvaluate(spoken);
      }, 2500);
    } else {
      setVoiceState('idle');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            Feynman Analogy Tester & Rubric Auditor
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            Turn {turnNumber}/4
          </span>
        </div>

        <button
          onClick={() => {
            setTurnNumber(1);
            setTurnResult(null);
            setHistory([{
              role: 'assistant',
              text: `Session reset. Explain "${currentConcept}" in simple plain English.`
            }]);
          }}
          className="p-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Procedural VoiceBlob Visualizer */}
        <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-col items-center justify-center">
          <VoiceBlob
            state={voiceState}
            level={audioLevel}
            size={110}
            onClick={handleVoiceOrbClick}
          />
        </div>

        {/* 3 Metric Meters */}
        {turnResult && (
          <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Three Metric Meters
              </span>
              <MarkBadge
                variant={turnResult.clarityScore >= 75 ? 'high_yield' : 'trap'}
                text={`${Math.round((turnResult.clarityScore + turnResult.analogyScore) / 2)}% Mastery`}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">1. Simplicity & Jargon Elimination:</span>
                <span className="font-mono font-bold">{turnResult.clarityScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
                <div className="h-full bg-[var(--text-primary)]" style={{ width: `${turnResult.clarityScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">2. Analogy & Metaphor Strength:</span>
                <span className="font-mono font-bold text-[var(--status-high-yield-text)]">{turnResult.analogyScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
                <div className="h-full bg-[var(--status-high-yield-text)]" style={{ width: `${turnResult.analogyScore}%` }} />
              </div>
            </div>

            {turnResult.missingKeywords.length > 0 && (
              <div className="p-2 rounded-xs bg-[var(--status-trap)] text-[var(--status-trap-text)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-xs">
                <span className="font-bold">Missing Exam Marking Anchors: </span>
                {turnResult.missingKeywords.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Message Log */}
        <div className="space-y-3">
          {history.map((h, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-sm text-xs leading-relaxed ${
                h.role === 'user'
                  ? 'bg-[var(--surface-sunken)] border border-[var(--border-subtle)] ml-6 text-[var(--text-primary)]'
                  : 'bg-[var(--surface-raised)] border border-[var(--border-subtle)] mr-6 text-[var(--text-primary)]'
              }`}
            >
              <div className="font-mono text-[10px] uppercase font-bold text-[var(--text-tertiary)] mb-1">
                {h.role === 'user' ? 'Candidate' : 'Feynman Evaluator'}
              </div>
              <div className="whitespace-pre-wrap">{h.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEvaluate();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain simply without academic buzzwords..."
            className="flex-1 px-3 py-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
          />
          <button
            type="submit"
            disabled={!explanation.trim()}
            className="px-3.5 py-2 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
          >
            <span>Audit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
