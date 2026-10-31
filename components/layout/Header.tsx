'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Columns,
  Maximize2,
  Smartphone,
  Moon,
  Sun,
  Database,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentSplit: number; // e.g. 50
  onSplitChange: (newSplit: number) => void;
  onOpenWhatsAppSimulator: () => void;
  onOpenDualCorpusModal: () => void;
  selectedCourse: string;
  onSelectCourse: (course: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSplit,
  onSplitChange,
  onOpenWhatsAppSimulator,
  onOpenDualCorpusModal,
  selectedCourse,
  onSelectCourse,
  darkMode,
  onToggleDarkMode
}) => {
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const COURSES = [
    { id: 'phys-101', name: 'Physics 101: Thermodynamics & Statistical Mechanics' },
    { id: 'math-201', name: 'Calculus III: Multivariable & Stokes Theorem' },
    { id: 'cs-301', name: 'CS 301: Distributed Consensus & Raft Protocols' }
  ];

  return (
    <header className="h-14 w-full border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-4 flex items-center justify-between select-none z-30 transition-colors">
      {/* Brand & Course Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] flex items-center justify-center font-mono font-bold text-sm shadow-xs">
            L
          </div>
          <span className="font-sans font-bold tracking-tight text-base text-[var(--text-primary)]">
            Learnify
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            v2.1 Spec
          </span>
        </div>

        <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

        {/* Course Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="max-w-[260px] truncate">{selectedCourse}</span>
            <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
          </button>

          {courseDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-72 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-md py-1 z-50">
              <div className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Select Active Curriculum
              </div>
              {COURSES.map(course => (
                <button
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course.name);
                    setCourseDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--surface-sunken)] transition-colors flex items-center justify-between ${
                    selectedCourse === course.name ? 'font-semibold text-[var(--text-primary)] bg-[var(--surface-sunken)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="truncate">{course.name}</span>
                  {selectedCourse === course.name && <span className="text-[10px] text-[var(--status-high-yield-text)]">Active</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exam Yield Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] text-[11px] font-medium border border-[#c5e4cc] dark:border-[#1d4025]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Exam-First Active (10-Yr PYQ)</span>
        </div>
      </div>

      {/* Center / Action Shortcuts: Dual Corpus & WhatsApp */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenDualCorpusModal}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:bg-[var(--surface-sunken)] text-[var(--text-primary)] transition-all cursor-pointer"
          title="Dual-Corpus Ingestion: Textbooks & 10-Yr Past Papers"
        >
          <Database className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span className="hidden sm:inline">Dual Corpus</span>
          <span className="font-mono text-[10px] px-1 bg-[var(--surface-sunken)] rounded-xs border border-[var(--border-subtle)] text-[var(--status-high-yield-text)] font-semibold">
            Indexed
          </span>
        </button>

        <button
          onClick={onOpenWhatsAppSimulator}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-[#a2d8b1] dark:border-[#1d4025] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] hover:opacity-90 transition-all cursor-pointer"
          title="WhatsApp Mobile Companion Agent (Meta Cloud API)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>WhatsApp Agent</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-high-yield-text)] animate-ping" />
        </button>
      </div>

      {/* Right Controls: Split Layout Presets & Dark Mode */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-0.5">
          <button
            onClick={() => onSplitChange(50)}
            className={`px-2 py-0.5 text-xs font-mono rounded-xs transition-colors cursor-pointer ${
              currentSplit === 50
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Split 50% / 50%"
          >
            50/50
          </button>
          <button
            onClick={() => onSplitChange(40)}
            className={`px-2 py-0.5 text-xs font-mono rounded-xs transition-colors cursor-pointer ${
              currentSplit === 40
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="40% Canvas / 60% Tools"
          >
            40/60
          </button>
          <button
            onClick={() => onSplitChange(60)}
            className={`px-2 py-0.5 text-xs font-mono rounded-xs transition-colors cursor-pointer ${
              currentSplit === 60
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="60% Canvas / 40% Tools"
          >
            60/40
          </button>
          <button
            onClick={() => onSplitChange(currentSplit === 100 ? 50 : 100)}
            className={`p-1 rounded-xs transition-colors cursor-pointer ${
              currentSplit === 100
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Zen Reader Mode (Full Canvas)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
          title={darkMode ? 'Switch to Light Ink' : 'Switch to Dark Ink'}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
