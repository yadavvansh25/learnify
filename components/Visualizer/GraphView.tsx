'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  Sliders,
  TrendingUp,
  Search,
  Activity,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';
import { GraphPayload } from '@/app/api/generate-graph/route';

interface GraphViewProps {
  initialQuestion?: string;
  docId?: string;
  subject?: string;
}

const PRESET_QUERIES = [
  { label: 'Damped Oscillation', query: 'f(x) = sin(1.8*x) * exp(-0.15*x)' },
  { label: 'Carnot P-V Curves', query: 'Carnot Cycle P-V Isothermal Hyperbolas' },
  { label: 'Enzyme Kinetics', query: 'Michaelis-Menten Enzyme Velocity v = Vmax*[S]/(Km + [S])' },
  { label: 'Big-O Asymptotics', query: 'Algorithm Big-O Complexity Comparison O(n) vs O(log n)' },
  { label: 'Projectile Motion', query: 'Projectile Parabola y = -0.5*x^2 + 4*x' },
  { label: 'Action Potential', query: 'Neuronal Action Potential Membrane Trajectory' },
  { label: 'Concept Map', query: 'Concept Graph: Thermodynamics to Carnot Engine' }
];

export const GraphView: React.FC<GraphViewProps> = ({
  initialQuestion = 'Damped Harmonic Oscillator',
  subject = 'PHYSICS'
}) => {
  const [questionInput, setQuestionInput] = useState<string>(initialQuestion);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<GraphPayload | null>(null);
  const [activeParamValues, setActiveParamValues] = useState<Record<string, number>>({});
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; px: number; py: number } | null>(null);

  // SVG coordinate system
  const svgWidth = 520;
  const svgHeight = 240;
  const paddingLeft = 52;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 42;

  const plotW = svgWidth - paddingLeft - paddingRight;
  const plotH = svgHeight - paddingTop - paddingBottom;

  // Fetch graph specs from API
  const fetchGraph = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText, subject })
      });
      const data = await res.json();
      if (data.success && data.graph) {
        setGraphData(data.graph);
        // Initialize parameter values
        if (data.graph.parameters && data.graph.parameters.length > 0) {
          const defaults: Record<string, number> = {};
          data.graph.parameters.forEach((p: any) => {
            defaults[p.id] = p.default;
          });
          setActiveParamValues(defaults);
        } else {
          setActiveParamValues({});
        }
      }
    } catch (err) {
      console.error('Failed to generate graph:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph(initialQuestion);
  }, [initialQuestion]);

  // Compute dynamically scaled data points if user adjusts sliders
  const activeSeries = useMemo(() => {
    if (!graphData) return [];

    // If multi-series already provided
    if (graphData.series && graphData.series.length > 0) {
      return graphData.series;
    }

    const basePts = graphData.dataPoints || [];
    if (basePts.length === 0) return [];

    // Parameter modulation multipliers
    let yScaleFactor = 1.0;
    if (activeParamValues.amplitude !== undefined) {
      yScaleFactor = activeParamValues.amplitude;
    } else if (activeParamValues.scale !== undefined) {
      yScaleFactor = activeParamValues.scale;
    } else if (activeParamValues.vmax !== undefined) {
      yScaleFactor = activeParamValues.vmax / 100;
    }

    const scaledPts = basePts.map(pt => ({
      x: pt.x,
      y: Number((pt.y * yScaleFactor).toFixed(3)),
      label: pt.label
    }));

    return [{ name: graphData.title, color: '#1d6935', dataPoints: scaledPts }];
  }, [graphData, activeParamValues]);

  // Determine domain (xMin, xMax) and range (yMin, yMax)
  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    activeSeries.forEach(s => {
      s.dataPoints.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });

    if (!isFinite(minX)) minX = 0;
    if (!isFinite(maxX)) maxX = 10;
    if (!isFinite(minY)) minY = 0;
    if (!isFinite(maxY)) maxY = 10;

    // Add 10% breathing room to y bounds
    const ySpan = maxY - minY || 1;
    const yPad = ySpan * 0.12;

    return {
      xMin: minX,
      xMax: maxX === minX ? minX + 1 : maxX,
      yMin: Math.min(0, minY - yPad),
      yMax: maxY + yPad
    };
  }, [activeSeries]);

  // Coordinate mapping functions
  const mapX = (xVal: number) => {
    const ratio = (xVal - xMin) / (xMax - xMin);
    return paddingLeft + ratio * plotW;
  };

  const mapY = (yVal: number) => {
    const ratio = (yVal - yMin) / (yMax - yMin);
    return paddingTop + plotH - ratio * plotH;
  };

  // Convert series points to SVG path
  const seriesPaths = useMemo(() => {
    return activeSeries.map(s => {
      const d = s.dataPoints.reduce((acc, pt, i) => {
        const cx = mapX(pt.x).toFixed(1);
        const cy = mapY(pt.y).toFixed(1);
        return `${acc} ${i === 0 ? 'M' : 'L'} ${cx},${cy}`;
      }, '');
      return { name: s.name, color: s.color || '#1d6935', d };
    });
  }, [activeSeries, xMin, xMax, yMin, yMax]);

  // Handle mouse move over plot for tooltip crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert client coords to SVG viewbox scale
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    const svgX = clientX * scaleX;
    const svgY = clientY * scaleY;

    if (svgX < paddingLeft || svgX > svgWidth - paddingRight) {
      setHoveredPoint(null);
      return;
    }

    // Find closest x in primary series
    const primary = activeSeries[0]?.dataPoints || [];
    if (primary.length === 0) return;

    const dataX = xMin + ((svgX - paddingLeft) / plotW) * (xMax - xMin);
    let closest = primary[0];
    let minDist = Math.abs(primary[0].x - dataX);

    for (let i = 1; i < primary.length; i++) {
      const dist = Math.abs(primary[i].x - dataX);
      if (dist < minDist) {
        minDist = dist;
        closest = primary[i];
      }
    }

    setHoveredPoint({
      x: closest.x,
      y: closest.y,
      px: mapX(closest.x),
      py: mapY(closest.y)
    });
  };

  return (
    <div className="space-y-3 font-sans h-full flex flex-col justify-between">
      {/* 1. Real-Time Question / Formula Prompt Input */}
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--text-primary)]" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Real-Time AI Question-to-Graph & Function Plotter
            </h4>
          </div>
          <MarkBadge variant="high_yield" text="Dynamic Vector Engine" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchGraph(questionInput);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Enter math equation or physics question (e.g. PV = nRT, f(x)=sin(x)*e^-0.2x)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-xs bg-[var(--text-primary)] text-[var(--surface-raised)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            <span>{isLoading ? 'Plotting...' : 'Generate Graph'}</span>
          </button>
        </form>

        {/* Preset quick test chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase font-semibold">
            Quick Drills:
          </span>
          {PRESET_QUERIES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestionInput(p.query);
                fetchGraph(p.query);
              }}
              className="px-2 py-0.5 text-[10px] font-mono rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-sunken)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Graph Viewport & Visual Canvas */}
      <div className="flex-1 min-h-[280px] p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-col justify-between overflow-hidden shadow-xs">
        {/* Graph Meta Strip */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] mb-2">
          <div>
            <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span>{graphData?.title || 'Interactive Function Plot'}</span>
              {graphData?.type && (
                <span className="px-1.5 py-0.2 rounded-xs text-[9px] font-mono uppercase bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  {graphData.type}
                </span>
              )}
            </div>
            {graphData?.equation && (
              <div className="mt-1">
                <FormulaRenderer math={graphData.equation} block={false} className="text-xs text-[var(--text-primary)]" />
              </div>
            )}
          </div>

          {/* Series Legend */}
          {activeSeries.length > 1 && (
            <div className="flex items-center gap-2.5 font-mono text-[10px] flex-wrap justify-end">
              {activeSeries.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 rounded-xs" style={{ backgroundColor: s.color }} />
                  <span className="text-[var(--text-secondary)]">{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Viewport: Function Plot or Concept Graph */}
        {graphData?.type === 'concept-graph' ? (
          /* Concept Graph Node-Link Network */
          <div className="w-full flex-1 min-h-[220px] bg-[var(--surface-raised)] rounded-xs border border-[var(--border-subtle)] p-3 relative flex flex-col justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {graphData.nodes?.map((node) => (
                <div
                  key={node.id}
                  className="p-2.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-col justify-between shadow-xs hover:border-[var(--text-primary)] transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)] mb-1">
                    <span>{node.group || 'Node'}</span>
                    <Layers className="w-3 h-3" />
                  </div>
                  <div className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                    {node.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Edge Connections List */}
            {graphData.edges && graphData.edges.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex flex-wrap gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
                {graphData.edges.map((e, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
                    <span className="font-semibold text-[var(--text-primary)]">{e.source}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[var(--text-tertiary)]" />
                    <span>{e.target}</span>
                    {e.relationship && <span className="text-[var(--text-tertiary)]">({e.relationship})</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* High-Precision SVG Function Plot Canvas */
          <div className="w-full flex-1 min-h-[220px] bg-[var(--surface-raised)] rounded-xs border border-[var(--border-subtle)] relative flex items-center justify-center select-none overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredPoint(null)}
              className="w-full h-full cursor-crosshair"
            >
              {/* Plot Background Grid lines */}
              {Array.from({ length: 6 }).map((_, i) => {
                const yVal = yMin + (i / 5) * (yMax - yMin);
                const py = mapY(yVal);
                return (
                  <g key={`gy-${i}`}>
                    <line
                      x1={paddingLeft}
                      y1={py}
                      x2={svgWidth - paddingRight}
                      y2={py}
                      stroke="var(--border-subtle)"
                      strokeDasharray="2,3"
                      strokeWidth="0.8"
                    />
                    <text
                      x={paddingLeft - 6}
                      y={py + 3}
                      textAnchor="end"
                      fontSize="9"
                      fontFamily="monospace"
                      fill="var(--text-tertiary)"
                    >
                      {yVal.toFixed(yVal % 1 === 0 ? 0 : 1)}
                    </text>
                  </g>
                );
              })}

              {Array.from({ length: 7 }).map((_, i) => {
                const xVal = xMin + (i / 6) * (xMax - xMin);
                const px = mapX(xVal);
                return (
                  <g key={`gx-${i}`}>
                    <line
                      x1={px}
                      y1={paddingTop}
                      x2={px}
                      y2={svgHeight - paddingBottom}
                      stroke="var(--border-subtle)"
                      strokeDasharray="2,3"
                      strokeWidth="0.8"
                    />
                    <text
                      x={px}
                      y={svgHeight - paddingBottom + 14}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="monospace"
                      fill="var(--text-tertiary)"
                    >
                      {xVal.toFixed(xVal % 1 === 0 ? 0 : 1)}
                    </text>
                  </g>
                );
              })}

              {/* Zero axes if present */}
              {yMin < 0 && yMax > 0 && (
                <line
                  x1={paddingLeft}
                  y1={mapY(0)}
                  x2={svgWidth - paddingRight}
                  y2={mapY(0)}
                  stroke="var(--border-strong)"
                  strokeWidth="1.2"
                />
              )}
              {xMin < 0 && xMax > 0 && (
                <line
                  x1={mapX(0)}
                  y1={paddingTop}
                  x2={mapX(0)}
                  y2={svgHeight - paddingBottom}
                  stroke="var(--border-strong)"
                  strokeWidth="1.2"
                />
              )}

              {/* Plot Area Outer Border */}
              <rect
                x={paddingLeft}
                y={paddingTop}
                width={plotW}
                height={plotH}
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="1.2"
              />

              {/* Plotted Curves */}
              {seriesPaths.map((sp, idx) => (
                <path
                  key={idx}
                  d={sp.d}
                  fill="none"
                  stroke={sp.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Critical Peak / Valley Markers from DataPoints */}
              {graphData?.dataPoints?.filter(pt => pt.label).map((pt, idx) => {
                const cx = mapX(pt.x);
                const cy = mapY(pt.y);
                return (
                  <g key={`marker-${idx}`}>
                    <circle cx={cx} cy={cy} r="4.5" fill="#ba322a" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={cx + 6}
                      y={cy - 6}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#ba322a"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}

              {/* Interactive Hover Crosshair & Tooltip */}
              {hoveredPoint && (
                <g>
                  {/* Vertical & Horizontal Crosshair line */}
                  <line
                    x1={hoveredPoint.px}
                    y1={paddingTop}
                    x2={hoveredPoint.px}
                    y2={svgHeight - paddingBottom}
                    stroke="#191816"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <line
                    x1={paddingLeft}
                    y1={hoveredPoint.py}
                    x2={svgWidth - paddingRight}
                    y2={hoveredPoint.py}
                    stroke="#191816"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />

                  {/* Highlight circle */}
                  <circle
                    cx={hoveredPoint.px}
                    cy={hoveredPoint.py}
                    r="5"
                    fill="#1d6935"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Tooltip badge */}
                  <rect
                    x={Math.min(hoveredPoint.px + 8, svgWidth - 110)}
                    y={Math.max(hoveredPoint.py - 28, paddingTop + 2)}
                    width="96"
                    height="24"
                    rx="2"
                    fill="#191816"
                    opacity="0.9"
                  />
                  <text
                    x={Math.min(hoveredPoint.px + 14, svgWidth - 104)}
                    y={Math.max(hoveredPoint.py - 12, paddingTop + 18)}
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    ({hoveredPoint.x.toFixed(2)}, {hoveredPoint.y.toFixed(2)})
                  </text>
                </g>
              )}

              {/* Axis Title Labels */}
              <text
                x={paddingLeft + plotW / 2}
                y={svgHeight - 10}
                textAnchor="middle"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="600"
                fill="var(--text-secondary)"
              >
                {graphData?.xLabel || 'Independent Variable x'}
              </text>

              <text
                x={12}
                y={paddingTop + plotH / 2}
                textAnchor="middle"
                transform={`rotate(-90, 12, ${paddingTop + plotH / 2})`}
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="600"
                fill="var(--text-secondary)"
              >
                {graphData?.yLabel || 'Dependent Variable y'}
              </text>
            </svg>
          </div>
        )}

        {/* 3. Real-Time Dynamic Parameter Tuning Sliders */}
        {graphData?.parameters && graphData.parameters.length > 0 && (
          <div className="mt-3 p-2.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-sunken)] flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--text-primary)]">
              <Sliders className="w-3.5 h-3.5" />
              <span>Real-Time Parameter Modulation:</span>
            </div>
            {graphData.parameters.map((param) => {
              const currentVal = activeParamValues[param.id] ?? param.default;
              return (
                <div key={param.id} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">{param.name}:</span>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={currentVal}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setActiveParamValues(prev => ({ ...prev, [param.id]: val }));
                    }}
                    className="w-24 accent-[var(--text-primary)] cursor-pointer"
                  />
                  <span className="font-bold text-[var(--text-primary)] min-w-[36px]">
                    {currentVal}{param.unit ? ` ${param.unit}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Key Mathematical Inferences & Exam Takeaways */}
      {graphData?.insights && graphData.insights.length > 0 && (
        <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#1d6935]" />
            <h5 className="font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider font-mono">
              Key Exam Mathematical Inferences & Marking Schemes
            </h5>
          </div>
          <div className="space-y-1.5">
            {graphData.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                <span className="text-[#1d6935] font-bold mt-0.5">•</span>
                <span className="leading-relaxed">
                  <strong className="text-[var(--text-primary)]">{insight.split(':')[0]}:</strong>{' '}
                  {insight.split(':').slice(1).join(':') || insight}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphView;
