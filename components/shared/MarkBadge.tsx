'use client';

import React from 'react';

interface MarkBadgeProps {
  marks?: number;
  text?: string;
  variant?: 'marks' | 'high_yield' | 'trap' | 'moderate' | 'mastered' | 'mono';
  className?: string;
}

export const MarkBadge: React.FC<MarkBadgeProps> = ({
  marks,
  text,
  variant = 'marks',
  className = ''
}) => {
  if (variant === 'high_yield') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium tracking-tight bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border border-[#c4e3cb] dark:border-[#1e3b26] ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-high-yield-text)] animate-pulse" />
        {text || 'High-Yield (Top 10%)'}
      </span>
    );
  }

  if (variant === 'trap') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium tracking-tight bg-[var(--status-trap)] text-[var(--status-trap-text)] border border-[#f5c6c6] dark:border-[#4d1f1f] ${className}`}
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {text || 'Examiner Pitfall'}
      </span>
    );
  }

  if (variant === 'moderate') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium tracking-tight bg-[var(--status-moderate)] text-[var(--status-moderate-text)] border border-[#fae2b8] dark:border-[#4a3410] ${className}`}
      >
        {text || 'Moderate Mastery'}
      </span>
    );
  }

  if (variant === 'mastered') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium tracking-tight bg-[var(--status-mastered)] text-[var(--status-mastered-text)] border border-[#c4e3cb] dark:border-[#1e3b26] ${className}`}
      >
        ✓ {text || 'Mastered'}
      </span>
    );
  }

  // Default marks badge: "[5 Marks]" in Geist Mono
  return (
    <span
      className={`inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-sm bg-[var(--surface-sunken)] text-[var(--text-primary)] border border-[var(--border-subtle)] ${className}`}
    >
      {marks !== undefined ? `[${marks} Marks]` : text}
    </span>
  );
};
