'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  AlertTriangle,
  BookOpen,
  FileText,
  RotateCcw
} from 'lucide-react';
import { MarkBadge } from '../shared/MarkBadge';

interface ChatViewProps {
  docId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ docId = 'doc-thermo-101' }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; citation?: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am your Socratic AI Tutor. I will guide you through first principles and verify your steps against past examination marking schemes without dumping final solutions.\n\nType your rough math steps, or ask for a hint on any derivation.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chat/${docId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || data.socraticHint || 'Review your step carefully.',
          citation: data.citation
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Notice that in the Carnot formula eta = 1 - (T_C / T_H), temperatures must strictly be converted to absolute Kelvin (T_K = T_C + 273.15). What value do you get when converting 280 °C and 25 °C?',
          citation: 'Cambridge Paper 42 [5 Marks]'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-hidden font-sans">
      {/* Top Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            Socratic Doubt Solver
          </span>
          <MarkBadge variant="high_yield" text="Procedural Troubleshooting" />
        </div>

        <button
          onClick={() => setMessages([{
            role: 'assistant',
            text: 'Doubt solver reset. Share your next calculation step.'
          }])}
          className="p-1 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Preset Chips */}
      <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        <span className="text-[var(--text-tertiary)] shrink-0">Prompts:</span>
        <button
          onClick={() => handleSend('/cram Carnot Engine')}
          className="px-2 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] shrink-0 cursor-pointer"
        >
          /cram Carnot
        </button>
        <button
          onClick={() => handleSend('Isothermal work done: Step 1: W = P*(V2 - V1)')}
          className="px-2 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] shrink-0 cursor-pointer"
        >
          Audit Isothermal Step
        </button>
        <button
          onClick={() => handleSend('Carnot: eta = 1 - (25 / 280) = 91.1%')}
          className="px-2 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] shrink-0 cursor-pointer"
        >
          Audit Celsius Step
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-sm text-xs leading-relaxed ${
              m.role === 'user'
                ? 'bg-[var(--surface-sunken)] border border-[var(--border-subtle)] ml-6 text-[var(--text-primary)]'
                : 'bg-[var(--surface-raised)] border border-[var(--border-subtle)] mr-6 text-[var(--text-primary)] shadow-xs'
            }`}
          >
            <div className="font-mono text-[10px] uppercase font-bold text-[var(--text-tertiary)] mb-1">
              {m.role === 'user' ? 'Candidate' : 'Socratic Tutor'}
            </div>
            <div className="whitespace-pre-wrap">{m.text}</div>

            {m.citation && (
              <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center gap-1.5 font-mono text-[11px] text-[var(--status-high-yield-text)]">
                <FileText className="w-3.5 h-3.5" />
                <span>Mark Scheme: {m.citation}</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 text-xs font-mono text-[var(--text-secondary)] italic">
            Auditing mathematical reasoning...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="State your calculation step or question..."
            className="flex-1 px-3 py-2 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-3.5 py-2 rounded-sm bg-[var(--text-primary)] text-[var(--surface-raised)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
