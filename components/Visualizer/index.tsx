'use client';

import React, { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import { ThreeDView } from './ThreeDView';
import { TwoDAnimView } from './TwoDAnimView';
import { FormulaView } from './FormulaView';
import { GraphView } from './GraphView';
import { TwoDTextView } from './TwoDTextView';
import { VizSpec } from '@/lib/schemas-viz';
import { getSubjectCurriculum, Visualizer3DType } from '@/lib/subjects-data';

export type VisualizerSubMode = '2d-anim' | '3d' | 'formula' | 'graph' | '2d-text';

interface VisualizerOrchestratorProps {
  initialMode?: VisualizerSubMode;
  docId?: string;
  activeTabId?: string;
  active3DModel?: Visualizer3DType;
  spec?: VizSpec;
  onSwitchMode?: (specId: string) => void;
}

export const VisualizerOrchestrator: React.FC<VisualizerOrchestratorProps> = ({
  initialMode = '2d-anim',
  docId = 'doc-thermo-101',
  activeTabId,
  active3DModel,
  spec
}) => {
  const curriculum = getSubjectCurriculum(docId, (spec as any)?.parameters?.subject);
  const defaultTab = curriculum.visualizerTabs[0];

  const [selectedTabId, setSelectedTabId] = useState<string>(
    activeTabId || defaultTab?.id || 'tab-1'
  );
  const [mode, setMode] = useState<VisualizerSubMode>(
    defaultTab?.mode || initialMode
  );
  const [current3DModel, setCurrent3DModel] = useState<Visualizer3DType>(
    active3DModel ||
    defaultTab?.default3DType ||
    (spec as any)?.parameters?.default3DType ||
    curriculum.allowedModels[0]?.type ||
    'pendulum'
  );

  // Reset active tab and 3D model whenever docId changes
  useEffect(() => {
    const curTab = curriculum.visualizerTabs[0];
    setSelectedTabId(activeTabId || curTab?.id || 'tab-1');
    setMode(curTab?.mode || '3d');
    setCurrent3DModel(
      active3DModel ||
      curTab?.default3DType ||
      curriculum.allowedModels[0]?.type ||
      'pendulum'
    );
  }, [docId]);

  // Sync when activeTabId prop changes from left pane chip clicks
  useEffect(() => {
    if (activeTabId) {
      setSelectedTabId(activeTabId);
      const matchedTab = curriculum.visualizerTabs.find(t => t.id === activeTabId);
      if (matchedTab) {
        setMode(matchedTab.mode);
        if (matchedTab.default3DType) {
          setCurrent3DModel(matchedTab.default3DType);
        }
      }
    }
  }, [activeTabId, curriculum]);

  // Sync when active3DModel prop changes
  useEffect(() => {
    if (active3DModel) {
      setCurrent3DModel(active3DModel);
      setMode('3d');
      const tab3d = curriculum.visualizerTabs.find(t => t.mode === '3d');
      if (tab3d) {
        setSelectedTabId(tab3d.id);
      }
    }
  }, [active3DModel, curriculum]);

  // Sync mode if incoming spec specifies a mode
  useEffect(() => {
    if (spec?.mode) {
      if (spec.mode === 'source-citation') setMode('2d-text');
      else setMode(spec.mode as VisualizerSubMode);
    }
  }, [spec]);

  const activeTabConfig = curriculum.visualizerTabs.find(t => t.id === selectedTabId) || defaultTab;

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto">
      {/* Visualizer Mode Header Strip (Strictly Subject Scoped) */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
            {curriculum.title.split(':')[1]?.trim() || curriculum.title}
          </span>
          <div className="px-1.5 py-0.5 rounded-xs text-[10px] font-mono tracking-wider uppercase font-semibold bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            {curriculum.subject} • {curriculum.category}
          </div>
        </div>

        {/* Clean Segmented Tab Bar strictly matching the active topic */}
        <div className="flex items-center gap-1.5 p-0.5 rounded-sm bg-[var(--surface-sunken)] border border-[var(--border-subtle)] flex-wrap">
          {curriculum.visualizerTabs.map((tab) => {
            const isTabActive = selectedTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTabId(tab.id);
                  setMode(tab.mode);
                  if (tab.default3DType) {
                    setCurrent3DModel(tab.default3DType);
                  }
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold shadow-xs'
                    : 'bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 min-h-0">
        {mode === '2d-anim' && (
          <TwoDAnimView
            initialType={activeTabConfig?.subType === 'reaction' ? 'reaction' : 'carnot'}
          />
        )}
        {mode === '3d' && (
          <ThreeDView
            initialType={current3DModel}
            title={activeTabConfig?.label || spec?.title}
            category={curriculum.category}
            allowedModels={curriculum.allowedModels}
            onSelectModel={(m) => setCurrent3DModel(m)}
          />
        )}
        {mode === 'formula' && <FormulaView steps={spec?.data?.steps} />}
        {mode === 'graph' && (
          <GraphView
            initialQuestion={spec?.data?.question || curriculum.title}
            docId={docId}
            subject={curriculum.subject}
          />
        )}
        {mode === '2d-text' && <TwoDTextView />}
      </div>
    </div>
  );
};

export const VisualizerContainer = VisualizerOrchestrator;
export default VisualizerOrchestrator;
