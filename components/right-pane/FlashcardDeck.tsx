'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Flashcard } from '@/lib/rag/types';
import { INITIAL_FLASHCARDS } from '@/lib/rag/sample-corpus';
import { calculateSM2 } from '@/lib/algorithms/sm2';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';

interface FlashcardDeckProps {
  filterConceptId?: string;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  filterConceptId
}) => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    if (filterConceptId) {
      const filtered = INITIAL_FLASHCARDS.filter(c => c.conceptId === filterConceptId);
      return filtered.length > 0 ? filtered : INITIAL_FLASHCARDS;
    }
    return INITIAL_FLASHCARDS;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(4);

  const currentCard = cards[currentIndex] || cards[0];

  // Keyboard navigation for power users (Space to flip, 1-4 for grading)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRateCard(1);
        else if (e.key === '2') handleRateCard(2);
        else if (e.key === '3') handleRateCard(3);
        else if (e.key === '4') handleRateCard(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, cards]);

  const handleRateCard = (quality: number) => {
    const sm2Result = calculateSM2({
      quality,
      repetition: currentCard.repetition,
      interval: currentCard.interval,
      easinessFactor: currentCard.easinessFactor
    });

    const updatedCard: Flashcard = {
      ...currentCard,
      ...sm2Result
    };

    setCards(prev => {
      const copy = [...prev];
      copy[currentIndex] = updatedCard;
      return copy;
    });

    if (quality >= 3) {
      setStreakCount(prev => prev + 1);
    } else {
      setStreakCount(0);
    }

    // Flip back and go to next card
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const masteredCount = cards.filter(c => c.reviewState === 'mastered').length;
  const learningCount = cards.filter(c => c.reviewState === 'learning' || c.reviewState === 'new').length;

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto font-sans">
      {/* Top Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            SM-2 Spaced Repetition Decks
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            Card {currentIndex + 1} of {cards.length}
          </span>
        </div>

        {/* Retention Streak Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--status-high-yield-text)] bg-[var(--status-high-yield)] px-2 py-0.5 rounded-full border border-[#c4e3cb] dark:border-[#1e3b26]">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{streakCount} Streak</span>
        </div>
      </div>

      {/* Main Flashcard Container with 3D Flip */}
      <div className="p-4 flex-1 flex flex-col justify-center items-center">
        {/* Flip Card Wrapper */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-lg min-h-[280px] cursor-pointer perspective-1000 select-none group"
        >
          <div
            className={`w-full h-full min-h-[280px] rounded-sm border border-[var(--border-strong)] bg-[var(--surface-canvas)] p-6 transition-transform duration-500 transform-style-3d shadow-xs flex flex-col justify-between ${
              isFlipped ? 'rotate-y-180 bg-[var(--surface-raised)]' : ''
            }`}
          >
            {/* FRONT OF CARD */}
            {!isFlipped ? (
              <div className="flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MarkBadge marks={currentCard.allocatedMarks} />
                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      PYQ {currentCard.examYear}
                    </span>
                  </div>
                  {currentCard.isHighYield && (
                    <MarkBadge variant="high_yield" text="High Yield" />
                  )}
                </div>

                <div className="my-auto py-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
                    Concept Prompt:
                  </span>
                  <p className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                    {currentCard.front}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-tertiary)] font-mono">
                  <span>Topic: {currentCard.topic}</span>
                  <span className="group-hover:text-[var(--text-primary)] transition-colors">
                    Click or Press Space to Flip ↵
                  </span>
                </div>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="flex flex-col justify-between h-full space-y-4 rotate-y-180">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--status-high-yield-text)]">
                    Model Answer & Marking Rubric
                  </span>
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">
                    EF: {currentCard.easinessFactor}
                  </span>
                </div>

                <div className="my-auto py-2 space-y-3">
                  <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                    {currentCard.back}
                  </div>

                  {currentCard.formulaLatex && (
                    <div className="p-2 rounded-xs bg-[var(--surface-canvas)] border border-[var(--border-subtle)]">
                      <FormulaRenderer math={currentCard.formulaLatex} block />
                    </div>
                  )}

                  {currentCard.trapWarning && (
                    <div className="p-2 rounded-xs bg-[var(--status-trap)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-xs text-[var(--status-trap-text)] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{currentCard.trapWarning}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] font-mono text-center">
                  Rate recall quality below to schedule next review:
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SM-2 Rating Buttons (Active when flipped) */}
        {isFlipped ? (
          <div className="w-full max-w-lg grid grid-cols-4 gap-2 mt-4">
            <button
              onClick={() => handleRateCard(1)}
              className="py-2 px-1 text-center rounded-sm border border-[#f5c6c6] bg-[var(--status-trap)] text-[var(--status-trap-text)] hover:opacity-90 font-mono text-xs cursor-pointer transition-all"
            >
              <div className="font-bold">Again [1]</div>
              <div className="text-[10px] opacity-80">&lt;10m</div>
            </button>

            <button
              onClick={() => handleRateCard(2)}
              className="py-2 px-1 text-center rounded-sm border border-[#fae2b8] bg-[var(--status-moderate)] text-[var(--status-moderate-text)] hover:opacity-90 font-mono text-xs cursor-pointer transition-all"
            >
              <div className="font-bold">Hard [2]</div>
              <div className="text-[10px] opacity-80">1 day</div>
            </button>

            <button
              onClick={() => handleRateCard(3)}
              className="py-2 px-1 text-center rounded-sm border border-[#c4e3cb] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] hover:opacity-90 font-mono text-xs cursor-pointer transition-all"
            >
              <div className="font-bold">Good [3]</div>
              <div className="text-[10px] opacity-80">6 days</div>
            </button>

            <button
              onClick={() => handleRateCard(4)}
              className="py-2 px-1 text-center rounded-sm border border-[var(--border-strong)] bg-[var(--text-primary)] text-[var(--surface-raised)] hover:opacity-90 font-mono text-xs cursor-pointer transition-all"
            >
              <div className="font-bold">Easy [4]</div>
              <div className="text-[10px] opacity-80">14 days</div>
            </button>
          </div>
        ) : (
          <div className="mt-4 text-xs font-mono text-[var(--text-tertiary)] flex items-center gap-4">
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1))}
              className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span>Press Space or click card to flip</span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % cards.length)}
              className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Deck Retention Stats Strip */}
        <div className="w-full max-w-lg mt-6 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center font-mono text-xs">
          <div className="p-2 rounded-xs bg-[var(--surface-canvas)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-tertiary)] block text-[10px]">Mastered</span>
            <span className="font-bold text-[var(--status-high-yield-text)]">{masteredCount}</span>
          </div>
          <div className="p-2 rounded-xs bg-[var(--surface-canvas)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-tertiary)] block text-[10px]">Learning</span>
            <span className="font-bold text-[var(--text-primary)]">{learningCount}</span>
          </div>
          <div className="p-2 rounded-xs bg-[var(--surface-canvas)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-tertiary)] block text-[10px]">Interval</span>
            <span className="font-bold text-[var(--text-primary)]">{currentCard.interval}d</span>
          </div>
        </div>
      </div>
    </div>
  );
};
