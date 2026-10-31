'use client';

import React, { useState, useMemo } from 'react';
import {
  GitFork,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { KnowledgeGraphNode, KnowledgeGraphEdge, MasteryLevel } from '@/lib/rag/types';
import { globalKgRunner } from '@/lib/rag/kg-runner';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';

interface KnowledgeGraphViewProps {
  onJumpToTool?: (toolIndex: number, contextData?: any) => void;
  onLocateInTextbook?: (conceptId: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  onJumpToTool,
  onLocateInTextbook
}) => {
  const [graphData, setGraphData] = useState(() => globalKgRunner.getGraphData());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-carnot-cycle');
  const [masteryFilter, setMasteryFilter] = useState<string>('all');

  const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId) || graphData.nodes[0];

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter(node => {
      const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            node.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMastery = masteryFilter === 'all' || node.mastery === masteryFilter;
      return matchesSearch && matchesMastery;
    });
  }, [graphData.nodes, searchQuery, masteryFilter]);

  // Handle student changing mastery status
  const handleUpdateMastery = (newMastery: MasteryLevel) => {
    if (!selectedNode) return;
    globalKgRunner.updateNodeMastery(selectedNode.id, newMastery);
    setGraphData(globalKgRunner.getGraphData());
  };

  // Node position map for clean SVG rendering layout
  const nodeCoordinates: Record<string, { x: number; y: number }> = {
    'node-first-law': { x: 80, y: 150 },
    'node-isothermal-work': { x: 220, y: 90 },
    'node-adiabatic-expansion': { x: 220, y: 220 },
    'node-carnot-cycle': { x: 380, y: 150 },
    'node-entropy-second-law': { x: 530, y: 90 },
    'node-refrigerators-cop': { x: 530, y: 220 }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-hidden font-sans">
      {/* Top Controls: Search, Mastery Filter & High Friction Counter */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            Concept Dependency Graph
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            {graphData.nodes.length} Nodes
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-36 sm:w-44">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find node..."
              className="w-full pl-6 pr-2 py-1 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* Mastery Pills */}
          <div className="flex items-center gap-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-0.5 rounded-sm text-[11px] font-mono">
            <button
              onClick={() => setMasteryFilter('all')}
              className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                masteryFilter === 'all'
                  ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMasteryFilter('high_friction')}
              className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                masteryFilter === 'high_friction'
                  ? 'bg-[var(--status-trap)] text-[var(--status-trap-text)] font-bold'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Friction
            </button>
            <button
              onClick={() => setMasteryFilter('mastered')}
              className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                masteryFilter === 'mastered'
                  ? 'bg-[var(--status-mastered)] text-[var(--status-mastered-text)] font-bold'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Mastered
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Dependency Graph Canvas */}
      <div className="flex-1 min-h-[220px] bg-[var(--surface-canvas)] relative border-b border-[var(--border-subtle)] overflow-hidden">
        {/* Subtle graph grid pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }} />

        <svg viewBox="0 0 620 310" className="w-full h-full">
          {/* Edges */}
          {graphData.edges.map((edge) => {
            const src = nodeCoordinates[edge.source] || { x: 100, y: 150 };
            const tgt = nodeCoordinates[edge.target] || { x: 300, y: 150 };
            const isConnected = selectedNodeId === edge.source || selectedNodeId === edge.target;

            return (
              <g key={edge.id}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isConnected ? 'var(--text-primary)' : 'var(--border-strong)'}
                  strokeWidth={isConnected ? 2.5 : 1.5}
                  strokeDasharray={edge.type === 'applies' ? '4,4' : undefined}
                />
                {/* Arrowhead */}
                <circle
                  cx={(src.x + tgt.x * 2) / 3}
                  cy={(src.y + tgt.y * 2) / 3}
                  r={2.5}
                  fill={isConnected ? 'var(--text-primary)' : 'var(--border-strong)'}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {graphData.nodes.map((node) => {
            const pos = nodeCoordinates[node.id] || { x: 300, y: 150 };
            const isSelected = selectedNodeId === node.id;
            const radius = 18 + (node.examWeight || 7) * 1.8;

            let fillColor = 'var(--surface-raised)';
            let strokeColor = 'var(--border-strong)';
            let textColor = 'var(--text-primary)';

            if (node.mastery === 'high_friction') {
              fillColor = 'var(--status-trap)';
              strokeColor = '#f5c6c6';
              textColor = 'var(--status-trap-text)';
            } else if (node.mastery === 'mastered') {
              fillColor = 'var(--status-mastered)';
              strokeColor = '#c4e3cb';
              textColor = 'var(--status-mastered-text)';
            } else if (node.mastery === 'moderate') {
              fillColor = 'var(--status-moderate)';
              strokeColor = '#fae2b8';
              textColor = 'var(--status-moderate-text)';
            }

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className="cursor-pointer group select-none transition-transform"
              >
                {/* Outer halo when selected */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 6}
                    fill="none"
                    stroke="var(--text-primary)"
                    strokeWidth={2}
                    strokeDasharray="3,3"
                    className="animate-spin"
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '10s' }}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={fillColor}
                  stroke={isSelected ? 'var(--text-primary)' : strokeColor}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all hover:scale-105"
                />

                {/* Strikethrough tag for High Exam Friction nodes per PRD */}
                {node.mastery === 'high_friction' && (
                  <line
                    x1={pos.x - radius * 0.7}
                    y1={pos.y}
                    x2={pos.x + radius * 0.7}
                    y2={pos.y}
                    stroke="var(--status-trap-text)"
                    strokeWidth={2}
                  />
                )}

                {/* Node Label Text */}
                <text
                  x={pos.x}
                  y={pos.y + radius + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fill="var(--text-primary)"
                >
                  {node.label.length > 24 ? node.label.slice(0, 22) + '...' : node.label}
                </text>

                {/* Recurrence count mini tag */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight="bold"
                  fill={textColor}
                >
                  {node.recurrenceCount}x PYQ
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Concept Node Inspector Drawer (Bottom Half) */}
      <div className="p-4 overflow-y-auto max-h-64 space-y-3 bg-[var(--surface-raised)]">
        {selectedNode && (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">
                    {selectedNode.label}
                  </h4>
                  {selectedNode.isHighYield && <MarkBadge variant="high_yield" text="High Yield" />}
                  {selectedNode.hasTrapAlert && <MarkBadge variant="trap" text="Pitfall" />}
                </div>
                <div className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">
                  Category: {selectedNode.category} • Ref: {selectedNode.syllabusRef}
                </div>
              </div>

              {/* Mastery Switcher */}
              <div className="flex items-center gap-1 font-mono text-xs">
                <button
                  onClick={() => handleUpdateMastery('high_friction')}
                  className={`px-2 py-0.5 rounded-xs border cursor-pointer ${
                    selectedNode.mastery === 'high_friction'
                      ? 'bg-[var(--status-trap)] text-[var(--status-trap-text)] font-bold border-[#f5c6c6]'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                  title="Mark as High Exam Friction for urgent review"
                >
                  Friction
                </button>
                <button
                  onClick={() => handleUpdateMastery('moderate')}
                  className={`px-2 py-0.5 rounded-xs border cursor-pointer ${
                    selectedNode.mastery === 'moderate'
                      ? 'bg-[var(--status-moderate)] text-[var(--status-moderate-text)] font-bold border-[#fae2b8]'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  Moderate
                </button>
                <button
                  onClick={() => handleUpdateMastery('mastered')}
                  className={`px-2 py-0.5 rounded-xs border cursor-pointer ${
                    selectedNode.mastery === 'mastered'
                      ? 'bg-[var(--status-mastered)] text-[var(--status-mastered-text)] font-bold border-[#c4e3cb]'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  Mastered
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mt-2">
              {selectedNode.description}
            </p>

            {/* Formula Block */}
            {selectedNode.latexFormula && (
              <div className="my-2 p-2 rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                <FormulaRenderer math={selectedNode.latexFormula} block />
              </div>
            )}

            {/* Trap Warning Alert */}
            {selectedNode.trapWarning && (
              <div className="p-2 rounded-xs bg-[var(--status-trap)] text-[var(--status-trap-text)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-xs flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{selectedNode.trapWarning}</span>
              </div>
            )}

            {/* Quick Practice Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => onJumpToTool?.(2, { topic: selectedNode.label })}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Test via Feynman</span>
              </button>

              <button
                onClick={() => onJumpToTool?.(4, { conceptId: selectedNode.id })}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>Review Flashcards</span>
              </button>

              <button
                onClick={() => onJumpToTool?.(5, { topic: selectedNode.label })}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-xs bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] border border-[#c4e3cb] dark:border-[#1e3b26] hover:opacity-90 transition-all cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Solve PYQ</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
