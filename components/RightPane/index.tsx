'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sigma,
  Network,
  Lightbulb,
  MessageSquare,
  Layers,
  ListChecks,
  Gauge,
  ChevronDown
} from 'lucide-react';
import { VisualizerOrchestrator } from '../Visualizer';
import { KnowledgeGraphView } from './KnowledgeGraphView';
import { FeynmanView } from './FeynmanView';
import { ChatView } from './ChatView';
import { FlashcardsView } from './FlashcardsView';
import { QuizzesView } from './QuizzesView';
import { FourAxisMastery } from '../Evaluator/FourAxisMastery';

import { SUBJECT_TOPICS } from '@/lib/subjects-data';

export type RightPaneTool = 'visualizer' | 'kg' | 'feynman' | 'chat' | 'flashcards' | 'quizzes' | 'evaluator';

interface RightPaneShellProps {
  docId?: string;
  initialTool?: RightPaneTool;
  activeConcept?: string;
}

export const RightPaneShell: React.FC<RightPaneShellProps> = ({
  docId = 'doc-thermo-101',
  initialTool = 'visualizer',
  activeConcept
}) => {
  const [activeTool, setActiveTool] = useState<RightPaneTool>(initialTool);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const matchedTopic = SUBJECT_TOPICS.find(t => t.docId === docId || t.id === docId);

  // Sync tool if initialTool changes
  React.useEffect(() => {
    if (initialTool) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);

  const TOOLS = [
    { id: 'visualizer', label: 'Visualizer', icon: Sigma, description: '3D/2D Mechanics & Derivations' },
    { id: 'kg', label: 'Knowledge Graph', icon: Network, description: 'Concept Mastery & Prerequisites' },
    { id: 'feynman', label: 'Feynman Explainer', icon: Lightbulb, description: '4-Turn Oral Viva with VoiceBlob' },
    { id: 'chat', label: 'Socratic Doubt Solver', icon: MessageSquare, description: 'Procedural Troubleshooting' },
    { id: 'flashcards', label: 'Flashcard Decks', icon: Layers, description: 'SuperMemo SM-2 Recall' },
    { id: 'quizzes', label: 'PYQ Drills', icon: ListChecks, description: 'Timed Past Examination Papers' },
    { id: 'evaluator', label: 'Mastery Evaluator', icon: Gauge, description: '4-Axis Cognitive Mastery Grid' }
  ];

  const currentToolConfig = TOOLS.find(t => t.id === activeTool) || TOOLS[0];
  const CurrentIcon = currentToolConfig.icon;

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-hidden font-sans">
      {/* Persistent Header with Dropdown Switcher */}
      <div className="h-12 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-3 flex items-center justify-between z-20">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer shadow-xs"
          >
            <CurrentIcon className="w-3.5 h-3.5 text-[var(--text-primary)]" />
            <span>{currentToolConfig.label}</span>
            <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-md py-1 z-50">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-[var(--text-tertiary)]">
                Select Right Pane Tool
              </div>
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id as RightPaneTool);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-[var(--surface-sunken)] transition-colors ${
                      activeTool === tool.id ? 'bg-[var(--surface-sunken)] font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="leading-tight">{tool.label}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">{tool.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick icon shortcuts */}
        <div className="flex items-center gap-1">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as RightPaneTool)}
                title={tool.label}
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[var(--text-primary)] text-[var(--surface-raised)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated View Transition */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full"
          >
            {activeTool === 'visualizer' && (
              <VisualizerOrchestrator
                initialMode="3d"
                spec={matchedTopic ? ({
                  id: matchedTopic.id,
                  mode: '3d',
                  title: matchedTopic.title,
                  subtitle: `${matchedTopic.subject} · ${matchedTopic.category}`,
                  tagTrigger: matchedTopic.tags[0] || 'Concept',
                  data: {},
                  parameters: {
                    default3DType: matchedTopic.default3DType,
                    subject: matchedTopic.subject
                  }
                } as any) : undefined}
              />
            )}
            {activeTool === 'kg' && <KnowledgeGraphView docId={docId} />}
            {activeTool === 'feynman' && <FeynmanView docId={docId} />}
            {activeTool === 'chat' && <ChatView docId={docId} />}
            {activeTool === 'flashcards' && <FlashcardsView docId={docId} />}
            {activeTool === 'quizzes' && <QuizzesView docId={docId} />}
            {activeTool === 'evaluator' && (
              <div className="p-6 h-full overflow-y-auto bg-[var(--surface-raised)]">
                <div className="mb-4">
                  <h3 className="text-xs font-mono font-semibold uppercase text-[var(--text-primary)]">
                    MASTERY EVALUATION · 4 COGNITIVE AXES
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Real-time non-decreasing comprehension score across memory, explanation, structure, and applications.
                  </p>
                </div>
                <FourAxisMastery />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RightPaneShell;
