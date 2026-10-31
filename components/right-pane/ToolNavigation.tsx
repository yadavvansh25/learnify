'use client';

import React from 'react';
import {
  Sliders,
  GitFork,
  Mic,
  CheckCircle2,
  Layers,
  HelpCircle
} from 'lucide-react';

interface ToolNavigationProps {
  activeTab: number;
  onSelectTab: (tab: number) => void;
  flashcardDueCount?: number;
  highFrictionNodeCount?: number;
}

export const ToolNavigation: React.FC<ToolNavigationProps> = ({
  activeTab,
  onSelectTab,
  flashcardDueCount = 3,
  highFrictionNodeCount = 2
}) => {
  const TOOLS = [
    {
      id: 0,
      label: 'Visualizer',
      shortLabel: 'Viz',
      icon: Sliders,
      shortcut: '1'
    },
    {
      id: 1,
      label: 'Knowledge Graph',
      shortLabel: 'Graph',
      icon: GitFork,
      shortcut: '2',
      badge: highFrictionNodeCount > 0 ? `${highFrictionNodeCount} urgent` : undefined,
      badgeColor: 'bg-[var(--status-trap)] text-[var(--status-trap-text)] border-[#f5c6c6]'
    },
    {
      id: 2,
      label: 'Feynman Viva',
      shortLabel: 'Feynman',
      icon: Mic,
      shortcut: '3'
    },
    {
      id: 3,
      label: 'Socratic Auditor',
      shortLabel: 'Socratic',
      icon: CheckCircle2,
      shortcut: '4'
    },
    {
      id: 4,
      label: 'Flashcards',
      shortLabel: 'Cards',
      icon: Layers,
      shortcut: '5',
      badge: flashcardDueCount > 0 ? `${flashcardDueCount} due` : undefined,
      badgeColor: 'bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border-[#c4e3cb]'
    },
    {
      id: 5,
      label: 'PYQ Quizzes',
      shortLabel: 'Quiz',
      icon: HelpCircle,
      shortcut: '6'
    }
  ];

  return (
    <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-2 py-1.5 flex items-center gap-1 overflow-x-auto select-none">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTab === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => onSelectTab(tool.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded-sm transition-all shrink-0 cursor-pointer relative ${
              isActive
                ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] font-semibold shadow-xs border border-[var(--border-strong)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] border border-transparent'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tool.label}</span>
            <span className="inline sm:hidden">{tool.shortLabel}</span>

            {/* Keyboard shortcut hint */}
            <span className="font-mono text-[9px] px-1 py-0.2 rounded-xs bg-[var(--surface-sunken)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
              {tool.shortcut}
            </span>

            {/* Notification Badge */}
            {tool.badge && (
              <span
                className={`ml-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${tool.badgeColor}`}
              >
                {tool.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
