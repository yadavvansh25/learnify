'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Database,
  Moon,
  Sun,
  Layers,
  Sparkles,
  FileText,
  Clock
} from 'lucide-react';
import { globalStore } from '@/lib/store';
import { WhatsAppSimulatorModal } from '@/components/whatsapp/WhatsAppSimulatorModal';
import { DualCorpusModal } from '@/components/left-pane/DualCorpusModal';
import { MarkBadge } from '@/components/shared/MarkBadge';

export default function DocumentUploadHub() {
  const [documents, setDocuments] = useState(() => globalStore.getDocuments());
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isDualCorpusOpen, setIsDualCorpusOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Upload state
  const [uploadedTitle, setUploadedTitle] = useState('');
  const [uploadedSubject, setUploadedSubject] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  const handleCreateDocument = async () => {
    if (!uploadedTitle.trim()) return;
    setIsUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadedTitle,
          subject: uploadedSubject || 'Engineering Science',
          rawContent: `Chapter 1: Theory and Core Formulations for ${uploadedTitle}.\n\n$$E = mc^2$$\n\nPast Paper Reference: [5 Marks] Derive the governing relationship.`
        })
      });

      const data = await res.json();
      setDocuments(globalStore.getDocuments());
      setUploadMessage(`Document "${uploadedTitle}" successfully indexed!`);
      setUploadedTitle('');
      setUploadedSubject('');
    } catch {
      setUploadMessage('Upload simulation failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[var(--text-primary)] font-sans select-none">
      {/* Top Header */}
      <header className="h-14 w-full border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] flex items-center justify-center font-mono font-bold text-sm shadow-xs">
            L
          </div>
          <span className="font-bold tracking-tight text-base text-[var(--text-primary)]">
            Learnify
          </span>
          <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            v2.1 Spec
          </span>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] text-[11px] font-medium border border-[#c5e4cc] dark:border-[#1d4025]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Exam-First Agentic RAG</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDualCorpusOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:bg-[var(--surface-sunken)] transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="hidden sm:inline">Dual Corpus</span>
          </button>

          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border border-[#a2d8b1] bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>WhatsApp Agent</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Hub Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Hero Section */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Academic Research & Exam Workspace
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Upload your syllabus notes, textbooks, and past examination papers. Learnify cross-references both corpora with an inverted weightage algorithm to prioritize high-yield exam theorems.
          </p>
        </div>

        {/* Upload Dropzone Hub */}
        <div className="p-6 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-[var(--text-secondary)]" />
            <h2 className="font-bold text-sm text-[var(--text-primary)]">
              Ingest New Document (Corpus A / Corpus B)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--text-secondary)] mb-1">
                Document / Course Title:
              </label>
              <input
                type="text"
                value={uploadedTitle}
                onChange={(e) => setUploadedTitle(e.target.value)}
                placeholder="e.g., Quantum Mechanics & Dirac Notation"
                className="w-full p-2.5 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--text-secondary)] mb-1">
                Academic Discipline / Exam Board:
              </label>
              <input
                type="text"
                value={uploadedSubject}
                onChange={(e) => setUploadedSubject(e.target.value)}
                placeholder="e.g., Cambridge A-Level / MIT Physics"
                className="w-full p-2.5 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[var(--text-tertiary)] font-mono">
              Auto-extracts LaTeX math ($...$) and exam marks ([5 Marks])
            </span>
            <button
              onClick={handleCreateDocument}
              disabled={isUploading || !uploadedTitle.trim()}
              className="px-4 py-2 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shadow-xs"
            >
              {isUploading ? 'Indexing...' : 'Index & Generate Reasoning Suite'}
            </button>
          </div>

          {uploadMessage && (
            <div className="p-3 rounded-xs bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border border-[#c4e3cb] text-xs font-medium">
              {uploadMessage}
            </div>
          )}
        </div>

        {/* Preloaded Curricula / Recent Documents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="font-bold text-sm text-[var(--text-primary)]">
                Active & Recent Curricula Workspaces
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--text-tertiary)]">
              {documents.length} Workspaces Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between space-y-4 shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-[var(--text-tertiary)] uppercase">
                      {doc.subject}
                    </span>
                    <MarkBadge variant="high_yield" text={`${doc.examYieldPercentage}% Exam Yield`} />
                  </div>

                  <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:underline">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {doc.pageCount} Pages • {doc.chapters.length} Chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Indexed
                    </span>
                  </div>

                  <Link
                    href={`/viewer/${doc.id}`}
                    className="w-full py-2.5 px-4 rounded-sm bg-[var(--surface-canvas)] hover:bg-[var(--text-primary)] hover:text-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-strong)] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Launch Split-Screen Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* WhatsApp Modal */}
      <WhatsAppSimulatorModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Dual Corpus Ingestion Modal */}
      <DualCorpusModal
        isOpen={isDualCorpusOpen}
        onClose={() => setIsDualCorpusOpen(false)}
        onCorpusUpdated={() => setDocuments(globalStore.getDocuments())}
      />
    </div>
  );
}
