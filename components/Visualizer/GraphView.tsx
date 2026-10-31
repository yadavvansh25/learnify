'use client';

import React, { useState } from 'react';
import { MarkBadge } from '../shared/MarkBadge';

export const GraphView: React.FC = () => {
  const [coldTempK, setColdTempK] = useState<number>(300);

  // SVG coordinate width and height
  const width = 380;
  const height = 180;
  const padding = 40;

  // Generate curve points for η(T_H) = 1 - (coldTempK / T_H) where T_H ranges from coldTempK to 1200 K
  const points: Array<{ x: number; y: number; th: number; eta: number }> = [];
  const minTh = coldTempK + 20;
  const maxTh = 1200;

  for (let th = minTh; th <= maxTh; th += 20) {
    const eta = 1 - (coldTempK / th);
    // map th to x: [minTh, maxTh] -> [padding, width - 20]
    const x = padding + ((th - 300) / (maxTh - 300)) * (width - padding - 20);
    // map eta to y: [0, 1.0] -> [height - padding, 20]
    const y = (height - padding) - (eta * (height - padding - 20));
    points.push({ x, y, th, eta });
  }

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, '');

  return (
    <div className="space-y-4 font-sans">
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">
            Carnot Efficiency Limit Graph $\eta(T_H)$
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Theoretical conversion efficiency plotted against heat reservoir temperature.
          </p>
        </div>
        <MarkBadge variant="high_yield" text="SVG Projected" />
      </div>

      <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] font-mono">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xs">
          {/* Axes */}
          <line x1={padding} y1={20} x2={padding} y2={height - padding} stroke="var(--border-strong)" strokeWidth="1.5" />
          <line x1={padding} y1={height - padding} x2={width - 20} y2={height - padding} stroke="var(--border-strong)" strokeWidth="1.5" />

          {/* Grid lines */}
          <line x1={padding} y1={20} x2={width - 20} y2={20} stroke="var(--border-subtle)" strokeDasharray="3,3" />
          <line x1={padding} y1={(height - padding) / 2 + 10} x2={width - 20} y2={(height - padding) / 2 + 10} stroke="var(--border-subtle)" strokeDasharray="3,3" />

          {/* Axis Labels */}
          <text x={padding - 30} y={25} fontSize="9" fill="var(--text-tertiary)">1.0</text>
          <text x={padding - 30} y={(height - padding) / 2 + 15} fontSize="9" fill="var(--text-tertiary)">0.5</text>
          <text x={padding - 30} y={height - padding + 4} fontSize="9" fill="var(--text-tertiary)">0.0</text>

          <text x={padding} y={height - padding + 15} fontSize="9" fill="var(--text-tertiary)">300K</text>
          <text x={width / 2} y={height - padding + 15} fontSize="9" fill="var(--text-tertiary)">750K</text>
          <text x={width - 40} y={height - padding + 15} fontSize="9" fill="var(--text-tertiary)">1200K</text>

          {/* The Function Curve */}
          <path d={pathD} fill="none" stroke="#1d6935" strokeWidth="2.5" />

          {/* Asymptote η = 1.0 */}
          <line x1={padding} y1={20} x2={width - 20} y2={20} stroke="#962828" strokeWidth="1" strokeDasharray="4,4" />
          <text x={width - 130} y={15} fontSize="8" fill="#962828" fontWeight="bold">Asymptote η = 100%</text>
        </svg>

        <div className="mt-3 flex items-center justify-between text-xs">
          <label className="text-[var(--text-secondary)]">
            Adjust Cold Reservoir T_C: <span className="font-bold text-[var(--text-primary)]">{coldTempK} K ({(coldTempK - 273.15).toFixed(0)}°C)</span>
          </label>
          <input
            type="range"
            min={200}
            max={450}
            value={coldTempK}
            onChange={(e) => setColdTempK(Number(e.target.value))}
            className="w-40 accent-[var(--text-primary)]"
          />
        </div>
      </div>
    </div>
  );
};
