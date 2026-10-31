'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GitFork, Search, Filter, AlertTriangle, Sparkles, Layers, BookOpen, RotateCcw } from 'lucide-react';
import { KnowledgeGraph, KnowledgeGraphNode } from '@/lib/schemas';
import { globalStore } from '@/lib/store';
import { MarkBadge } from '../shared/MarkBadge';

interface GraphSimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  mastery: number;
  examWeightage: number;
  chapter: string;
  status: 'unseen' | 'learning' | 'mastered' | 'friction';
}

interface GraphSimLink extends d3.SimulationLinkDatum<GraphSimNode> {
  source: string | GraphSimNode;
  target: string | GraphSimNode;
  relationship: string;
}

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
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setKg(globalStore.getKnowledgeGraph(docId));
  }, [docId]);

  const selectedNode = kg.nodes.find(n => n.id === selectedNodeId) || kg.nodes[0];

  // D3 Force Simulation Setup
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = svgEl.clientWidth || 580;
    const height = svgEl.clientHeight || 280;

    // Filter nodes if needed
    const nodesData: GraphSimNode[] = kg.nodes
      .filter(n => {
        const matchesSearch = n.label.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'friction' ? n.status === 'friction' : n.status === 'mastered');
        return matchesSearch && matchesFilter;
      })
      .map(n => ({
        ...n,
        x: undefined,
        y: undefined
      }));

    const activeNodeIds = new Set(nodesData.map(n => n.id));

    const linksData: GraphSimLink[] = kg.edges
      .filter(e => activeNodeIds.has(e.source) && activeNodeIds.has(e.target))
      .map(e => ({
        source: e.source,
        target: e.target,
        relationship: e.relationship
      }));

    const g = svg.append('g').attr('class', 'main-group');

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Force simulation
    const simulation = d3.forceSimulation<GraphSimNode>(nodesData)
      .force(
        'link',
        d3.forceLink<GraphSimNode, GraphSimLink>(linksData)
          .id((d) => d.id)
          .distance(105)
      )
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphSimNode>().radius((d) => 24 + d.examWeightage * 2.2));

    // Links
    const link = g
      .append('g')
      .attr('stroke', '#d2d0c7')
      .attr('stroke-opacity', 0.85)
      .attr('stroke-width', 1.5)
      .selectAll('line')
      .data(linksData)
      .join('line');

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphSimNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Node container
    const node = g
      .append('g')
      .selectAll<SVGGElement, GraphSimNode>('g')
      .data(nodesData)
      .join('g')
      .call(drag)
      .on('click', (event, d) => {
        setSelectedNodeId(d.id);
        onSelectConcept?.(d.id);
      })
      .style('cursor', 'pointer');

    // Node circles with radius proportional to examWeightage
    node
      .append('circle')
      .attr('r', (d) => 18 + d.examWeightage * 1.8)
      .attr('fill', (d) => {
        if (d.status === 'friction' || d.mastery < 50) return '#fdefef';
        if (d.status === 'mastered' || d.mastery >= 75) return '#e8f4ec';
        return '#fef7ec';
      })
      .attr('stroke', (d) => {
        if (d.id === selectedNodeId) return '#191816';
        if (d.status === 'friction' || d.mastery < 50) return '#962828';
        if (d.status === 'mastered' || d.mastery >= 75) return '#1d6935';
        return '#92530a';
      })
      .attr('stroke-width', (d) => (d.id === selectedNodeId ? 2.5 : 1.5));

    // Node primary label
    node
      .append('text')
      .text((d) => (d.label.length > 20 ? d.label.slice(0, 18) + '...' : d.label))
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .attr('font-size', '9.5px')
      .attr('font-family', 'var(--font-geist-sans), sans-serif')
      .attr('font-weight', '500')
      .attr('fill', '#191816')
      .style('pointer-events', 'none');

    // Node weightage / mastery label
    node
      .append('text')
      .text((d) => `${d.mastery}% · ${d.examWeightage}x PYQ`)
      .attr('text-anchor', 'middle')
      .attr('dy', '1.1em')
      .attr('font-size', '8px')
      .attr('font-family', 'var(--font-geist-mono), monospace')
      .attr('fill', '#636159')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphSimNode).x ?? 0)
        .attr('y1', (d) => (d.source as GraphSimNode).y ?? 0)
        .attr('x2', (d) => (d.target as GraphSimNode).x ?? 0)
        .attr('y2', (d) => (d.target as GraphSimNode).y ?? 0);

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [kg, search, filter, selectedNodeId, onSelectConcept]);

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
            D3 Force-Directed Concept Graph
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            {kg.nodes.length} Nodes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-36 sm:w-44">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter concepts..."
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

      {/* D3 Simulation Canvas */}
      <div className="flex-1 min-h-[220px] bg-[var(--surface-canvas)] relative border-b border-[var(--border-subtle)] overflow-hidden">
        <svg ref={svgRef} className="w-full h-full min-h-[260px]" />

        {/* Legend */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 text-[10px] font-mono bg-[var(--surface-overlay)] p-2 rounded-xs border border-[var(--border-subtle)] shadow-xs pointer-events-none">
          <span className="flex items-center gap-1.5 text-[#1d6935]">
            <span className="w-2 h-2 rounded-full bg-[#1d6935]" /> Mastered (&ge;75%)
          </span>
          <span className="flex items-center gap-1.5 text-[#92530a]">
            <span className="w-2 h-2 rounded-full bg-[#92530a]" /> Learning (50-74%)
          </span>
          <span className="flex items-center gap-1.5 text-[#962828]">
            <span className="w-2 h-2 rounded-full bg-[#962828]" /> Exam Friction (&lt;50%)
          </span>
        </div>

        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[var(--text-tertiary)] pointer-events-none">
          Drag nodes to explore · Scroll to zoom
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-4 overflow-y-auto max-h-56 space-y-2 bg-[var(--surface-raised)] flex-shrink-0">
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
                {selectedNode.chapter} • Exam Weightage: {selectedNode.examWeightage}/10 • Current Mastery: {selectedNode.mastery}%
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
              <span>Over 44% of students lose all marks by substituting Celsius directly into &eta; = 1 - (T_C / T_H).</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraphView;
