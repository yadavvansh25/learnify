'use client';

import React, { useRef, useEffect } from 'react';

export type VoiceState = 'idle' | 'listening' | 'speaking' | 'thinking';

interface VoiceBlobProps {
  state?: VoiceState;
  level?: number; // 0.0 to 1.0 (audio input level)
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const VoiceBlob: React.FC<VoiceBlobProps> = ({
  state = 'idle',
  level = 0.5,
  size = 130,
  className = '',
  onClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleOffset = 0;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = size * 0.32;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      let speed = 0.02;
      let waveCount = 5;
      let amplitude = 4;
      let ringCount = 2;

      if (state === 'listening') {
        speed = 0.05;
        waveCount = 7;
        amplitude = 6 + level * 10;
        ringCount = 3;
      } else if (state === 'thinking') {
        speed = 0.08;
        waveCount = 9;
        amplitude = 6;
        ringCount = 4;
      } else if (state === 'speaking') {
        speed = 0.06;
        waveCount = 6;
        amplitude = 10 + Math.sin(angleOffset * 4) * 4;
        ringCount = 3;
      }

      angleOffset += speed;

      // Echo rings for speaking/listening
      for (let r = 0; r < ringCount; r++) {
        const ringScale = 1 + (r * 0.16) + (Math.sin(angleOffset * 2 + r) * 0.04);
        const ringOpacity = Math.max(0.04, 0.16 - r * 0.05);

        ctx.beginPath();
        const numPoints = 60;
        for (let i = 0; i <= numPoints; i++) {
          const theta = (i / numPoints) * Math.PI * 2;
          const offsetRadius = baseRadius * ringScale + Math.sin(theta * waveCount + angleOffset + r) * (amplitude * 0.4);
          const x = centerX + Math.cos(theta) * offsetRadius;
          const y = centerY + Math.sin(theta) * offsetRadius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(100, 100, 95, ${ringOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Main organic deformation orb
      ctx.beginPath();
      const numPoints = 80;
      for (let i = 0; i <= numPoints; i++) {
        const theta = (i / numPoints) * Math.PI * 2;
        const deformation = Math.sin(theta * waveCount + angleOffset) * amplitude +
                            Math.cos(theta * 2 - angleOffset * 1.5) * (amplitude * 0.5);
        const currentRadius = baseRadius + deformation;
        const x = centerX + Math.cos(theta) * currentRadius;
        const y = centerY + Math.sin(theta) * currentRadius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const isDarkMode = document.documentElement.classList.contains('dark');
      const gradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        baseRadius * 0.1,
        centerX,
        centerY,
        baseRadius * 1.2
      );

      if (isDarkMode) {
        gradient.addColorStop(0, '#edece8');
        gradient.addColorStop(0.7, '#a3a199');
        gradient.addColorStop(1, '#2b2a28');
      } else {
        gradient.addColorStop(0, '#191816');
        gradient.addColorStop(0.7, '#42403b');
        gradient.addColorStop(1, '#828078');
      }

      ctx.fillStyle = gradient;
      ctx.fill();

      // Specular reflection
      ctx.beginPath();
      ctx.arc(centerX - baseRadius * 0.28, centerY - baseRadius * 0.28, baseRadius * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.35)';
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [state, level, size]);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      <canvas ref={canvasRef} className="rounded-full shadow-xs" />
      <span className="mt-2 font-mono text-[11px] font-semibold tracking-wider uppercase text-[var(--text-secondary)]">
        {state === 'idle' && 'Tap to Speak Viva'}
        {state === 'listening' && 'Listening Oral Viva...'}
        {state === 'thinking' && 'Analyzing Concept...'}
        {state === 'speaking' && 'Evaluating Response...'}
      </span>
    </div>
  );
};
export default VoiceBlob;
