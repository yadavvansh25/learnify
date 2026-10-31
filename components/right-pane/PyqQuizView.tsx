'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Award,
  ChevronRight
} from 'lucide-react';
import { QuizQuestion } from '@/lib/rag/types';
import { INITIAL_QUIZ_QUESTIONS } from '@/lib/rag/sample-corpus';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';

interface PyqQuizViewProps {
  initialQuestionId?: string;
}

export const PyqQuizView: React.FC<PyqQuizViewProps> = ({
  initialQuestionId
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(INITIAL_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(120);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  const currentQ = questions[currentIndex] || questions[0];

  // Countdown timer
  useEffect(() => {
    if (!timerRunning || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeftSeconds]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctOptionIndex) {
      setTotalScore(prev => prev + currentQ.allocatedMarks);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeftSeconds(120);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTotalScore(0);
    setCurrentIndex(0);
    setTimeLeftSeconds(120);
    setTimerRunning(true);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto font-sans">
      {/* Top Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            Past-Year Question Timed Drill
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            Q {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Live Exam Timer & Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)]">
            <Clock className="w-3.5 h-3.5" />
            <span className={timeLeftSeconds < 30 ? 'text-[var(--status-trap-text)] font-bold animate-pulse' : ''}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--status-high-yield-text)] bg-[var(--status-high-yield)] px-2 py-0.5 rounded-xs border border-[#c4e3cb] dark:border-[#1e3b26]">
            <Award className="w-3.5 h-3.5" />
            <span>Score: {totalScore} Marks</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-4">
        {/* Question Header & Citation */}
        <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MarkBadge marks={currentQ.allocatedMarks} />
              <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">
                {currentQ.examRef}
              </span>
            </div>
            {currentQ.isHighYield && <MarkBadge variant="high_yield" text="High Yield" />}
          </div>

          <p className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
            {currentQ.question}
          </p>

          {currentQ.latexEquation && (
            <div className="p-2 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
              <FormulaRenderer math={currentQ.latexEquation} block />
            </div>
          )}
        </div>

        {/* Multiple Choice Options List */}
        <div className="space-y-2">
          {currentQ.options?.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctOptionIndex;

            let optionStyle = 'border-[var(--border-subtle)] bg-[var(--surface-canvas)] hover:border-[var(--border-strong)] text-[var(--text-primary)]';

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'border-[#c4e3cb] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] font-semibold';
              } else if (isSelected) {
                optionStyle = 'border-[#f5c6c6] bg-[var(--status-trap)] text-[var(--status-trap-text)] font-semibold';
              } else {
                optionStyle = 'opacity-50 border-[var(--border-subtle)] bg-[var(--surface-canvas)]';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3 rounded-sm border text-xs font-sans flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-[11px] h-5 w-5 rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
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

        {/* Post-Answer Step Rubric & Examiner Trap Explanation */}
        {isAnswered && (
          <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] space-y-3">
            {/* Misconception Trap if wrong option chosen */}
            {selectedOption !== null && currentQ.commonMisconceptions?.[selectedOption] && (
              <div className="p-2.5 rounded-xs bg-[var(--status-trap)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-xs text-[var(--status-trap-text)] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{currentQ.commonMisconceptions[selectedOption]}</span>
              </div>
            )}

            {/* Official Step-Marking Rubric */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold mb-1.5">
                Official Examination Marking Rubric:
              </div>
              <div className="space-y-1.5">
                {currentQ.markingRubric.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-2 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-xs flex items-center justify-between"
                  >
                    <span className="text-[var(--text-primary)]">
                      <strong className="font-mono">Step {step.stepNumber}:</strong> {step.description}
                    </span>
                    <MarkBadge marks={step.allocatedMarks} />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              <strong>Official Explanation:</strong> {currentQ.explanation}
            </div>

            {/* Next Question Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-xs"
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
