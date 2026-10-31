'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Box,
  Activity,
  LineChart,
  FileCode,
  Info
} from 'lucide-react';
import { FormulaRenderer } from '../shared/FormulaRenderer';
import { MarkBadge } from '../shared/MarkBadge';

type VisualizerMode = 'ThreeDView' | 'TwoDAnimView' | 'FormulaView' | 'GraphView' | 'TwoDTextView';

export const VisualizerView: React.FC = () => {
  const [activeMode, setActiveMode] = useState<VisualizerMode>('TwoDAnimView');

  // Controls for Carnot Engine Simulation (TwoDAnimView)
  const [thCelsius, setThCelsius] = useState<number>(327); // 600 K
  const [tcCelsius, setTcCelsius] = useState<number>(27);  // 300 K
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cycleStep, setCycleStep] = useState<number>(1); // 1: Iso Exp, 2: Adia Exp, 3: Iso Comp, 4: Adia Comp
  const [pistonPosition, setPistonPosition] = useState<number>(0.2);

  // Computed values
  const thKelvin = thCelsius + 273.15;
  const tcKelvin = tcCelsius + 273.15;
  const carnotEfficiency = Math.max(0, 1 - (tcKelvin / thKelvin));
  const workExtractedPercent = (carnotEfficiency * 100).toFixed(1);

  // Canvas ref for 2D Animation
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);

  // Three.js container ref
  const threeContainerRef = useRef<HTMLDivElement | null>(null);
  const [orbitalN, setOrbitalN] = useState<number>(2);
  const [spinSpeed, setSpinSpeed] = useState<number>(1);

  // 1. TwoDAnimView: HTML5 Canvas Carnot Cycle & P-V Indicator
  useEffect(() => {
    if (activeMode !== 'TwoDAnimView') return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Advance time if playing
      if (isPlaying) {
        t += 0.015;
      }

      // 4-stage cycle calculation based on t modulo 4
      const stage = (Math.floor(t) % 4) + 1;
      setCycleStep(stage);

      const stageProgress = t % 1;
      // Calculate continuous piston volume
      let vol = 0.2;
      if (stage === 1) vol = 0.2 + stageProgress * 0.4; // 1->2 Isothermal Expansion
      else if (stage === 2) vol = 0.6 + stageProgress * 0.3; // 2->3 Adiabatic Expansion
      else if (stage === 3) vol = 0.9 - stageProgress * 0.4; // 3->4 Isothermal Compression
      else vol = 0.5 - stageProgress * 0.3; // 4->1 Adiabatic Compression
      setPistonPosition(vol);

      // --- LEFT HALF: PISTON & CYLINDER VISUALIZATION ---
      const cylX = 30;
      const cylY = 40;
      const cylW = 160;
      const cylH = 110;

      // Draw Cylinder chamber walls
      ctx.strokeStyle = '#636159';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cylX, cylY);
      ctx.lineTo(cylX + cylW, cylY);
      ctx.moveTo(cylX, cylY + cylH);
      ctx.lineTo(cylX + cylW, cylY + cylH);
      ctx.moveTo(cylX, cylY);
      ctx.lineTo(cylX, cylY + cylH); // Cylinder base
      ctx.stroke();

      // Gas fill with temperature color
      const isHot = stage === 1 || stage === 4;
      const gasFill = isHot
        ? 'rgba(217, 83, 79, 0.25)' // Warm tint during T_H
        : 'rgba(91, 192, 222, 0.25)'; // Cool tint during T_C

      const pistonX = cylX + (cylW - 20) * vol;
      ctx.fillStyle = gasFill;
      ctx.fillRect(cylX + 2, cylY + 2, pistonX - cylX, cylH - 4);

      // Gas molecules animation
      ctx.fillStyle = isHot ? '#d9534f' : '#337ab7';
      for (let i = 0; i < 14; i++) {
        const mx = cylX + 15 + ((i * 37 + t * 40) % Math.max(10, (pistonX - cylX - 25)));
        const my = cylY + 12 + ((i * 23 + Math.sin(t * 3 + i) * 15) % (cylH - 24));
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Piston face and connecting rod
      ctx.fillStyle = '#191816';
      ctx.fillRect(pistonX, cylY + 2, 12, cylH - 4);
      ctx.fillRect(pistonX + 12, cylY + cylH / 2 - 4, 40, 8); // Rod

      // Reservoir Thermal Interaction Arrow
      ctx.font = '10px monospace';
      if (stage === 1) {
        ctx.fillStyle = '#b93838';
        ctx.fillText(`Heat In: Q_H (at ${thKelvin.toFixed(0)} K)`, cylX + 10, cylY + cylH + 24);
      } else if (stage === 3) {
        ctx.fillStyle = '#23699c';
        ctx.fillText(`Heat Out: Q_C (at ${tcKelvin.toFixed(0)} K)`, cylX + 10, cylY + cylH + 24);
      } else {
        ctx.fillStyle = '#636159';
        ctx.fillText('Insulated: dQ = 0 (Adiabatic)', cylX + 10, cylY + cylH + 24);
      }

      // --- RIGHT HALF: P-V INDICATOR DIAGRAM ---
      const pvX = 230;
      const pvY = 30;
      const pvW = 160;
      const pvH = 130;

      // Axes
      ctx.strokeStyle = '#9c9a92';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Y axis (Pressure)
      ctx.moveTo(pvX, pvY);
      ctx.lineTo(pvX, pvY + pvH);
      // X axis (Volume)
      ctx.lineTo(pvX + pvW, pvY + pvH);
      ctx.stroke();

      ctx.fillStyle = '#636159';
      ctx.font = '9px monospace';
      ctx.fillText('P (Pressure)', pvX - 5, pvY - 8);
      ctx.fillText('V (Volume)', pvX + pvW - 20, pvY + pvH + 15);

      // Define 4 Carnot Loop Points on P-V
      const p1 = { x: pvX + 25, y: pvY + 20 };  // State 1: High P, Low V
      const p2 = { x: pvX + 75, y: pvY + 45 };  // State 2: Isothermal Exp
      const p3 = { x: pvX + 145, y: pvY + 110 }; // State 3: Adiabatic Exp
      const p4 = { x: pvX + 60, y: pvY + 95 };  // State 4: Isothermal Comp

      // Closed cycle curve
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(pvX + 50, pvY + 30, p2.x, p2.y); // 1->2 Iso Exp
      ctx.quadraticCurveTo(pvX + 110, pvY + 75, p3.x, p3.y); // 2->3 Adia Exp
      ctx.quadraticCurveTo(pvX + 100, pvY + 105, p4.x, p4.y); // 3->4 Iso Comp
      ctx.quadraticCurveTo(pvX + 35, pvY + 55, p1.x, p1.y); // 4->1 Adia Comp
      ctx.closePath();

      // Enclosed work area
      ctx.fillStyle = 'rgba(29, 105, 53, 0.12)';
      ctx.fill();
      ctx.strokeStyle = '#1d6935';
      ctx.lineWidth = 2;
      ctx.stroke();

      // State points labels
      ctx.fillStyle = '#191816';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('1', p1.x - 10, p1.y);
      ctx.fillText('2', p2.x + 6, p2.y);
      ctx.fillText('3', p3.x + 6, p3.y);
      ctx.fillText('4', p4.x - 10, p4.y);

      // Work Net label in loop center
      ctx.fillStyle = '#1d6935';
      ctx.fillText('W_net', pvX + 70, pvY + 70);

      // Current moving cursor on the P-V path
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
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeMode, isPlaying, thKelvin, tcKelvin]);

  // 2. ThreeDView: WebGL Three.js 3D Spatial Mechanics & Orbitals
  useEffect(() => {
    if (activeMode !== 'ThreeDView') return;
    const container = threeContainerRef.current;
    if (!container) return;

    // Clear previous elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 400;
    const height = 240;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f5f2);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create 3D Atomic Electron Cloud / Torus Knot
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 100, 16, orbitalN, 3);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Nucleus core sphere
    const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x191816, roughness: 0.3 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    let animId: number;
    const animate = () => {
      torusKnot.rotation.x += 0.008 * spinSpeed;
      torusKnot.rotation.y += 0.012 * spinSpeed;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
    };
  }, [activeMode, orbitalN, spinSpeed]);

  return (
    <div className="h-full flex flex-col bg-[var(--surface-raised)] overflow-y-auto">
      {/* Visualizer Mode Header Navigation */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
            Interactive Visualizer Suite
          </span>
          <MarkBadge variant="mono" text="5 Modes" />
        </div>

        {/* 5 Mode Selector Buttons */}
        <div className="flex items-center gap-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-0.5 rounded-sm">
          <button
            onClick={() => setActiveMode('TwoDAnimView')}
            className={`px-2 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              activeMode === 'TwoDAnimView'
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            2D Carnot
          </button>
          <button
            onClick={() => setActiveMode('ThreeDView')}
            className={`px-2 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              activeMode === 'ThreeDView'
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            3D WebGL
          </button>
          <button
            onClick={() => setActiveMode('FormulaView')}
            className={`px-2 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              activeMode === 'FormulaView'
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Formula
          </button>
          <button
            onClick={() => setActiveMode('GraphView')}
            className={`px-2 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              activeMode === 'GraphView'
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Graph
          </button>
          <button
            onClick={() => setActiveMode('TwoDTextView')}
            className={`px-2 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
              activeMode === 'TwoDTextView'
                ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Flowtree
          </button>
        </div>
      </div>

      {/* Main Mode View Area */}
      <div className="p-4 flex-1 space-y-4">
        {/* MODE 1: TwoDAnimView (HTML5 Canvas Carnot Cycle & Indicator) */}
        {activeMode === 'TwoDAnimView' && (
          <div className="space-y-4">
            <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-sans font-bold text-sm text-[var(--text-primary)]">
                    Carnot Heat Engine & P-V Indicator
                  </h4>
                  <MarkBadge variant="high_yield" text="High Exam Yield" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Live reversible 4-stroke cycle with absolute thermodynamic temperatures.
                </p>
              </div>

              {/* Play / Pause / Step Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause Cycle' : 'Play Cycle'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setTcCelsius(27)}
                  className="p-1.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Reset Temperatures"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Animation Screen */}
            <div className="rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] overflow-hidden flex justify-center py-2 shadow-xs">
              <canvas
                ref={canvas2dRef}
                width={420}
                height={190}
                className="max-w-full h-auto"
              />
            </div>

            {/* Current Stage Indicator Banner */}
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
              <div className={`p-2 rounded-xs border ${cycleStep === 1 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
                1. Iso Exp (T_H)
              </div>
              <div className={`p-2 rounded-xs border ${cycleStep === 2 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
                2. Adia Exp (Q=0)
              </div>
              <div className={`p-2 rounded-xs border ${cycleStep === 3 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
                3. Iso Comp (T_C)
              </div>
              <div className={`p-2 rounded-xs border ${cycleStep === 4 ? 'border-[var(--text-primary)] bg-[var(--surface-sunken)] font-bold' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
                4. Adia Comp (Q=0)
              </div>
            </div>

            {/* Interactive Sliders: Reservoir Temperatures in Celsius & Kelvin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-[#b93838]">Hot Reservoir T_H:</span>
                  <span>{thCelsius}°C = <strong className="text-[var(--text-primary)]">{thKelvin.toFixed(1)} K</strong></span>
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
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-semibold text-[#23699c]">Cold Sink T_C:</span>
                  <span>{tcCelsius}°C = <strong className="text-[var(--text-primary)]">{tcKelvin.toFixed(1)} K</strong></span>
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

            {/* Live Efficiency Output */}
            <div className="p-3 rounded-sm border border-[#c4e3cb] dark:border-[#1e3b26] bg-[var(--status-high-yield)] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--status-high-yield-text)] font-bold">
                  Theoretical Carnot Efficiency:
                </span>
                <div className="font-mono text-xl font-bold text-[var(--status-high-yield-text)] mt-0.5">
                  η = 1 - (T_C / T_H) = {workExtractedPercent}%
                </div>
              </div>
              <MarkBadge marks={5} text="PYQ 2024 Exam Match" />
            </div>
          </div>
        )}

        {/* MODE 2: ThreeDView (Three.js WebGL 3D Quantum Orbitals) */}
        {activeMode === 'ThreeDView' && (
          <div className="space-y-4">
            <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
              <h4 className="font-sans font-bold text-sm text-[var(--text-primary)]">
                Three.js WebGL 3D Spatial Quantum State
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Rotatable 3D manifold rendering molecular wave mechanics and angular momentum orbitals.
              </p>
            </div>

            <div
              ref={threeContainerRef}
              className="w-full h-64 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] overflow-hidden shadow-xs"
            />

            <div className="grid grid-cols-2 gap-3 p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] font-mono text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Orbital Harmonic n: {orbitalN}
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={orbitalN}
                  onChange={(e) => setOrbitalN(Number(e.target.value))}
                  className="w-full accent-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Rotation Spin Speed: {spinSpeed}x
                </label>
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.2}
                  value={spinSpeed}
                  onChange={(e) => setSpinSpeed(Number(e.target.value))}
                  className="w-full accent-[var(--text-primary)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: FormulaView (KaTeX Derivation & Interactive Parameter Dictionary) */}
        {activeMode === 'FormulaView' && (
          <div className="space-y-4 font-sans">
            <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                Step-by-Step KaTeX Derivation & Variable Dictionary
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Expandable derivation breakdown with official marking scheme point allocations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                    Step 1: First Law for Reversible Isothermal Expansion
                  </span>
                  <MarkBadge marks={1} />
                </div>
                <FormulaRenderer math="dU = \\delta Q - \\delta W = 0 \\implies Q_H = W = \\int_{V_1}^{V_2} P \\, dV" block />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Since internal energy $U$ depends solely on temperature for an ideal gas, $\Delta U = 0$.
                </p>
              </div>

              <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                    Step 2: Integration of Ideal Gas Law
                  </span>
                  <MarkBadge marks={2} />
                </div>
                <FormulaRenderer math="W = \\int_{V_1}^{V_2} \\frac{nRT_H}{V} \\, dV = nRT_H \\ln\\left(\\frac{V_2}{V_1}\\right)" block />
                <div className="mt-2 p-2 rounded-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)]">
                  <strong>Examiner Note:</strong> Applying constant pressure $W = P(V_2 - V_1)$ here is penalised with 0 marks.
                </div>
              </div>

              <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                    Step 3: Overall Efficiency Ratio
                  </span>
                  <MarkBadge marks={2} />
                </div>
                <FormulaRenderer math="\\eta = \\frac{W_{\\text{net}}}{Q_H} = \\frac{Q_H - |Q_C|}{Q_H} = 1 - \\frac{T_C}{T_H}" block />
              </div>
            </div>
          </div>
        )}

        {/* MODE 4: GraphView (Interactive Coordinate Plot & Resonance Curves) */}
        {activeMode === 'GraphView' && (
          <div className="space-y-4">
            <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
              <h4 className="font-sans font-bold text-sm text-[var(--text-primary)]">
                Planck Spectral Radiance & Carnot Limit Curve
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Thermal efficiency $\eta(T_H)$ plotted against heat reservoir temperature.
              </p>
            </div>

            <div className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] font-mono">
              <div className="text-xs text-[var(--text-secondary)] mb-2">
                {"Plot: η = 1 - (298.15 / T_H) where T_C = 25°C (298 K)"}
              </div>

              {/* SVG Coordinate Plot */}
              <svg viewBox="0 0 360 140" className="w-full h-36 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xs">
                {/* Grid lines */}
                <line x1="40" y1="20" x2="40" y2="120" stroke="var(--border-subtle)" strokeWidth="1" />
                <line x1="40" y1="120" x2="340" y2="120" stroke="var(--border-subtle)" strokeWidth="1" />

                {/* Efficiency Curve */}
                <path
                  d="M 40,120 Q 120,60 340,35"
                  fill="none"
                  stroke="#1d6935"
                  strokeWidth="2.5"
                />

                {/* Asymptote η = 1.0 (100%) */}
                <line x1="40" y1="25" x2="340" y2="25" stroke="#962828" strokeDasharray="3,3" strokeWidth="1" />
                <text x="250" y="20" fontSize="8" fill="#962828">Theoretical Limit η = 100%</text>

                {/* Axis markers */}
                <text x="15" y="28" fontSize="8" fill="var(--text-tertiary)">1.0</text>
                <text x="15" y="70" fontSize="8" fill="var(--text-tertiary)">0.5</text>
                <text x="15" y="122" fontSize="8" fill="var(--text-tertiary)">0.0</text>

                <text x="40" y="132" fontSize="8" fill="var(--text-tertiary)">300 K</text>
                <text x="180" y="132" fontSize="8" fill="var(--text-tertiary)">600 K</text>
                <text x="310" y="132" fontSize="8" fill="var(--text-tertiary)">1000 K</text>
              </svg>
            </div>
          </div>
        )}

        {/* MODE 5: TwoDTextView (ASCII / Mermaid State Machine Flowtree) */}
        {activeMode === 'TwoDTextView' && (
          <div className="space-y-4">
            <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
              <h4 className="font-sans font-bold text-sm text-[var(--text-primary)]">
                Algorithmic State Flowtree (Mermaid / ASCII)
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Thermodynamic state machine cycle representation.
              </p>
            </div>

            <pre className="p-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] font-mono text-xs leading-relaxed text-[var(--text-primary)] overflow-x-auto selection:bg-[#c4e3cb]">
{`┌────────────────────────────────────────────────────────┐
│             CARNOT 4-STAGE CYCLIC MACHINE              │
└────────────────────────────────────────────────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │ State 1: (P1, V1, T_H)        │
       └───────────────────────────────┘
                       │
                       │  Isothermal Expansion [Absorbs Q_H]
                       │  ΔU = 0, W1->2 = nRT_H ln(V2/V1)
                       ▼
       ┌───────────────────────────────┐
       │ State 2: (P2, V2, T_H)        │
       └───────────────────────────────┘
                       │
                       │  Adiabatic Expansion [dQ = 0]
                       │  PV^γ = const, T cools to T_C
                       ▼
       ┌───────────────────────────────┐
       │ State 3: (P3, V3, T_C)        │
       └───────────────────────────────┘
                       │
                       │  Isothermal Compression [Rejects Q_C]
                       │  W_on = nRT_C ln(V3/V4)
                       ▼
       ┌───────────────────────────────┐
       │ State 4: (P4, V4, T_C)        │
       └───────────────────────────────┘
                       │
                       │  Adiabatic Compression [dQ = 0]
                       │  Work raises temperature back to T_H
                       ▼
               [Loop Closed: State 1]`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
