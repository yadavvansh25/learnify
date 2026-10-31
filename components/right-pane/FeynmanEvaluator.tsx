'use client';

import React, { useState } from 'react';
import {
  Mic,
  Send,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { VoiceBlob, VoiceState } from '../shared/VoiceBlob';
import { FeynmanCritique } from '@/lib/rag/types';
import { evaluateFeynmanExplanation } from '@/lib/feynman/evaluator';
import { MarkBadge } from '../shared/MarkBadge';

interface FeynmanEvaluatorProps {
  initialTopic?: string;
}

export const FeynmanEvaluator: React.FC<FeynmanEvaluatorProps> = ({
  initialTopic = 'Carnot Engine & Efficiency'
}) => {
  const [topic, setTopic] = useState<string>(initialTopic);
  const [explanation, setExplanation] = useState<string>('');
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [critique, setCritique] = useState<FeynmanCritique | null>(null);
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Welcome to the Feynman Viva Chamber. Explain "${initialTopic}" as if you were teaching a 12-year-old. Avoid hollow academic buzzwords, use a physical real-world analogy, and preserve fundamental exam truth.`
    }
  ]);

  const handleEvaluate = async (textToEvaluate?: string) => {
    const text = (textToEvaluate || explanation).trim();
    if (!text) return;

    setVoiceState('thinking');

    // Add user message to history
    setHistory(prev => [...prev, { role: 'user', text }]);
    setExplanation('');

    // Call evaluator
    setTimeout(() => {
      const result = evaluateFeynmanExplanation({
        topic,
        studentExplanation: text,
        turnNumber
      });

      setCritique(result);
      setVoiceState('speaking');

      // Add assistant feedback message
      setHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `[Turn ${turnNumber}/4] ${result.overallFeedback} ${result.suggestedAnalogy ? `\n\n💡 ${result.suggestedAnalogy}` : ''}`
        }
      ]);

      setTurnNumber(prev => Math.min(4, prev + 1));

      setTimeout(() => {
        setVoiceState('idle');
      }, 3500);
    }, 600);
  };

  const handleVoiceBlobClick = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      // Simulate listening speech recognition
      setTimeout(() => {
        const sampleSpoken = 'A Carnot engine is like a waterwheel where heat drops from a hot reservoir to a cold reservoir, extracting work along the way.';
        setExplanation(sampleSpoken);
        setVoiceState('thinking');
        handleEvaluate(sampleSpoken);
      }, 2500);
    } else {
      setVoiceState('idle');
    }
  };

  const handleResetSession = () => {
    setTurnNumber(1);
    setExplanation('');
    setCritique(null);
    setVoiceState('idle');
    setHistory([
      {
        role: 'assistant',
        text: `Session reset. Explain "${topic}" simply in your own words.`
      }
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-hidden font-sans">
      {/* Top Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            Feynman Technique Evaluator
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            Turn {turnNumber} of 4
          </span>
        </div>

        <button
          onClick={handleResetSession}
          className="p-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          title="Reset Session"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Conversation & Evaluation Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Viva Animated VoiceBlob Orb */}
        <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-col items-center justify-center">
          <VoiceBlob
            state={voiceState}
            size={110}
            onClick={handleVoiceBlobClick}
          />
          <div className="mt-2 text-center">
            <span className="text-xs text-[var(--text-secondary)]">
              Click orb to speak viva voice note or type below.
            </span>
          </div>
        </div>

        {/* 3 Criteria Scorecards (Shown after submission) */}
        {critique && (
          <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Evaluation Rubric (Score: {critique.compositeScore}/100)
              </span>
              <MarkBadge
                variant={critique.compositeScore >= 80 ? 'high_yield' : critique.compositeScore >= 60 ? 'moderate' : 'trap'}
                text={`${critique.compositeScore}% Grade`}
              />
            </div>

            {/* Criteria 1: Simplicity */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">1. Simplicity & Readability:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{critique.simplicityScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
                <div
                  className="h-full bg-[var(--text-primary)] transition-all duration-500"
                  style={{ width: `${critique.simplicityScore}%` }}
                />
              </div>
            </div>

            {/* Criteria 2: Analogy Strength */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">2. Physical Analogy Quality:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{critique.analogyScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
                <div
                  className="h-full bg-[var(--status-high-yield-text)] transition-all duration-500"
                  style={{ width: `${critique.analogyScore}%` }}
                />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                {critique.analogyAssessment}
              </p>
            </div>

            {/* Criteria 3: Core Grounding */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">3. Exam Grounding & Keywords:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{critique.groundingScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
                <div
                  className="h-full bg-[#3b82f6] transition-all duration-500"
                  style={{ width: `${critique.groundingScore}%` }}
                />
              </div>
            </div>

            {/* Detected Jargon Detector Box */}
            {critique.detectedJargon.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">
                  Jargon Audit (Unexplained Terms):
                </div>
                {critique.detectedJargon.map((j, idx) => (
                  <div key={idx} className="p-2 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-xs">
                    <span className="font-bold text-[var(--status-trap-text)]">"{j.term}"</span>: {j.recommendation}
                  </div>
                ))}
              </div>
            )}

            {/* Traps Detected */}
            {critique.identifiedTraps.length > 0 && (
              <div className="p-2 rounded-xs bg-[var(--status-trap)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-xs text-[var(--status-trap-text)]">
                {critique.identifiedTraps.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message Log */}
        <div className="space-y-3">
          {history.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-sm text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--surface-sunken)] border border-[var(--border-subtle)] ml-4 text-[var(--text-primary)]'
                  : 'bg-[var(--surface-raised)] border border-[var(--border-subtle)] mr-4 text-[var(--text-primary)]'
              }`}
            >
              <div className="font-mono text-[10px] uppercase text-[var(--text-tertiary)] mb-1 font-bold">
                {msg.role === 'user' ? 'You (Candidate)' : 'Feynman Socratic Examiner'}
              </div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form at Bottom */}
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
            placeholder={`Explain ${topic} in plain English...`}
            className="flex-1 px-3 py-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)]"
          />
          <button
            type="submit"
            disabled={!explanation.trim()}
            className="px-3 py-2 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
          >
            <span>Audit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
