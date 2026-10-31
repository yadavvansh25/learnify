'use client';

import React, { useState } from 'react';
import { Sliders, Box, Activity, LineChart, FileCode } from 'lucide-react';
import { ThreeDView } from './ThreeDView';
import { TwoDAnimView } from './TwoDAnimView';
import { FormulaView } from './FormulaView';
import { GraphView } from './GraphView';
import { MarkBadge } from '../shared/MarkBadge';

type VisualizerSubMode = '2d-anim' | '3d' | 'formula' | 'graph' | '2d-text';

export const VisualizerOrchestrator: React.FC = () => {
  const [mode, setMode] = useState<VisualizerSubMode>('2d-anim');

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto">
      {/* Visualizer Mode Header Strip */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
            Visualizer Suite
          </span>
          <MarkBadge variant="mono" text="5 Modes" />
        </div>

        {/* Sub-mode buttons */}
        <div className="flex items-center gap-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-0.5 rounded-sm">
          <button
            onClick={() => setMode('2d-anim')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              mode === '2d-anim' ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            2D Carnot
          </button>
          <button
            onClick={() => setMode('3d')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              mode === '3d' ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            3D WebGL
          </button>
          <button
            onClick={() => setMode('formula')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              mode === 'formula' ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Formula
          </button>
          <button
            onClick={() => setMode('graph')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              mode === 'graph' ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Graph
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1">
        {mode === '2d-anim' && <TwoDAnimView />}
        {mode === '3d' && <ThreeDView />}
        {mode === 'formula' && <FormulaView />}
        {mode === 'graph' && <GraphView />}
      </div>
    </div>
  );
};

export default VisualizerOrchestrator;
