'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Clock, CheckCircle2, XCircle, ChevronRight, Award } from 'lucide-react';
import { QuizQuestion } from '@/lib/schemas';
import { globalStore } from '@/lib/store';
import { MarkBadge } from '../shared/MarkBadge';

interface QuizzesViewProps {
  docId?: string;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({ docId = 'doc-thermo-101' }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => globalStore.getQuizzes(docId));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(120);

  const current = questions[currentIndex] || questions[0];

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === current.correctIndex) {
      setScore(s => s + current.marks);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setSecondsLeft(120);
    setCurrentIndex(i => (i + 1) % questions.length);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto font-sans">
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            PYQ Multiple-Choice Drills
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            Q {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
            <Clock className="w-3.5 h-3.5" />
            <span>{Math.floor(secondsLeft / 60)}:{secondsLeft % 60 < 10 ? `0${secondsLeft % 60}` : secondsLeft % 60}</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-[var(--status-high-yield-text)] bg-[var(--status-high-yield)] px-2 py-0.5 rounded-xs border border-[#c4e3cb] dark:border-[#1e3b26]">
            <Award className="w-3.5 h-3.5" />
            <span>{score} Marks</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-4">
        <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-2">
          <div className="flex items-center justify-between">
            <MarkBadge marks={current.marks} />
            {current.pyqYear && <span className="font-mono text-xs text-[var(--text-tertiary)]">PYQ {current.pyqYear} Paper</span>}
          </div>

          <p className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
            {current.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {current.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === current.correctIndex;

            let style = 'border-[var(--border-subtle)] bg-[var(--surface-canvas)] hover:border-[var(--border-strong)]';
            if (isAnswered) {
              if (isCorrect) style = 'border-[#c4e3cb] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] font-semibold';
              else if (isSelected) style = 'border-[#f5c6c6] bg-[var(--status-trap)] text-[var(--status-trap-text)] font-semibold';
              else style = 'opacity-40 border-[var(--border-subtle)] bg-[var(--surface-canvas)]';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3 rounded-sm border text-xs font-sans flex items-center justify-between cursor-pointer transition-all ${style}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[11px] h-5 w-5 rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-[var(--status-high-yield-text)]" />}
                    {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[var(--status-trap-text)]" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-3">
            <div className="font-mono text-[10px] uppercase font-bold text-[var(--text-tertiary)]">
              Marking Scheme Explanation:
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {current.markingSchemeExplanation}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
