'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { MarkBadge } from '../shared/MarkBadge';

export const TwoDAnimView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [thCelsius, setThCelsius] = useState<number>(327); // 600 K
  const [tcCelsius, setTcCelsius] = useState<number>(27);  // 300 K
  const [cycleStage, setCycleStage] = useState<number>(1);

  const thKelvin = thCelsius + 273.15;
  const tcKelvin = tcCelsius + 273.15;
  const carnotEfficiency = Math.max(0, 1 - (tcKelvin / thKelvin));
  const efficiencyPercent = (carnotEfficiency * 100).toFixed(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) t += 0.015;

      const stage = (Math.floor(t) % 4) + 1;
      setCycleStage(stage);

      const stageProgress = t % 1;
      let vol = 0.2;
      if (stage === 1) vol = 0.2 + stageProgress * 0.4;
      else if (stage === 2) vol = 0.6 + stageProgress * 0.3;
      else if (stage === 3) vol = 0.9 - stageProgress * 0.4;
      else vol = 0.5 - stageProgress * 0.3;

      // Piston & Cylinder
      const cylX = 30;
      const cylY = 35;
      const cylW = 160;
      const cylH = 110;

      ctx.strokeStyle = '#636159';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cylX, cylY);
      ctx.lineTo(cylX + cylW, cylY);
      ctx.moveTo(cylX, cylY + cylH);
      ctx.lineTo(cylX + cylW, cylY + cylH);
      ctx.moveTo(cylX, cylY);
      ctx.lineTo(cylX, cylY + cylH);
      ctx.stroke();

      const isHot = stage === 1 || stage === 4;
      ctx.fillStyle = isHot ? 'rgba(217, 83, 79, 0.22)' : 'rgba(91, 192, 222, 0.22)';
      const pistonX = cylX + (cylW - 20) * vol;
      ctx.fillRect(cylX + 2, cylY + 2, pistonX - cylX, cylH - 4);

      // Gas molecules
      ctx.fillStyle = isHot ? '#d9534f' : '#337ab7';
      for (let i = 0; i < 14; i++) {
        const mx = cylX + 15 + ((i * 37 + t * 40) % Math.max(10, (pistonX - cylX - 25)));
        const my = cylY + 12 + ((i * 23 + Math.sin(t * 3 + i) * 15) % (cylH - 24));
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Piston face & Rod
      ctx.fillStyle = '#191816';
      ctx.fillRect(pistonX, cylY + 2, 12, cylH - 4);
      ctx.fillRect(pistonX + 12, cylY + cylH / 2 - 4, 40, 8);

      // Label below cylinder
      ctx.font = '10px monospace';
      if (stage === 1) {
        ctx.fillStyle = '#b93838';
        ctx.fillText(`Heat In: Q_H (at ${thKelvin.toFixed(0)} K)`, cylX + 10, cylY + cylH + 22);
      } else if (stage === 3) {
        ctx.fillStyle = '#23699c';
        ctx.fillText(`Heat Out: Q_C (at ${tcKelvin.toFixed(0)} K)`, cylX + 10, cylY + cylH + 22);
      } else {
        ctx.fillStyle = '#636159';
        ctx.fillText('Insulated: dQ = 0 (Adiabatic)', cylX + 10, cylY + cylH + 22);
      }

      // P-V Indicator
      const pvX = 230;
      const pvY = 25;
      const pvW = 160;
      const pvH = 130;

      ctx.strokeStyle = '#9c9a92';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pvX, pvY);
      ctx.lineTo(pvX, pvY + pvH);
      ctx.lineTo(pvX + pvW, pvY + pvH);
      ctx.stroke();

      ctx.fillStyle = '#636159';
      ctx.font = '9px monospace';
      ctx.fillText('P', pvX - 10, pvY + 10);
      ctx.fillText('V', pvX + pvW - 10, pvY + pvH + 14);

      const p1 = { x: pvX + 25, y: pvY + 20 };
      const p2 = { x: pvX + 75, y: pvY + 45 };
      const p3 = { x: pvX + 145, y: pvY + 110 };
      const p4 = { x: pvX + 60, y: pvY + 95 };

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(pvX + 50, pvY + 30, p2.x, p2.y);
      ctx.quadraticCurveTo(pvX + 110, pvY + 75, p3.x, p3.y);
      ctx.quadraticCurveTo(pvX + 100, pvY + 105, p4.x, p4.y);
      ctx.quadraticCurveTo(pvX + 35, pvY + 55, p1.x, p1.y);
      ctx.closePath();

      ctx.fillStyle = 'rgba(29, 105, 53, 0.12)';
      ctx.fill();
      ctx.strokeStyle = '#1d6935';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Current loop marker
      let curX = p1.x;
      let curY = p1.y;
      if (stage === 1) {
        curX = p1.x + (p2.x - p1.x) * stageProgress;
        curY = p1.y + (p2.y - p1.y) * stageProgress;
      } else if (stage === 2) {
        curX = p2.x + (p3.x - p2.x) * stageProgress;
        curY = p2.y + (p3.y - p2.y) * stageProgress;
      } else if (stage === 3) {
        curX = p3.x + (p4.x - p3.x) * stageProgress;
        curY = p3.y + (p4.y - p3.y) * stageProgress;
      } else {
        curX = p4.x + (p1.x - p4.x) * stageProgress;
        curY = p4.y + (p1.y - p4.y) * stageProgress;
      }

      ctx.beginPath();
      ctx.arc(curX, curY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#d9534f';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, thKelvin, tcKelvin]);

  return (
    <div className="space-y-4 font-sans">
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">
            Carnot Heat Engine & P-V Indicator
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Live reversible 4-stroke cycle with absolute thermodynamic temperatures.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--text-primary)] cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { setThCelsius(327); setTcCelsius(27); }}
            className="p-1.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] overflow-hidden flex justify-center py-2 shadow-xs">
        <canvas ref={canvasRef} width={420} height={180} className="max-w-full h-auto" />
      </div>

      <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
        <div className={`p-1.5 rounded-xs border ${cycleStage === 1 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
          1. Iso Exp
        </div>
        <div className={`p-1.5 rounded-xs border ${cycleStage === 2 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
          2. Adia Exp
        </div>
        <div className={`p-1.5 rounded-xs border ${cycleStage === 3 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
          3. Iso Comp
        </div>
        <div className={`p-1.5 rounded-xs border ${cycleStage === 4 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
          4. Adia Comp
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] font-mono text-xs">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[#b93838] font-bold">Hot Reservoir T_H:</span>
            <span>{thCelsius}°C = {thKelvin.toFixed(1)} K</span>
          </div>
          <input
            type="range"
            min={100}
            max={600}
            value={thCelsius}
            onChange={(e) => setThCelsius(Number(e.target.value))}
            className="w-full accent-[var(--text-primary)]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[#23699c] font-bold">Cold Sink T_C:</span>
            <span>{tcCelsius}°C = {tcKelvin.toFixed(1)} K</span>
          </div>
          <input
            type="range"
            min={0}
            max={90}
            value={tcCelsius}
            onChange={(e) => setTcCelsius(Number(e.target.value))}
            className="w-full accent-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="p-3 rounded-sm border border-[#c4e3cb] dark:border-[#1e3b26] bg-[var(--status-high-yield)] flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--status-high-yield-text)] font-bold">
            Theoretical Carnot Efficiency:
          </span>
          <div className="font-mono text-xl font-bold text-[var(--status-high-yield-text)] mt-0.5">
            η = 1 - (T_C / T_H) = {efficiencyPercent}%
          </div>
        </div>
        <MarkBadge marks={5} text="PYQ Match" />
      </div>
    </div>
  );
};
