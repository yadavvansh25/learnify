'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SplitWorkspace } from '@/components/layout/SplitWorkspace';
import { DocumentCanvas } from '@/components/left-pane/DocumentCanvas';
import { DualCorpusModal } from '@/components/left-pane/DualCorpusModal';
import { ToolNavigation } from '@/components/right-pane/ToolNavigation';
import { VisualizerView } from '@/components/right-pane/VisualizerView';
import { KnowledgeGraphView } from '@/components/right-pane/KnowledgeGraphView';
import { FeynmanEvaluator } from '@/components/right-pane/FeynmanEvaluator';
import { SocraticDebugger } from '@/components/right-pane/SocraticDebugger';
import { FlashcardDeck } from '@/components/right-pane/FlashcardDeck';
import { PyqQuizView } from '@/components/right-pane/PyqQuizView';
import { WhatsAppSimulatorModal } from '@/components/whatsapp/WhatsAppSimulatorModal';
import { globalDualCorpusEngine } from '@/lib/rag/dual-corpus-engine';

export default function Home() {
  const [splitPercentage, setSplitPercentage] = useState<number>(48);
  const [activeToolTab, setActiveToolTab] = useState<number>(0);
  const [activeDocId, setActiveDocId] = useState<string>('doc-a-thermo-02');
  const [selectedCourse, setSelectedCourse] = useState<string>('Physics 101: Thermodynamics & Statistical Mechanics');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isDualCorpusModalOpen, setIsDualCorpusModalOpen] = useState<boolean>(false);
  const [toolContext, setToolContext] = useState<any>(null);

  // Load documents from engine
  const [corpusADocs, setCorpusADocs] = useState(() => globalDualCorpusEngine.getCorpusADocs());
  const [corpusBDocs, setCorpusBDocs] = useState(() => globalDualCorpusEngine.getCorpusBDocs());

  // Dark mode toggler
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Keyboard shortcut listener for tools 1-6
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= '1' && e.key <= '6') {
        const toolIdx = parseInt(e.key, 10) - 1;
        setActiveToolTab(toolIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Jump from left pane to right pane tool with context
  const handleJumpToTool = (toolIndex: number, contextData?: any) => {
    setActiveToolTab(toolIndex);
    if (contextData) {
      setToolContext(contextData);
    }
  };

  const handleCorpusUpdated = () => {
    setCorpusADocs([...globalDualCorpusEngine.getCorpusADocs()]);
    setCorpusBDocs([...globalDualCorpusEngine.getCorpusBDocs()]);
  };

  // Render Left Pane
  const leftPaneContent = (
    <DocumentCanvas
      documents={corpusADocs}
      pyqDocuments={corpusBDocs}
      activeDocId={activeDocId}
      onSelectDoc={setActiveDocId}
      onJumpToTool={handleJumpToTool}
    />
  );

  // Render Right Pane with the 6 Interactive Tools
  const rightPaneContent = (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-hidden">
      {/* 6-Tool Navigation Bar */}
      <ToolNavigation
        activeTab={activeToolTab}
        onSelectTab={setActiveToolTab}
      />

      {/* Active Tool View */}
      <div className="flex-1 overflow-hidden relative">
        {activeToolTab === 0 && <VisualizerView />}
        {activeToolTab === 1 && (
          <KnowledgeGraphView
            onJumpToTool={handleJumpToTool}
            onLocateInTextbook={(conceptId) => setActiveDocId('doc-a-thermo-02')}
          />
        )}
        {activeToolTab === 2 && (
          <FeynmanEvaluator initialTopic={toolContext?.topic || 'Carnot Engine & Efficiency'} />
        )}
        {activeToolTab === 3 && (
          <SocraticDebugger initialProblem={toolContext?.pyq?.questionText} />
        )}
        {activeToolTab === 4 && (
          <FlashcardDeck filterConceptId={toolContext?.conceptId} />
        )}
        {activeToolTab === 5 && (
          <PyqQuizView initialQuestionId={toolContext?.pyq?.id} />
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[var(--text-primary)] antialiased select-none">
      {/* Top Header Bar */}
      <Header
        currentSplit={splitPercentage}
        onSplitChange={setSplitPercentage}
        onOpenWhatsAppSimulator={() => setIsWhatsAppModalOpen(true)}
        onOpenDualCorpusModal={() => setIsDualCorpusModalOpen(true)}
        selectedCourse={selectedCourse}
        onSelectCourse={setSelectedCourse}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Split-Screen Workspace */}
      <SplitWorkspace
        leftPane={leftPaneContent}
        rightPane={rightPaneContent}
        splitPercentage={splitPercentage}
        onSplitChange={setSplitPercentage}
      />

      {/* In-App WhatsApp Mobile Companion Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Dual Corpus Ingestion & Stats Modal */}
      <DualCorpusModal
        isOpen={isDualCorpusModalOpen}
        onClose={() => setIsDualCorpusModalOpen(false)}
        onCorpusUpdated={handleCorpusUpdated}
      />
    </main>
  );
}
