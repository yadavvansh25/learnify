'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MarkBadge } from '../shared/MarkBadge';

export interface AtomData {
  elem: string;
  pos: [number, number, number];
  color: string;
  radius: number;
}

interface ThreeDViewProps {
  initialHarmonic?: number;
  atoms?: AtomData[];
}

export const ThreeDView: React.FC<ThreeDViewProps> = ({
  initialHarmonic = 2,
  atoms
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [harmonicN, setHarmonicN] = useState<number>(initialHarmonic);
  const [spinSpeed, setSpinSpeed] = useState<number>(1);
  const [wireframe, setWireframe] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'manifold' | 'molecular'>(atoms ? 'molecular' : 'manifold');

  const defaultAtoms: AtomData[] = atoms || [
    { elem: 'C', pos: [0, 0, 0], color: '#333333', radius: 0.45 },
    { elem: 'H', pos: [0.7, 0.7, 0.7], color: '#9c9a92', radius: 0.22 },
    { elem: 'H', pos: [-0.7, -0.7, 0.7], color: '#9c9a92', radius: 0.22 },
    { elem: 'H', pos: [-0.7, 0.7, -0.7], color: '#9c9a92', radius: 0.22 },
    { elem: 'H', pos: [0.7, -0.7, -0.7], color: '#9c9a92', radius: 0.22 },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 280;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f5f2);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.2, 2.4, 4.5);

    // 3. Renderer with antialiasing & DPR capped at 2
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls with auto-damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0 * spinSpeed;

    // 5. Lighting (ambient 0.8 + directional 1.4)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xdde3ea, 0.5);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const rootGroup = new THREE.Group();

    // Render Mode 1: Quantum Wave Manifold
    if (viewMode === 'manifold') {
      const geometry = new THREE.TorusKnotGeometry(1.3, 0.38, 100, 16, harmonicN, 3);
      const material = new THREE.MeshNormalMaterial({ wireframe });
      const mesh = new THREE.Mesh(geometry, material);
      rootGroup.add(mesh);

      // Central Nucleus Core
      const coreGeo = new THREE.SphereGeometry(0.32, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x191816, roughness: 0.3 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      rootGroup.add(core);
    } else {
      // Render Mode 2: Molecular Atoms & Bonds
      const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
      defaultAtoms.forEach((atom) => {
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(atom.color),
          roughness: 0.25,
          metalness: 0.1,
        });
        const mesh = new THREE.Mesh(sphereGeo, mat);
        mesh.scale.setScalar(atom.radius);
        mesh.position.set(...atom.pos);
        rootGroup.add(mesh);
      });

      // Bonds from central atom (index 0) to outer atoms
      if (defaultAtoms.length > 1) {
        const centerAtom = defaultAtoms[0];
        const cylinderGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 16);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0x9c9a92, roughness: 0.4 });

        for (let i = 1; i < defaultAtoms.length; i++) {
          const outer = defaultAtoms[i];
          const vCenter = new THREE.Vector3(...centerAtom.pos);
          const vOuter = new THREE.Vector3(...outer.pos);
          const distance = vCenter.distanceTo(vOuter);
          const midPoint = new THREE.Vector3().addVectors(vCenter, vOuter).multiplyScalar(0.5);

          const bondMesh = new THREE.Mesh(cylinderGeo, bondMat);
          bondMesh.scale.set(1, distance, 1);
          bondMesh.position.copy(midPoint);

          const orientation = new THREE.Vector3().subVectors(vOuter, vCenter).normalize();
          const axis = new THREE.Vector3(0, 1, 0);
          bondMesh.quaternion.setFromUnitVectors(axis, orientation);
          rootGroup.add(bondMesh);
        }
      }
    }

    scene.add(rootGroup);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [harmonicN, spinSpeed, wireframe, viewMode, atoms]);

  return (
    <div className="space-y-4 font-sans h-full flex flex-col justify-between">
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">
            Three.js WebGL 3D Spatial Scene
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {viewMode === 'manifold'
              ? 'Rotatable 3D manifold rendering molecular wave mechanics and angular momentum.'
              : 'Interactive tetrahedral molecular geometry with Pauling bond angles (109.5°).'}
          </p>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setViewMode('manifold')}
            className={`px-2 py-0.5 rounded-xs border cursor-pointer ${viewMode === 'manifold' ? 'bg-[var(--text-primary)] text-white' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'}`}
          >
            Manifold
          </button>
          <button
            onClick={() => setViewMode('molecular')}
            className={`px-2 py-0.5 rounded-xs border cursor-pointer ${viewMode === 'molecular' ? 'bg-[var(--text-primary)] text-white' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'}`}
          >
            Tetrahedral
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full h-72 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] overflow-hidden shadow-xs relative"
      >
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[var(--text-tertiary)] bg-[var(--surface-overlay)] px-2 py-1 rounded border border-[var(--border-subtle)] pointer-events-none">
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] font-mono text-xs">
        <div>
          <label className="block text-[var(--text-secondary)] mb-1">
            Harmonic n: {harmonicN}
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
            Orbit Speed: {spinSpeed}x
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

export default ThreeDView;
