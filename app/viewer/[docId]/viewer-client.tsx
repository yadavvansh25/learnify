'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Smartphone,
  Database,
  Moon,
  Sun,
  Maximize2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { PdfViewer } from '@/components/PdfViewer';
import { RightPaneShell, RightPaneTool } from '@/components/RightPane';
import { WhatsAppSimulatorModal } from '@/components/whatsapp/WhatsAppSimulatorModal';
import { DualCorpusModal } from '@/components/left-pane/DualCorpusModal';
import { DocumentMetadata } from '@/lib/schemas';
import { globalStore } from '@/lib/store';

interface ViewerClientProps {
  docId: string;
  initialDoc: DocumentMetadata;
}

export const ViewerClient: React.FC<ViewerClientProps> = ({ docId, initialDoc }) => {
  const [doc, setDoc] = useState<DocumentMetadata>(initialDoc);
  const [splitPercent, setSplitPercent] = useState<number>(48);
  const [activeRightTool, setActiveRightTool] = useState<RightPaneTool>('visualizer');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isDualCorpusOpen, setIsDualCorpusOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  const allDocs = globalStore.getDocuments();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[var(--text-primary)] antialiased select-none font-sans">
      {/* Top Header */}
      <header className="h-14 w-full border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hub</span>
          </Link>

          <div className="h-4 w-px bg-[var(--border-subtle)]" />

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-xs bg-[var(--text-primary)] text-[var(--surface-raised)] flex items-center justify-center font-mono font-bold text-xs">
              L
            </div>
            <span className="font-bold text-sm text-[var(--text-primary)] hidden md:inline">
              Learnify
            </span>
          </div>

          <div className="h-4 w-px bg-[var(--border-subtle)]" />

          {/* Active Course Title */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] max-w-xs sm:max-w-md truncate">
            <BookOpen className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
            <span className="truncate">{doc.title}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] text-[11px] font-medium border border-[#c5e4cc] dark:border-[#1d4025]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Exam-First Priority</span>
          </div>
        </div>

        {/* Center / Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDualCorpusOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:bg-[var(--surface-sunken)] transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="hidden sm:inline">Dual Corpus</span>
          </button>

          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-[#a2d8b1] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>WhatsApp Agent</span>
          </button>
        </div>

        {/* Right Controls: Split Layout & Dark Mode */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-0.5 font-mono text-xs">
            <button
              onClick={() => setSplitPercent(50)}
              className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                splitPercent === 50 ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              50/50
            </button>
            <button
              onClick={() => setSplitPercent(40)}
              className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                splitPercent === 40 ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              40/60
            </button>
            <button
              onClick={() => setSplitPercent(60)}
              className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                splitPercent === 60 ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              60/40
            </button>
            <button
              onClick={() => setSplitPercent(splitPercent === 100 ? 48 : 100)}
              className={`p-1 rounded-xs cursor-pointer ${
                splitPercent === 100 ? 'bg-[var(--text-primary)] text-[var(--surface-raised)]' : 'text-[var(--text-secondary)]'
              }`}
              title="Full Canvas Reader Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col md:flex-row overflow-hidden relative">
        {/* Left: PDF Document Viewer */}
        <div
          style={{ width: `${splitPercent}%` }}
          className="h-full hidden md:block overflow-hidden transition-[width] duration-75"
        >
          <PdfViewer
            docId={docId}
            title={doc.title}
            pageCount={doc.pageCount}
            onOpenVisualizerForFormula={(formula) => setActiveRightTool('visualizer')}
          />
        </div>

        {/* Split Separator */}
        <div className="hidden md:flex w-2.5 h-full items-center justify-center cursor-col-resize hover:bg-[var(--surface-sunken)] relative z-20 group">
          <div className="w-0.5 h-12 rounded-full bg-[var(--border-strong)] group-hover:bg-[var(--text-primary)] transition-colors" />
        </div>

        {/* Right: Multi-Tool Right Pane Suite */}
        <div
          style={{ width: `${100 - splitPercent}%` }}
          className="h-full hidden md:block overflow-hidden transition-[width] duration-75"
        >
          <RightPaneShell
            docId={docId}
            initialTool={activeRightTool}
          />
        </div>

        {/* Mobile View */}
        <div className="block md:hidden flex-1 h-full overflow-hidden">
          <RightPaneShell docId={docId} initialTool={activeRightTool} />
        </div>
      </div>

      {/* WhatsApp Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Dual Corpus Modal */}
      <DualCorpusModal
        isOpen={isDualCorpusOpen}
        onClose={() => setIsDualCorpusOpen(false)}
        onCorpusUpdated={() => {
          const updated = globalStore.getDocument(docId);
          if (updated) setDoc(updated);
        }}
      />
    </div>
  );
};
