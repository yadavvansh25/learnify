'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  HelpCircle,
  Code2,
  Atom,
  Binary,
  Compass,
  Dna,
  Filter
} from 'lucide-react';
import { globalStore } from '@/lib/store';
import { WhatsAppSimulatorModal } from '@/components/whatsapp/WhatsAppSimulatorModal';
import { DualCorpusModal } from '@/components/left-pane/DualCorpusModal';
import { MarkBadge } from '@/components/shared/MarkBadge';
import {
  SUBJECT_TOPICS,
  SubjectCategory,
  SUBJECT_COLORS,
  TopicItem
} from '@/lib/subjects-data';

export default function DocumentUploadHub() {
  const [documents, setDocuments] = useState(() => globalStore.getDocuments());
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | SubjectCategory>('ALL');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isDualCorpusOpen, setIsDualCorpusOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Upload form state
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

      await res.json();
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

  const SUBJECT_FILTERS: Array<{ id: 'ALL' | SubjectCategory; label: string; icon: any }> = [
    { id: 'ALL', label: 'All Curricula', icon: Filter },
    { id: 'CODING', label: 'Coding / CS', icon: Code2 },
    { id: 'MATH', label: 'Mathematics', icon: Binary },
    { id: 'PHYSICS', label: 'Physics', icon: Compass },
    { id: 'CHEMISTRY', label: 'Chemistry', icon: Atom },
    { id: 'BIOLOGY', label: 'Biology', icon: Dna },
  ];

  const filteredTopics = SUBJECT_TOPICS.filter((t) => {
    if (selectedSubject === 'ALL') return true;
    return t.subject === selectedSubject;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[var(--text-primary)] font-sans select-none">
      {/* Top Header */}
      <header className="h-14 w-full border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] flex items-center justify-center font-mono font-bold text-sm shadow-xs">
            L
          </div>
          <span className="font-bold tracking-tight text-base text-[var(--text-primary)]">
            Learnify
          </span>
          <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            v2.2 Multi-Subject
          </span>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] text-[11px] font-medium border border-[#c5e4cc] dark:border-[#1d4025]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dual-Corpus Reasoner</span>
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Hero Section */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Autonomous Academic Workspace & Reasoning Suite
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Select from high-yield STEM curricula or upload your custom course notes and 10-year past papers. Learnify activates an interactive 3D WebGL visualizer, concept dependency graph, oral viva evaluator, and WhatsApp study agent.
          </p>
        </div>

        {/* Upload Dropzone Hub */}
        <div className="p-6 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="font-bold text-sm text-[var(--text-primary)]">
                Ingest Custom Document (Dual-Corpus A/B Extractor)
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
              PDF / Markdown / Notes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={uploadedTitle}
              onChange={(e) => setUploadedTitle(e.target.value)}
              placeholder="Document Title (e.g., Organic Reaction Mechanisms)..."
              className="px-3 py-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] font-sans"
            />
            <input
              type="text"
              value={uploadedSubject}
              onChange={(e) => setUploadedSubject(e.target.value)}
              placeholder="Subject (CHEMISTRY, CODING, MATH, PHYSICS, BIOLOGY)..."
              className="px-3 py-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[var(--text-tertiary)] font-mono">
              Auto-extracts LaTeX math ($...$) and exam marking rubrics ([5 Marks])
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

        {/* Multi-Subject Filter & Category Cards */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="font-bold text-base text-[var(--text-primary)]">
                Active & Recent Curricula Workspaces
              </h2>
            </div>

            {/* Horizontal Subject Pill Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap bg-[var(--surface-raised)] p-1 rounded-sm border border-[var(--border-subtle)] font-mono text-xs">
              {SUBJECT_FILTERS.map((f) => {
                const Icon = f.icon;
                const isSelected = selectedSubject === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedSubject(f.id)}
                    className={`px-3 py-1 rounded-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Topics Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSubject}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {filteredTopics.map((topic) => {
                const colors = SUBJECT_COLORS[topic.subject];
                return (
                  <div
                    key={topic.id}
                    className="p-5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between space-y-4 shadow-xs group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider border ${colors.badge} ${colors.text} ${colors.border}`}
                        >
                          {topic.subject} • {topic.category}
                        </span>
                        <MarkBadge variant="high_yield" text={topic.examYield} />
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:underline">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                        {topic.description}
                      </p>

                      {/* Tag Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {topic.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Sample Exam Question Box */}
                      <div className="mt-4 p-3 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[var(--text-tertiary)] uppercase">
                          <HelpCircle className="w-3 h-3 text-[var(--text-secondary)]" />
                          <span>Past Exam Focus Question:</span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] italic leading-relaxed">
                          &#34;{topic.sampleQuestion}&#34;
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata & Launch CTA */}
                    <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {topic.pages} Pages • {topic.chapters} Chapters
                        </span>
                        <span className="font-bold text-[var(--text-secondary)]">
                          3D: {topic.default3DType.toUpperCase()}
                        </span>
                      </div>

                      <Link
                        href={`/viewer/${topic.docId}`}
                        className="w-full py-2.5 px-4 rounded-sm bg-[var(--surface-canvas)] hover:bg-[var(--text-primary)] hover:text-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-strong)] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        <span>Launch 3D Visualizer & Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
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
