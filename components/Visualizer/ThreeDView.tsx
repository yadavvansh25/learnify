'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MarkBadge } from '../shared/MarkBadge';
import { Allowed3DModel, Visualizer3DType } from '@/lib/subjects-data';
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

export interface AtomData {
  elem: string;
  pos: [number, number, number];
  color: string;
  radius: number;
}

interface ThreeDViewProps {
  initialType?: Visualizer3DType;
  atoms?: AtomData[];
  title?: string;
  category?: string;
  allowedModels?: Allowed3DModel[];
  onSelectModel?: (type: Visualizer3DType) => void;
}

export const ThreeDView: React.FC<ThreeDViewProps> = ({
  initialType = 'molecule',
  atoms,
  title,
  category,
  allowedModels,
  onSelectModel
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [modelType, setModelType] = useState<Visualizer3DType>(initialType);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(() => {
    if (allowedModels && allowedModels.length > 0) {
      const match = allowedModels.find((m) => m.type === initialType);
      return match ? match.id : allowedModels[0].id;
    }
    return undefined;
  });
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (initialType) {
      setModelType(initialType);
      if (allowedModels && allowedModels.length > 0) {
        const match = allowedModels.find((m) => m.type === initialType);
        setSelectedModelId(match ? match.id : allowedModels[0].id);
      }
    }
  }, [initialType, allowedModels]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 300;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f5f2);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.8, 2.8, 4.8);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing & DPR capped at 2
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls with damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 1.2 * speed;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(6, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xdbe3ea, 0.5);
    dirLight2.position.set(-6, -6, -6);
    scene.add(dirLight2);

    // Root Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ----------------------------------------------------
    // BUILD SPECIFIC 3D MODELS
    // ----------------------------------------------------
    const animUpdaters: Array<(delta: number) => void> = [];

    // Helper: create cylinder bond between two Vector3 points
    const createCylinderLink = (
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      radius: number = 0.04,
      color: number = 0x9c9a92
    ) => {
      const distance = p1.distanceTo(p2);
      const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const geo = new THREE.CylinderGeometry(radius, radius, distance, 16);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(midPoint);
      const orientation = new THREE.Vector3().subVectors(p2, p1).normalize();
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), orientation);
      return mesh;
    };

    if (modelType === 'molecule') {
      // 1. CHEMISTRY: Ball-and-Stick Tetrahedral Molecule (Methane CH4)
      const carbonGeo = new THREE.SphereGeometry(0.48, 32, 32);
      const carbonMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.25 });
      const carbon = new THREE.Mesh(carbonGeo, carbonMat);
      modelGroup.add(carbon);

      const d = 1.25 / Math.sqrt(3);
      const hydrogenPositions = [
        new THREE.Vector3(d, d, d),
        new THREE.Vector3(-d, -d, d),
        new THREE.Vector3(-d, d, -d),
        new THREE.Vector3(d, -d, -d),
      ];

      const hGeo = new THREE.SphereGeometry(0.24, 32, 32);
      const hMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.3 });

      hydrogenPositions.forEach((pos) => {
        const hMesh = new THREE.Mesh(hGeo, hMat);
        hMesh.position.copy(pos);
        modelGroup.add(hMesh);
        modelGroup.add(createCylinderLink(new THREE.Vector3(0, 0, 0), pos, 0.05, 0x8a8880));
      });
    } else if (modelType === 'binary-tree') {
      // 2. CODING: 3D Hierarchical Binary Search Tree
      interface TreeNode {
        pos: [number, number, number];
        val: number;
        active?: boolean;
      }
      const treeNodes: TreeNode[] = [
        { pos: [0, 1.4, 0], val: 50, active: true },
        { pos: [-1.4, 0.3, 0], val: 25 },
        { pos: [1.4, 0.3, 0], val: 75, active: true },
        { pos: [-2.1, -0.8, 0], val: 12 },
        { pos: [-0.7, -0.8, 0], val: 37 },
        { pos: [0.7, -0.8, 0], val: 62, active: true },
        { pos: [2.1, -0.8, 0], val: 88 },
      ];

      const links: Array<[number, number]> = [
        [0, 1], [0, 2],
        [1, 3], [1, 4],
        [2, 5], [2, 6]
      ];

      const nodeGeo = new THREE.SphereGeometry(0.3, 32, 32);
      const activeMat = new THREE.MeshStandardMaterial({
        color: 0x1d6935,
        emissive: 0x1d6935,
        emissiveIntensity: 0.4,
        roughness: 0.2
      });
      const normalMat = new THREE.MeshStandardMaterial({ color: 0x186ba0, roughness: 0.3 });

      treeNodes.forEach((node) => {
        const mesh = new THREE.Mesh(nodeGeo, node.active ? activeMat : normalMat);
        mesh.position.set(...node.pos);
        modelGroup.add(mesh);
      });

      links.forEach(([fromIdx, toIdx]) => {
        const from = new THREE.Vector3(...treeNodes[fromIdx].pos);
        const to = new THREE.Vector3(...treeNodes[toIdx].pos);
        const isActiveLink = treeNodes[fromIdx].active && treeNodes[toIdx].active;
        modelGroup.add(createCylinderLink(from, to, 0.035, isActiveLink ? 0x1d6935 : 0xa0a09a));
      });
    } else if (modelType === 'dna-helix') {
      // 3. BIOLOGY: Procedural 3D DNA Double Helix
      const numRungs = 24;
      const helixRadius = 0.9;
      const heightStep = 0.14;
      const angleStep = 0.38;

      const backbone1Points: THREE.Vector3[] = [];
      const backbone2Points: THREE.Vector3[] = [];

      const baseColors = [0x1d6935, 0xba322a, 0x186ba0, 0xd48806];

      for (let i = 0; i < numRungs; i++) {
        const angle = i * angleStep;
        const y = (i - numRungs / 2) * heightStep;
        const p1 = new THREE.Vector3(Math.cos(angle) * helixRadius, y, Math.sin(angle) * helixRadius);
        const p2 = new THREE.Vector3(Math.cos(angle + Math.PI) * helixRadius, y, Math.sin(angle + Math.PI) * helixRadius);

        backbone1Points.push(p1);
        backbone2Points.push(p2);

        // Strand atoms
        const bbAtomGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const bbAtomMat = new THREE.MeshStandardMaterial({ color: 0x6b3fa0 });
        const m1 = new THREE.Mesh(bbAtomGeo, bbAtomMat);
        m1.position.copy(p1);
        const m2 = new THREE.Mesh(bbAtomGeo, bbAtomMat);
        m2.position.copy(p2);
        modelGroup.add(m1);
        modelGroup.add(m2);

        // Base pair connecting rung
        const rungColor = baseColors[i % baseColors.length];
        modelGroup.add(createCylinderLink(p1, p2, 0.03, rungColor));
      }

      // Smooth tube backbones
      const curve1 = new THREE.CatmullRomCurve3(backbone1Points);
      const tubeGeo1 = new THREE.TubeGeometry(curve1, 64, 0.04, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x6b3fa0, roughness: 0.3 });
      modelGroup.add(new THREE.Mesh(tubeGeo1, tubeMat));

      const curve2 = new THREE.CatmullRomCurve3(backbone2Points);
      const tubeGeo2 = new THREE.TubeGeometry(curve2, 64, 0.04, 8, false);
      modelGroup.add(new THREE.Mesh(tubeGeo2, tubeMat));
    } else if (modelType === 'pendulum') {
      // 4. PHYSICS: Oscillating Simple Harmonic Pendulum with Vectors
      const pivot = new THREE.Vector3(0, 1.6, 0);
      const pivotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pivotMat = new THREE.MeshStandardMaterial({ color: 0x191816 });
      const pivotMesh = new THREE.Mesh(pivotGeo, pivotMat);
      pivotMesh.position.copy(pivot);
      modelGroup.add(pivotMesh);

      const pendulumArm = new THREE.Group();
      pendulumArm.position.copy(pivot);
      modelGroup.add(pendulumArm);

      const armLength = 2.4;
      const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, armLength, 16);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0x636159 });
      const rodMesh = new THREE.Mesh(rodGeo, rodMat);
      rodMesh.position.set(0, -armLength / 2, 0);
      pendulumArm.add(rodMesh);

      const bobGeo = new THREE.SphereGeometry(0.38, 32, 32);
      const bobMat = new THREE.MeshStandardMaterial({ color: 0x9e5207, metalness: 0.6, roughness: 0.2 });
      const bobMesh = new THREE.Mesh(bobGeo, bobMat);
      bobMesh.position.set(0, -armLength, 0);
      pendulumArm.add(bobMesh);

      // Tangent velocity vector arrow
      const vArrow = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, -armLength, 0),
        0.8,
        0x1d6935,
        0.2,
        0.1
      );
      pendulumArm.add(vArrow);

      let pTime = 0;
      animUpdaters.push((delta) => {
        pTime += delta * 2.2 * speed;
        const maxAngle = Math.PI / 4.5;
        const currentAngle = maxAngle * Math.sin(pTime);
        pendulumArm.rotation.z = currentAngle;
        const velMag = Math.cos(pTime);
        vArrow.setDirection(new THREE.Vector3(velMag > 0 ? 1 : -1, 0, 0));
        vArrow.setLength(Math.max(0.2, Math.abs(velMag) * 0.9));
      });
    } else if (modelType === 'vector-field') {
      // 5. MATHEMATICS: 3D Surface & Coordinate Grid
      const axesHelper = new THREE.AxesHelper(2.5);
      modelGroup.add(axesHelper);

      // Elliptic Paraboloid Surface: z = (x^2 + y^2)/2 - 1.2
      const gridCount = 28;
      const size = 2.4;
      const geom = new THREE.PlaneGeometry(size, size, gridCount, gridCount);
      geom.rotateX(-Math.PI / 2);

      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const y = 0.5 * (x * x + z * z) - 1.0;
        pos.setY(i, y);
      }
      geom.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: 0x186ba0,
        wireframe: wireframe,
        roughness: 0.35,
        side: THREE.DoubleSide,
      });
      const surfaceMesh = new THREE.Mesh(geom, mat);
      modelGroup.add(surfaceMesh);

      // Gradient vector arrows emerging from surface points
      for (let ix = -1; ix <= 1; ix += 0.6) {
        for (let iz = -1; iz <= 1; iz += 0.6) {
          const origin = new THREE.Vector3(ix, 0.5 * (ix * ix + iz * iz) - 1.0, iz);
          const dir = new THREE.Vector3(ix, 1.0, iz).normalize();
          const arrow = new THREE.ArrowHelper(dir, origin, 0.45, 0x191816, 0.12, 0.08);
          modelGroup.add(arrow);
        }
      }
    } else if (modelType === 'crystal-lattice') {
      // 6. CHEMISTRY/PHYSICS: Face-Centered Cubic (FCC) Unit Cell
      const cubeSize = 2.0;
      const half = cubeSize / 2;

      // Outer cube box wireframe
      const boxGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const wireGeo = new THREE.WireframeGeometry(boxGeo);
      const wireLine = new THREE.LineSegments(wireGeo, new THREE.LineBasicMaterial({ color: 0x9c9a92, linewidth: 2 }));
      modelGroup.add(wireLine);

      const cornerAtomGeo = new THREE.SphereGeometry(0.24, 24, 24);
      const cornerMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3 });

      const corners = [
        [-half, -half, -half], [half, -half, -half],
        [-half, half, -half], [half, half, -half],
        [-half, -half, half], [half, -half, half],
        [-half, half, half], [half, half, half]
      ];

      corners.forEach(([x, y, z]) => {
        const m = new THREE.Mesh(cornerAtomGeo, cornerMat);
        m.position.set(x, y, z);
        modelGroup.add(m);
      });

      // 6 Face-Centered Atoms
      const faceAtomGeo = new THREE.SphereGeometry(0.26, 24, 24);
      const faceMat = new THREE.MeshStandardMaterial({ color: 0x1d6935, roughness: 0.25 });

      const faces = [
        [0, 0, half], [0, 0, -half],
        [0, half, 0], [0, -half, 0],
        [half, 0, 0], [-half, 0, 0]
      ];

      faces.forEach(([x, y, z]) => {
        const m = new THREE.Mesh(faceAtomGeo, faceMat);
        m.position.set(x, y, z);
        modelGroup.add(m);
      });
    } else if (modelType === 'benzene') {
      // 7. CHEMISTRY: Benzene Ring (C6H6) Planar Aromatic Ring with Pi Electron Cloud
      const ringRadius = 1.35;
      const hRadius = 2.15;
      const cPositions: THREE.Vector3[] = [];
      const hPositions: THREE.Vector3[] = [];

      const cGeo = new THREE.SphereGeometry(0.28, 24, 24);
      const cMat = new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.3 });
      const hGeo = new THREE.SphereGeometry(0.18, 20, 20);
      const hMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.25 });

      for (let i = 0; i < 6; i++) {
        const theta = (i * Math.PI) / 3;
        const cp = new THREE.Vector3(Math.cos(theta) * ringRadius, 0, Math.sin(theta) * ringRadius);
        const hp = new THREE.Vector3(Math.cos(theta) * hRadius, 0, Math.sin(theta) * hRadius);
        cPositions.push(cp);
        hPositions.push(hp);

        const cm = new THREE.Mesh(cGeo, cMat);
        cm.position.copy(cp);
        modelGroup.add(cm);

        const hm = new THREE.Mesh(hGeo, hMat);
        hm.position.copy(hp);
        modelGroup.add(hm);

        // C-H bond
        modelGroup.add(createCylinderLink(cp, hp, 0.04, 0x8a8880));
      }

      // C-C bonds
      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        modelGroup.add(createCylinderLink(cPositions[i], cPositions[next], 0.055, 0x555555));
      }

      // Delocalized Pi Electron Doughnut Toruses (above and below plane)
      const torusGeo = new THREE.TorusGeometry(ringRadius, 0.12, 16, 64);
      torusGeo.rotateX(Math.PI / 2);
      const piMat = new THREE.MeshStandardMaterial({
        color: 0x186ba0,
        transparent: true,
        opacity: 0.45,
        roughness: 0.2
      });
      const topPi = new THREE.Mesh(torusGeo, piMat);
      topPi.position.set(0, 0.28, 0);
      const botPi = new THREE.Mesh(torusGeo, piMat);
      botPi.position.set(0, -0.28, 0);
      modelGroup.add(topPi);
      modelGroup.add(botPi);
    } else if (modelType === 'graph-network') {
      // 8. CODING: Directed Graph Network with Adjacency Links & Arrows
      const nodeCount = 5;
      const graphRadius = 1.6;
      const gNodes: THREE.Vector3[] = [];
      const nodeGeo = new THREE.SphereGeometry(0.28, 24, 24);
      const activeNodeMat = new THREE.MeshStandardMaterial({ color: 0x1d6935, emissive: 0x1d6935, emissiveIntensity: 0.35 });
      const regNodeMat = new THREE.MeshStandardMaterial({ color: 0x186ba0, roughness: 0.3 });

      for (let i = 0; i < nodeCount; i++) {
        const theta = (i * 2 * Math.PI) / nodeCount;
        const pos = new THREE.Vector3(
          Math.cos(theta) * graphRadius,
          Math.sin(theta * 1.5) * 0.4,
          Math.sin(theta) * graphRadius
        );
        gNodes.push(pos);
        const mesh = new THREE.Mesh(nodeGeo, i === 0 || i === 2 ? activeNodeMat : regNodeMat);
        mesh.position.copy(pos);
        modelGroup.add(mesh);
      }

      const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4], [4, 0]];
      edges.forEach(([u, v]) => {
        modelGroup.add(createCylinderLink(gNodes[u], gNodes[v], 0.035, 0x8a8880));
        const dir = new THREE.Vector3().subVectors(gNodes[v], gNodes[u]).normalize();
        const mid = new THREE.Vector3().addVectors(gNodes[u], gNodes[v]).multiplyScalar(0.5);
        const arrow = new THREE.ArrowHelper(dir, mid, 0.35, 0x191816, 0.14, 0.08);
        modelGroup.add(arrow);
      });
    } else if (modelType === 'call-stack') {
      // 9. CODING: Activation Call Stack Memory Frames
      const frameCount = 4;
      const frameHeight = 0.42;
      const frameWidth = 2.4;
      const frameDepth = 1.3;
      const frameGeo = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
      const frameColors = [0x1d6935, 0x186ba0, 0x5a3e85, 0x636159];

      for (let i = 0; i < frameCount; i++) {
        const y = -1.0 + i * (frameHeight + 0.12);
        const mat = new THREE.MeshStandardMaterial({
          color: frameColors[i],
          roughness: 0.3,
          emissive: i === 3 ? 0x1d6935 : 0x000000,
          emissiveIntensity: i === 3 ? 0.3 : 0
        });
        const mesh = new THREE.Mesh(frameGeo, mat);
        mesh.position.set(0, y, 0);
        modelGroup.add(mesh);

        const wire = new THREE.LineSegments(
          new THREE.WireframeGeometry(frameGeo),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
        );
        mesh.add(wire);
      }

      const spArrow = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-2.0, 0.62, 0),
        0.7,
        0xba322a,
        0.2,
        0.12
      );
      modelGroup.add(spArrow);
    } else if (modelType === 'cell-membrane') {
      // 10. BIOLOGY: Fluid Mosaic Phospholipid Bilayer with Transmembrane Protein
      const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xba322a, roughness: 0.3 });

      for (let ix = -3; ix <= 3; ix++) {
        for (let iz = -3; iz <= 3; iz++) {
          if (Math.abs(ix) <= 1 && Math.abs(iz) <= 1) continue;
          const x = ix * 0.34;
          const z = iz * 0.34;

          const topHead = new THREE.Mesh(headGeo, headMat);
          topHead.position.set(x, 0.65, z);
          modelGroup.add(topHead);
          modelGroup.add(createCylinderLink(new THREE.Vector3(x, 0.65, z), new THREE.Vector3(x - 0.04, 0.15, z), 0.02, 0xd48806));
          modelGroup.add(createCylinderLink(new THREE.Vector3(x, 0.65, z), new THREE.Vector3(x + 0.04, 0.15, z), 0.02, 0xd48806));

          const botHead = new THREE.Mesh(headGeo, headMat);
          botHead.position.set(x, -0.65, z);
          modelGroup.add(botHead);
          modelGroup.add(createCylinderLink(new THREE.Vector3(x, -0.65, z), new THREE.Vector3(x - 0.04, -0.15, z), 0.02, 0xd48806));
          modelGroup.add(createCylinderLink(new THREE.Vector3(x, -0.65, z), new THREE.Vector3(x + 0.04, -0.15, z), 0.02, 0xd48806));
        }
      }

      const barrelGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.6, 24, 1, true);
      const barrelMat = new THREE.MeshStandardMaterial({
        color: 0x1d6935,
        roughness: 0.3,
        side: THREE.DoubleSide
      });
      const channel = new THREE.Mesh(barrelGeo, barrelMat);
      modelGroup.add(channel);
    } else if (modelType === 'neuron') {
      // 11. BIOLOGY: Multipolar Neuron with Soma, Axon & Synaptic Terminal
      const somaGeo = new THREE.SphereGeometry(0.55, 32, 32);
      const somaMat = new THREE.MeshStandardMaterial({ color: 0x9e5207, roughness: 0.35 });
      const soma = new THREE.Mesh(somaGeo, somaMat);
      soma.position.set(0, 0.9, 0);
      modelGroup.add(soma);

      const nucleusGeo = new THREE.SphereGeometry(0.25, 20, 20);
      const nucleusMat = new THREE.MeshStandardMaterial({ color: 0x5a3e85, roughness: 0.25 });
      const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleus.position.set(0, 0.9, 0.15);
      modelGroup.add(nucleus);

      const dAngles = [0, 0.8, 1.6, 2.4, 3.14];
      dAngles.forEach((a) => {
        const end = new THREE.Vector3(Math.cos(a) * 1.3, 0.9 + Math.sin(a) * 0.7, Math.sin(a * 2) * 0.4);
        modelGroup.add(createCylinderLink(new THREE.Vector3(0, 0.9, 0), end, 0.04, 0x9e5207));
        const subEnd = new THREE.Vector3(end.x * 1.3, end.y + 0.3, end.z);
        modelGroup.add(createCylinderLink(end, subEnd, 0.025, 0x9e5207));
      });

      const axonFrom = new THREE.Vector3(0, 0.4, 0);
      const axonTo = new THREE.Vector3(0, -1.6, 0);
      modelGroup.add(createCylinderLink(axonFrom, axonTo, 0.035, 0x636159));

      const sheathGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.45, 16);
      const sheathMat = new THREE.MeshStandardMaterial({ color: 0x186ba0, roughness: 0.25 });
      [-0.1, -0.7, -1.3].forEach((yPos) => {
        const sheath = new THREE.Mesh(sheathGeo, sheathMat);
        sheath.position.set(0, yPos, 0);
        modelGroup.add(sheath);
      });

      const t1 = new THREE.Vector3(-0.6, -2.1, 0.3);
      const t2 = new THREE.Vector3(0, -2.2, -0.4);
      const t3 = new THREE.Vector3(0.6, -2.1, 0.2);
      [t1, t2, t3].forEach((tPos) => {
        modelGroup.add(createCylinderLink(axonTo, tPos, 0.025, 0x9e5207));
        const bouton = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshStandardMaterial({ color: 0x1d6935 }));
        bouton.position.copy(tPos);
        modelGroup.add(bouton);
      });

      const pulseGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const pulseMat = new THREE.MeshStandardMaterial({ color: 0xba322a, emissive: 0xba322a, emissiveIntensity: 0.8 });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      modelGroup.add(pulseMesh);

      let pulseTime = 0;
      animUpdaters.push((delta) => {
        pulseTime += delta * 2.0 * speed;
        const progress = pulseTime % 2.0;
        const y = 0.4 - (progress / 2.0) * 2.0;
        pulseMesh.position.set(0, y, 0);
      });
    } else if (modelType === 'carnot-piston') {
      // 12. PHYSICS: Carnot Cycle Piston Chamber & Thermal Reservoirs
      const chamberGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.2, 32, 1, true);
      const chamberMat = new THREE.MeshStandardMaterial({
        color: 0x186ba0,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const chamber = new THREE.Mesh(chamberGeo, chamberMat);
      chamber.position.set(0, 0, 0);
      modelGroup.add(chamber);

      const baseGeo = new THREE.BoxGeometry(2.2, 0.35, 2.2);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xba322a, roughness: 0.3 });
      const basePlate = new THREE.Mesh(baseGeo, baseMat);
      basePlate.position.set(0, -1.25, 0);
      modelGroup.add(basePlate);

      const pistonGroup = new THREE.Group();
      modelGroup.add(pistonGroup);

      const headGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.18, 32);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.2 });
      const pHead = new THREE.Mesh(headGeo, headMat);
      pistonGroup.add(pHead);

      const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 16);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0x8a8880, metalness: 0.5 });
      const rod = new THREE.Mesh(rodGeo, rodMat);
      rod.position.set(0, 0.7, 0);
      pistonGroup.add(rod);

      const wArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1.4, 0), 0.6, 0x1d6935, 0.18, 0.1);
      pistonGroup.add(wArrow);

      let cycleTime = 0;
      animUpdaters.push((delta) => {
        cycleTime += delta * 1.8 * speed;
        const stroke = Math.sin(cycleTime) * 0.45;
        pistonGroup.position.set(0, stroke, 0);
      });
    } else if (modelType === 'field-vectors') {
      // 13. PHYSICS: Solenoid Magnetic Field Vectors & Flux Lines
      const coilTurns = 8;
      const coilRadius = 0.85;
      const coilHeight = 2.2;
      const coilPoints: THREE.Vector3[] = [];

      for (let i = 0; i <= coilTurns * 24; i++) {
        const theta = (i / 24) * 2 * Math.PI;
        const y = -coilHeight / 2 + (i / (coilTurns * 24)) * coilHeight;
        coilPoints.push(new THREE.Vector3(Math.cos(theta) * coilRadius, y, Math.sin(theta) * coilRadius));
      }

      const coilCurve = new THREE.CatmullRomCurve3(coilPoints);
      const coilGeo = new THREE.TubeGeometry(coilCurve, 128, 0.04, 8, false);
      const coilMat = new THREE.MeshStandardMaterial({ color: 0x9e5207, metalness: 0.7, roughness: 0.2 });
      modelGroup.add(new THREE.Mesh(coilGeo, coilMat));

      for (let y = -0.8; y <= 0.8; y += 0.5) {
        const arrow = new THREE.ArrowHelper(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, y, 0),
          0.6,
          0x186ba0,
          0.16,
          0.09
        );
        modelGroup.add(arrow);
      }
    } else if (modelType === 'eigen-transform') {
      // 14. MATHEMATICS: Eigen-Transformation Stretched Ellipsoid with Eigenbasis Vectors
      const sphereGeo = new THREE.SphereGeometry(1.0, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x186ba0,
        wireframe: wireframe,
        transparent: true,
        opacity: 0.7,
        roughness: 0.35
      });
      const ellipsoid = new THREE.Mesh(sphereGeo, mat);
      modelGroup.add(ellipsoid);

      const v1Arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1.8, 0xba322a, 0.2, 0.12);
      const v2Arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1.2, 0x1d6935, 0.2, 0.12);
      const v3Arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 0.9, 0x186ba0, 0.2, 0.12);
      modelGroup.add(v1Arrow);
      modelGroup.add(v2Arrow);
      modelGroup.add(v3Arrow);

      let eTime = 0;
      animUpdaters.push((delta) => {
        eTime += delta * 1.5 * speed;
        const sx = 1.4 + Math.sin(eTime) * 0.4;
        const sy = 1.0 + Math.cos(eTime) * 0.3;
        const sz = 0.8 + Math.sin(eTime * 0.7) * 0.2;
        ellipsoid.scale.set(sx, sy, sz);
        v1Arrow.setLength(sx * 1.2);
        v2Arrow.setLength(sy * 1.2);
        v3Arrow.setLength(sz * 1.2);
      });
    } else if (modelType === 'coord-axes') {
      // 15. MATHEMATICS: 3D Orthogonal Coordinate Frame R3 with Unit Basis Vectors
      const grid = new THREE.GridHelper(3.6, 12, 0x8a8880, 0xd0ceca);
      grid.position.set(0, -0.01, 0);
      modelGroup.add(grid);

      const axisLen = 2.0;
      const xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLen, 0xba322a, 0.25, 0.14);
      const yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLen, 0x1d6935, 0.25, 0.14);
      const zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLen, 0x186ba0, 0.25, 0.14);
      modelGroup.add(xArrow);
      modelGroup.add(yArrow);
      modelGroup.add(zArrow);

      const oMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshStandardMaterial({ color: 0x191816 }));
      modelGroup.add(oMesh);
    }

    // 7. Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      animUpdaters.forEach((update) => update(delta));
      controls.update();
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

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
  }, [modelType, isRotating, speed, wireframe]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(3.8, 2.8, 4.8);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-3 font-sans h-full flex flex-col justify-between">
      {/* 3D Model Selector Toolbar (Strictly Subject Scoped) */}
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              {title || 'Dynamic Three.js WebGL Engine'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Subject-isolated interactive geometry with orbital physics controls.
            </p>
          </div>
          <div className="px-2 py-0.5 rounded-xs text-[10px] font-mono tracking-wider uppercase font-semibold bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            {category ? `${category.toUpperCase()} • 3D` : '3D WEBGL'}
          </div>
        </div>

        {/* Subject-scoped allowed models ONLY - never any mixed pills */}
        {allowedModels && allowedModels.length > 1 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {allowedModels.map((m) => {
              const isSelected = selectedModelId ? m.id === selectedModelId : modelType === m.type;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModelId(m.id);
                    setModelType(m.type);
                    onSelectModel?.(m.type);
                  }}
                  className={`px-2.5 py-1 rounded-xs text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[var(--text-primary)] text-[var(--surface-raised)] border-[var(--text-primary)] font-bold shadow-xs'
                      : 'bg-[var(--surface-raised)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full flex-1 min-h-[280px] rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] overflow-hidden shadow-xs relative"
      >
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[var(--text-tertiary)] bg-[var(--surface-overlay)] px-2 py-1 rounded border border-[var(--border-subtle)] pointer-events-none z-10">
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-canvas)] flex items-center justify-between font-mono text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] cursor-pointer"
            title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[var(--text-secondary)] text-[11px]">
            {isRotating ? 'Orbit: Active' : 'Orbit: Paused'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[var(--text-secondary)] text-[11px]">Speed:</label>
          <input
            type="range"
            min={0.2}
            max={3.0}
            step={0.2}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-20 accent-[var(--text-primary)]"
          />
          <span className="text-[11px] w-6">{speed.toFixed(1)}x</span>
        </div>

        {modelType === 'vector-field' && (
          <div className="flex items-center gap-1.5">
            <input
              type="checkbox"
              id="wireframe-toggle"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
              className="accent-[var(--text-primary)]"
            />
            <label htmlFor="wireframe-toggle" className="cursor-pointer text-[11px]">
              Wireframe
            </label>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset Camera Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Reset Camera</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] flex items-center cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeDView;
