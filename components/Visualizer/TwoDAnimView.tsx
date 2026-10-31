'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { MarkBadge } from '../shared/MarkBadge';

interface TwoDAnimViewProps {
  equation?: string;
  enthalpyDelta?: string;
  initialType?: 'carnot' | 'reaction';
}

export const TwoDAnimView: React.FC<TwoDAnimViewProps> = ({
  equation = 'CH₄ + 2O₂ → CO₂ + 2H₂O',
  enthalpyDelta = '-890.4 kJ/mol',
  initialType = 'carnot'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simType, setSimType] = useState<'carnot' | 'reaction'>(initialType);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (initialType) {
      setSimType(initialType);
    }
  }, [initialType]);

  // Carnot physics state
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
    let t = progress;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (simType === 'carnot') {
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

        // Piston head
        const pistonX = cylX + vol * (cylW - 35);
        ctx.fillStyle = '#191816';
        ctx.fillRect(pistonX, cylY + 2, 14, cylH - 4);

        // Piston rod
        ctx.fillRect(pistonX + 14, cylY + cylH / 2 - 4, 60, 8);

        // Gas molecules
        ctx.fillStyle = stage === 1 ? '#ba322a' : stage === 3 ? '#23699c' : '#828078';
        const numParticles = 18;
        for (let i = 0; i < numParticles; i++) {
          const px = cylX + 10 + (Math.sin(t * 5 + i * 1.3) * 0.5 + 0.5) * (pistonX - cylX - 18);
          const py = cylY + 12 + (Math.cos(t * 6 + i * 2.1) * 0.5 + 0.5) * (cylH - 24);
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // P-V Indicator Diagram
        const pvX = 240;
        const pvY = 30;
        const pvW = 190;
        const pvH = 120;

        // Axes
        ctx.strokeStyle = '#d2d0c7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pvX, pvY);
        ctx.lineTo(pvX, pvY + pvH);
        ctx.lineTo(pvX + pvW, pvY + pvH);
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = '#9c9a92';
        ctx.font = '10px monospace';
        ctx.fillText('P', pvX - 12, pvY + 10);
        ctx.fillText('V', pvX + pvW - 10, pvY + pvH + 14);

        // Carnot closed loop
        ctx.strokeStyle = '#191816';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pvX + 30, pvY + 20); // 1
        ctx.quadraticCurveTo(pvX + 75, pvY + 35, pvX + 120, pvY + 45); // 2
        ctx.quadraticCurveTo(pvX + 140, pvY + 80, pvX + 160, pvY + 100); // 3
        ctx.quadraticCurveTo(pvX + 100, pvY + 95, pvX + 60, pvY + 85); // 4
        ctx.closePath();
        ctx.stroke();

        // State indicator on loop
        let indX = pvX + 30;
        let indY = pvY + 20;
        if (stage === 1) {
          indX = pvX + 30 + stageProgress * 90;
          indY = pvY + 20 + stageProgress * 25;
        } else if (stage === 2) {
          indX = pvX + 120 + stageProgress * 40;
          indY = pvY + 45 + stageProgress * 55;
        } else if (stage === 3) {
          indX = pvX + 160 - stageProgress * 100;
          indY = pvY + 100 - stageProgress * 15;
        } else {
          indX = pvX + 60 - stageProgress * 30;
          indY = pvY + 85 - stageProgress * 65;
        }

        ctx.fillStyle = '#1d6935';
        ctx.beginPath();
        ctx.arc(indX, indY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        setProgress(t);
      } else {
        // Mode 2: Chemical Reaction Exothermic Energy Profile
        ctx.beginPath();
        ctx.strokeStyle = '#e5e4df';
        ctx.lineWidth = 2;
        ctx.moveTo(40, h * 0.6);

        // Activation peak
        ctx.bezierCurveTo(w * 0.35, h * 0.6, w * 0.45, h * 0.18, w * 0.55, h * 0.18);
        // Exothermic plunge
        ctx.bezierCurveTo(w * 0.65, h * 0.18, w * 0.75, h * 0.82, w - 40, h * 0.82);
        ctx.stroke();

        // Enthalpy Delta Line
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#962828';
        ctx.beginPath();
        ctx.moveTo(w * 0.82, h * 0.6);
        ctx.lineTo(w * 0.82, h * 0.82);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#962828';
        ctx.font = '11px Geist Mono, monospace';
        ctx.fillText(`ΔH = ${enthalpyDelta}`, w * 0.82 - 75, h * 0.72);

        // Packet along curve
        let curX = 40 + (w - 80) * (progress % 1);
        let curY: number;
        const norm = (progress % 1);
        if (norm < 0.5) {
          const p = norm / 0.5;
          curY = h * 0.6 - (h * 0.42) * Math.sin((p * Math.PI) / 2);
        } else {
          const p = (norm - 0.5) / 0.5;
          curY = h * 0.18 + (h * 0.64) * Math.sin((p * Math.PI) / 2);
        }

        ctx.beginPath();
        ctx.arc(curX, curY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#191816';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#636159';
        ctx.font = '10px sans-serif';
        if (norm < 0.3) {
          ctx.fillText('Reactants (CH₄ + 2O₂)', 40, h * 0.6 - 12);
        } else if (norm > 0.7) {
          ctx.fillText('Products (CO₂ + 2H₂O)', w - 150, h * 0.82 - 12);
        } else {
          ctx.fillText('[Transition Complex ‡]', curX - 45, curY - 14);
        }

        if (isPlaying) {
          t += 0.004;
          setProgress(t);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simType, enthalpyDelta]);

  return (
    <div className="space-y-4 font-sans h-full flex flex-col justify-between">
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">
            {simType === 'carnot'
              ? '2D Ideal Carnot Heat Engine Simulation'
              : '2D Exothermic Reaction Activation Profile'}
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {simType === 'carnot'
              ? 'Procedural HTML5 canvas rendering cyclical expansion/compression strokes.'
              : `Energy coordinates for ${equation} with activation barrier.`}
          </p>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="px-2 py-0.5 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-semibold uppercase text-[10px]">
            {simType === 'carnot' ? 'Carnot Cycle P-V' : 'Reaction Coordinates'}
          </span>
        </div>
      </div>

      <div className="w-full flex items-center justify-center p-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
        <canvas
          ref={canvasRef}
          width={460}
          height={180}
          className="w-full max-w-[460px] h-[180px] bg-white dark:bg-[#1a1918] rounded-xs border border-[var(--border-subtle)]"
        />
      </div>

      {simType === 'carnot' ? (
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#ba322a] font-bold">Hot Reservoir T_H:</span>
                <span>{thCelsius}°C = {thKelvin.toFixed(1)} K</span>
              </div>
              <input
                type="range"
                min={150}
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
              <span className="text-xs uppercase tracking-wider text-[var(--status-high-yield-text)] font-bold">
                Theoretical Carnot Efficiency:
              </span>
              <div className="text-lg font-bold text-[var(--status-high-yield-text)] mt-0.5">
                η = 1 - (T_C / T_H) = {efficiencyPercent}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setProgress(0)}
                className="p-1 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setProgress(0)}
              className="p-1.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-[var(--text-secondary)] ml-2">
              Reaction Progress: {Math.round((progress % 1) * 100)}%
            </span>
          </div>
          <div className="text-xs text-[var(--text-primary)] font-bold">
            {equation}
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoDAnimView;
