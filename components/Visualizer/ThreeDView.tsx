'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MarkBadge } from '../shared/MarkBadge';

interface ThreeDViewProps {
  initialHarmonic?: number;
}

export const ThreeDView: React.FC<ThreeDViewProps> = ({ initialHarmonic = 2 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [harmonicN, setHarmonicN] = useState<number>(initialHarmonic);
  const [spinSpeed, setSpinSpeed] = useState<number>(1);
  const [wireframe, setWireframe] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 450;
    const height = 280;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f5f2);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Dynamic 3D Manifold Geometry
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 100, 16, harmonicN, 3);
    const material = new THREE.MeshNormalMaterial({ wireframe });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Central Nucleus Core
    const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x191816, roughness: 0.3 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    let animId: number;
    const animate = () => {
      mesh.rotation.x += 0.008 * spinSpeed;
      mesh.rotation.y += 0.012 * spinSpeed;
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
  }, [harmonicN, spinSpeed, wireframe]);

  return (
    <div className="space-y-4 font-sans">
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">
            Three.js WebGL 3D Spatial Quantum State
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Rotatable 3D manifold rendering molecular wave mechanics and angular momentum orbitals.
          </p>
        </div>
        <MarkBadge variant="high_yield" text="WebGL Accelerated" />
      </div>

      <div
        ref={containerRef}
        className="w-full h-72 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] overflow-hidden shadow-xs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] font-mono text-xs">
        <div>
          <label className="block text-[var(--text-secondary)] mb-1">
            Orbital Harmonic n: {harmonicN}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={harmonicN}
            onChange={(e) => setHarmonicN(Number(e.target.value))}
            className="w-full accent-[var(--text-primary)]"
          />
        </div>
        <div>
          <label className="block text-[var(--text-secondary)] mb-1">
            Rotation Speed: {spinSpeed}x
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
        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="wireframe-toggle"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
            className="accent-[var(--text-primary)]"
          />
          <label htmlFor="wireframe-toggle" className="text-[var(--text-primary)] cursor-pointer">
            Wireframe Mesh
          </label>
        </div>
      </div>
    </div>
  );
};
