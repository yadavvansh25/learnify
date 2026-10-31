'use client';

import React, { useState, useEffect } from 'react';
import { GitFork, Search, Filter, AlertTriangle, Sparkles, Layers, BookOpen } from 'lucide-react';
import { KnowledgeGraph, KnowledgeGraphNode } from '@/lib/schemas';
import { globalStore } from '@/lib/store';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';

interface KnowledgeGraphViewProps {
  docId?: string;
  onSelectConcept?: (conceptId: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  docId = 'doc-thermo-101',
  onSelectConcept
}) => {
  const [kg, setKg] = useState<KnowledgeGraph>(() => globalStore.getKnowledgeGraph(docId));
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n-carnot-engine');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'friction' | 'mastered'>('all');

  useEffect(() => {
    setKg(globalStore.getKnowledgeGraph(docId));
  }, [docId]);

  const selectedNode = kg.nodes.find(n => n.id === selectedNodeId) || kg.nodes[0];

  const filteredNodes = kg.nodes.filter(n => {
    const matchesSearch = n.label.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'friction' ? n.status === 'friction' : n.status === 'mastered');
    return matchesSearch && matchesFilter;
  });

  const nodePositions: Record<string, { x: number; y: number }> = {
    'n-first-law': { x: 80, y: 140 },
    'n-isothermal-work': { x: 230, y: 80 },
    'n-adiabatic-process': { x: 230, y: 200 },
    'n-carnot-engine': { x: 390, y: 140 },
    'n-clausius-entropy': { x: 530, y: 140 }
  };

  const handleUpdateStatus = (nodeId: string, newStatus: 'mastered' | 'friction' | 'learning') => {
    const newMastery = newStatus === 'mastered' ? 90 : newStatus === 'friction' ? 35 : 60;
    globalStore.updateNodeMastery(docId, nodeId, newMastery, newStatus);
    setKg({ ...globalStore.getKnowledgeGraph(docId) });
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-hidden font-sans">
      {/* Search & Filter Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-bold text-xs text-[var(--text-primary)]">
            Concept Dependency Graph
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            {kg.nodes.length} Concepts
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-36 sm:w-44">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find node..."
              className="w-full pl-6 pr-2 py-1 text-xs rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-0.5 rounded-sm text-[11px] font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${filter === 'all' ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold' : 'text-[var(--text-secondary)]'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('friction')}
              className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${filter === 'friction' ? 'bg-[var(--status-trap)] text-[var(--status-trap-text)] font-bold' : 'text-[var(--text-secondary)]'}`}
            >
              Friction
            </button>
            <button
              onClick={() => setFilter('mastered')}
              className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${filter === 'mastered' ? 'bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] font-bold' : 'text-[var(--text-secondary)]'}`}
            >
              Mastered
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Concept Canvas */}
      <div className="flex-1 min-h-[220px] bg-[var(--surface-canvas)] relative border-b border-[var(--border-subtle)] overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }} />

        <svg viewBox="0 0 620 280" className="w-full h-full">
          {/* Edges */}
          {kg.edges.map((e, idx) => {
            const src = nodePositions[e.source] || { x: 100, y: 140 };
            const tgt = nodePositions[e.target] || { x: 300, y: 140 };
            const isConnected = selectedNodeId === e.source || selectedNodeId === e.target;

            return (
              <g key={idx}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isConnected ? 'var(--text-primary)' : 'var(--border-strong)'}
                  strokeWidth={isConnected ? 2.5 : 1.5}
                />
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
          {kg.nodes.map((node) => {
            const pos = nodePositions[node.id] || { x: 300, y: 140 };
            const isSelected = selectedNodeId === node.id;
            const radius = 18 + node.examWeightage * 1.8;

            let fillColor = 'var(--surface-raised)';
            let strokeColor = 'var(--border-strong)';
            let textColor = 'var(--text-primary)';

            if (node.status === 'friction') {
              fillColor = 'var(--status-trap)';
              strokeColor = '#f5c6c6';
              textColor = 'var(--status-trap-text)';
            } else if (node.status === 'mastered') {
              fillColor = 'var(--status-high-yield)';
              strokeColor = '#c4e3cb';
              textColor = 'var(--status-high-yield-text)';
            } else if (node.status === 'learning') {
              fillColor = 'var(--status-moderate)';
              strokeColor = '#fae2b8';
              textColor = 'var(--status-moderate-text)';
            }

            return (
              <g
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  onSelectConcept?.(node.id);
                }}
                className="cursor-pointer group select-none"
              >
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

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={fillColor}
                  stroke={isSelected ? 'var(--text-primary)' : strokeColor}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />

                {/* Strikethrough for urgent review / High Exam Friction */}
                {node.status === 'friction' && (
                  <line
                    x1={pos.x - radius * 0.7}
                    y1={pos.y}
                    x2={pos.x + radius * 0.7}
                    y2={pos.y}
                    stroke="var(--status-trap-text)"
                    strokeWidth={2}
                  />
                )}

                <text
                  x={pos.x}
                  y={pos.y + radius + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fill="var(--text-primary)"
                >
                  {node.label.length > 22 ? node.label.slice(0, 20) + '...' : node.label}
                </text>

                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight="bold"
                  fill={textColor}
                >
                  {node.examWeightage}x Weight
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-4 overflow-y-auto max-h-56 space-y-2 bg-[var(--surface-raised)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[var(--text-primary)]">
                  {selectedNode.label}
                </h4>
                {selectedNode.status === 'friction' && <MarkBadge variant="trap" text="High Friction" />}
                {selectedNode.status === 'mastered' && <MarkBadge variant="high_yield" text="Mastered" />}
              </div>
              <div className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">
                {selectedNode.chapter} • Exam Weightage: {selectedNode.examWeightage}/10 • Mastery: {selectedNode.mastery}%
              </div>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => handleUpdateStatus(selectedNode.id, 'friction')}
                className={`px-2 py-0.5 rounded-xs border cursor-pointer ${selectedNode.status === 'friction' ? 'bg-[var(--status-trap)] text-[var(--status-trap-text)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'}`}
              >
                Friction
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedNode.id, 'learning')}
                className={`px-2 py-0.5 rounded-xs border cursor-pointer ${selectedNode.status === 'learning' ? 'bg-[var(--status-moderate)] text-[var(--status-moderate-text)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'}`}
              >
                Learning
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedNode.id, 'mastered')}
                className={`px-2 py-0.5 rounded-xs border cursor-pointer ${selectedNode.status === 'mastered' ? 'bg-[var(--status-high-yield)] text-[var(--status-high-yield-text)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'}`}
              >
                Mastered
              </button>
            </div>
          </div>

          {selectedNode.id === 'n-carnot-engine' && (
            <div className="p-2 rounded-xs bg-[var(--status-trap)] text-[var(--status-trap-text)] border border-[#f5c6c6] dark:border-[#4d1f1f] text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Over 44% of students lose all marks by substituting Celsius directly into eta = 1 - (T_C / T_H).</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
