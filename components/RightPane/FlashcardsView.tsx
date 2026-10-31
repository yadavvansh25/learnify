'use client';

import React, { useState } from 'react';
import { Layers, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Flashcard } from '@/lib/schemas';
import { globalStore } from '@/lib/store';
import { calculateSM2 } from '@/lib/algorithms/sm2';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';

interface FlashcardsViewProps {
  docId?: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ docId = 'doc-thermo-101' }) => {
  const [cards, setCards] = useState<Flashcard[]>(() => globalStore.getFlashcards(docId));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(4);

  const current = cards[currentIndex] || cards[0];

  const handleRate = (quality: number) => {
    const sm2 = calculateSM2({
      quality,
      repetition: 1,
      interval: current.interval,
      easinessFactor: current.easeFactor
    });

    const updated = {
      ...current,
      interval: sm2.interval,
      easeFactor: sm2.easinessFactor
    };

    setCards(prev => {
      const copy = [...prev];
      copy[currentIndex] = updated;
      return copy;
    });

    if (quality >= 3) setStreak(s => s + 1);
    else setStreak(0);

    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(c => (c + 1) % cards.length);
    }, 200);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto font-sans">
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            SM-2 Spaced Repetition Flashcards
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            Card {currentIndex + 1} of {cards.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--status-high-yield-text)] bg-[var(--status-high-yield)] px-2 py-0.5 rounded-full border border-[#c4e3cb] dark:border-[#1e3b26]">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{streak} Streak</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-center items-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-lg min-h-[260px] cursor-pointer perspective-1000 select-none group"
        >
          <div
            className={`w-full h-full min-h-[260px] rounded-sm border border-[var(--border-strong)] bg-[var(--surface-canvas)] p-6 transition-transform duration-500 transform-style-3d shadow-xs flex flex-col justify-between ${
              isFlipped ? 'rotate-y-180 bg-[var(--surface-raised)]' : ''
            }`}
          >
            {!isFlipped ? (
              <div className="flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <MarkBadge variant={current.category === 'trap' ? 'trap' : 'mono'} text={current.category.toUpperCase()} />
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">Interval: {current.interval}d</span>
                </div>

                <div className="my-auto py-3">
                  <p className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                    {current.front}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] text-right font-mono text-xs text-[var(--text-tertiary)]">
                  Click to Flip ↵
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full space-y-4 rotate-y-180">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--status-high-yield-text)] uppercase">
                    Answer & Rubric
                  </span>
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">EF: {current.easeFactor}</span>
                </div>

                <div className="my-auto py-2 text-xs text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {current.back}
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] text-center font-mono text-[11px] text-[var(--text-secondary)]">
                  Rate Recall Difficulty:
                </div>
              </div>
            )}
          </div>
        </div>

        {isFlipped ? (
          <div className="w-full max-w-lg grid grid-cols-4 gap-2 mt-4 font-mono text-xs">
            <button
              onClick={() => handleRate(1)}
              className="py-2 rounded-xs border border-[#f5c6c6] bg-[var(--status-trap)] text-[var(--status-trap-text)] font-bold cursor-pointer"
            >
              Again [1]
            </button>
            <button
              onClick={() => handleRate(2)}
              className="py-2 rounded-xs border border-[#fae2b8] bg-[var(--status-moderate)] text-[var(--status-moderate-text)] font-bold cursor-pointer"
            >
              Hard [2]
            </button>
            <button
              onClick={() => handleRate(3)}
              className="py-2 rounded-xs border border-[#c4e3cb] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] font-bold cursor-pointer"
            >
              Good [3]
            </button>
            <button
              onClick={() => handleRate(4)}
              className="py-2 rounded-xs border border-[var(--border-strong)] bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold cursor-pointer"
            >
              Easy [4]
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-[var(--text-tertiary)]">
            <button
              onClick={() => setCurrentIndex(i => (i > 0 ? i - 1 : cards.length - 1))}
              className="flex items-center gap-1 hover:text-[var(--text-primary)] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <span>Space or click to flip</span>
            <button
              onClick={() => setCurrentIndex(i => (i + 1) % cards.length)}
              className="flex items-center gap-1 hover:text-[var(--text-primary)] cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
