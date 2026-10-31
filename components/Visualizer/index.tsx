'use client';

import React, { useState } from 'react';
import { Sliders, Box, Activity, LineChart, FileCode } from 'lucide-react';
import { ThreeDView } from './ThreeDView';
import { TwoDAnimView } from './TwoDAnimView';
import { FormulaView } from './FormulaView';
import { GraphView } from './GraphView';
import { MarkBadge } from '../shared/MarkBadge';

import { TwoDTextView } from './TwoDTextView';
import { VizSpec } from '@/lib/schemas-viz';

export type VisualizerSubMode = '2d-anim' | '3d' | 'formula' | 'graph' | '2d-text';

interface VisualizerOrchestratorProps {
  initialMode?: VisualizerSubMode;
  spec?: VizSpec;
  onSwitchMode?: (specId: string) => void;
}

export const VisualizerOrchestrator: React.FC<VisualizerOrchestratorProps> = ({
  initialMode = '2d-anim',
  spec
}) => {
  const [mode, setMode] = useState<VisualizerSubMode>(initialMode);

  // Sync mode if incoming spec specifies a mode
  React.useEffect(() => {
    if (spec?.mode) {
      if (spec.mode === 'source-citation') setMode('2d-text');
      else setMode(spec.mode as VisualizerSubMode);
    }
  }, [spec]);

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto">
      {/* Visualizer Mode Header Strip */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
            {spec?.title || 'Visualizer Suite'}
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
            2D Cycle
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
          <button
            onClick={() => setMode('2d-text')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              mode === '2d-text' ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Tree/Citation
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 min-h-0">
        {mode === '2d-anim' && <TwoDAnimView />}
        {mode === '3d' && (
          <ThreeDView
            initialType={(spec as any)?.parameters?.default3DType || (spec as any)?.data?.default3DType}
            title={spec?.title}
          />
        )}
        {mode === 'formula' && <FormulaView steps={spec?.data?.steps} />}
        {mode === 'graph' && <GraphView />}
        {mode === '2d-text' && <TwoDTextView />}
      </div>
    </div>
  );
};

export const VisualizerContainer = VisualizerOrchestrator;
export default VisualizerOrchestrator;
