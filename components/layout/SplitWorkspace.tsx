'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SplitWorkspaceProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  splitPercentage: number;
  onSplitChange: (newSplit: number) => void;
}

export const SplitWorkspace: React.FC<SplitWorkspaceProps> = ({
  leftPane,
  rightPane,
  splitPercentage,
  onSplitChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawPercent = ((e.clientX - rect.left) / rect.width) * 100;
    // Bound between 20% and 80% for pleasant ergonomic split
    const clamped = Math.max(20, Math.min(80, Math.round(rawPercent)));
    onSplitChange(clamped);
  }, [isDragging, onSplitChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Mobile / single pane views:
  if (splitPercentage === 100) {
    return <div className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">{leftPane}</div>;
  }
  if (splitPercentage === 0) {
    return <div className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">{rightPane}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col md:flex-row overflow-hidden relative"
    >
      {/* Left Pane (Document Canvas) */}
      <div
        style={{ width: `${splitPercentage}%` }}
        className="h-full hidden md:block overflow-hidden transition-[width] duration-75"
      >
        {leftPane}
      </div>

      {/* Draggable Divider Separator */}
      <div
        onMouseDown={handleMouseDown}
        className="hidden md:flex w-2.5 h-full items-center justify-center cursor-col-resize hover:bg-[var(--surface-sunken)] active:bg-[var(--border-strong)] transition-colors relative z-20 group"
      >
        <div className="w-0.5 h-12 rounded-full bg-[var(--border-strong)] group-hover:bg-[var(--text-primary)] transition-colors" />
      </div>

      {/* Right Pane (6-Tool Reasoning Suite) */}
      <div
        style={{ width: `${100 - splitPercentage}%` }}
        className="h-full hidden md:block overflow-hidden transition-[width] duration-75"
      >
        {rightPane}
      </div>

      {/* Mobile Fallback: Full-width stacked */}
      <div className="block md:hidden flex-1 h-full overflow-hidden">
        {rightPane}
      </div>
    </div>
  );
};
