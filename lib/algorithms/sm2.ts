/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 * Computes next review interval, repetition count, and easiness factor (EF).
 */

export interface SM2Input {
  quality: number; // 0 to 5, or 1 to 4 mapped
  repetition: number;
  interval: number; // in days
  easinessFactor: number;
}

export interface SM2Output {
  repetition: number;
  interval: number;
  easinessFactor: number;
  nextReviewDate: string;
  reviewState: 'learning' | 'review' | 'mastered';
}

/**
 * Standard rating mapping:
 * 1 (Again) -> score 1
 * 2 (Hard)  -> score 2
 * 3 (Good)  -> score 4
 * 4 (Easy)  -> score 5
 */
export function calculateSM2(input: SM2Input): SM2Output {
  const { quality, repetition, interval, easinessFactor } = input;

  let newRepetition = repetition;
  let newInterval = interval;
  let newEF = easinessFactor;

  // Rating < 3 means the response was incorrect or failed recall
  if (quality < 3) {
    newRepetition = 0;
    newInterval = 1;
  } else {
    if (repetition === 0) {
      newInterval = 1;
    } else if (repetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
    newRepetition = repetition + 1;
  }

  // Calculate new Easiness Factor
  // EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEF = newEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) {
    newEF = 1.3;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  let state: 'learning' | 'review' | 'mastered' = 'learning';
  if (newRepetition >= 4 && newInterval >= 21) {
    state = 'mastered';
  } else if (newRepetition > 0) {
    state = 'review';
  }

  return {
    repetition: newRepetition,
    interval: newInterval,
    easinessFactor: Number(newEF.toFixed(2)),
    nextReviewDate: nextDate.toISOString().split('T')[0],
    reviewState: state,
  };
}
