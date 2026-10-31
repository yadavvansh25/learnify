import { NextRequest, NextResponse } from 'next/server';
import { VizSpec, VizSpecSchema } from '@/lib/schemas';
import { Visualizer3DType } from '@/lib/subjects-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type = '3d',
      concept = 'Methane',
      question = ''
    } = body;

    const query = `${concept} ${question}`.toLowerCase();

    // 1. CHEMISTRY: Molecular & Lattice Detection
    let default3DType: Visualizer3DType = 'molecule';
    let title = '3D Molecular Geometry (Tetrahedral)';
    let caption = 'Ball-and-stick model with VSEPR bond angles (109.5°).';
    let code = `const carbon = new THREE.Mesh(new THREE.SphereGeometry(0.45));`;
    let subject = 'CHEMISTRY';

    if (query.includes('lattice') || query.includes('fcc') || query.includes('bcc') || query.includes('crystal') || query.includes('unit cell')) {
      default3DType = 'crystal-lattice';
      title = '3D Face-Centered Cubic (FCC) Crystal Lattice';
      caption = 'Unit cell geometry with 8 corner atoms and 6 face-centered atoms.';
      code = `const cornerAtoms = createFCCUnitCell({ radius: 0.22, edgeLength: 2.2 });`;
      subject = 'CHEMISTRY';
    } else if (query.includes('tree') || query.includes('bst') || query.includes('binary search') || query.includes('graph') || query.includes('node') || query.includes('linked list') || query.includes('algorithm') || query.includes('coding') || query.includes('stack')) {
      // 2. CODING: Data Structures (Binary Trees & Graphs)
      default3DType = 'binary-tree';
      title = '3D Hierarchical Binary Search Tree';
      caption = 'Node-link data structure with recursive pointer traversal and level balance.';
      code = `const bst = build3DBinaryTree({ depth: 3, nodeRadius: 0.35 });`;
      subject = 'CODING';
    } else if (query.includes('dna') || query.includes('helix') || query.includes('chromosome') || query.includes('gene') || query.includes('helicase') || query.includes('biology') || query.includes('synapse') || query.includes('cell')) {
      // 3. BIOLOGY: DNA Double Helix
      default3DType = 'dna-helix';
      title = '3D DNA Double Helix & Base Pairs';
      caption = 'Antiparallel twisting sugar-phosphate backbones connected by A-T and G-C rungs.';
      code = `const doubleHelix = createDNADoubleHelix({ turns: 3, radius: 1.2, rungs: 30 });`;
      subject = 'BIOLOGY';
    } else if (query.includes('pendulum') || query.includes('oscillation') || query.includes('harmonic') || query.includes('torque') || query.includes('gravity') || query.includes('mechanics') || query.includes('carnot') || query.includes('thermodynamic')) {
      // 4. PHYSICS: Pendulum / Mechanical Oscillation
      default3DType = 'pendulum';
      title = '3D Simple Harmonic Pendulum Dynamics';
      caption = 'Interactive oscillating pendulum with tension string and dynamic velocity vectors.';
      code = `const pendulum = createOscillatingPendulum({ length: 2.5, bobRadius: 0.35 });`;
      subject = 'PHYSICS';
    } else if (query.includes('vector') || query.includes('surface') || query.includes('paraboloid') || query.includes('eigenvector') || query.includes('matrix') || query.includes('calculus') || query.includes('math') || query.includes('gradient')) {
      // 5. MATHEMATICS: 3D Surface & Vector Fields
      default3DType = 'vector-field';
      title = '3D Parametric Surface & Vector Coordinate Grid';
      caption = 'Continuous gradient field on elliptic paraboloid surface z = x² + y².';
      code = `const surface = createParametricSurface({ func: (x, y) => x*x + y*y });`;
      subject = 'MATHEMATICS';
    } else if (query.includes('benzene') || query.includes('ch4') || query.includes('h2o') || query.includes('hydrocarbon') || query.includes('tetrahedral') || query.includes('molecule')) {
      default3DType = 'molecule';
      title = '3D Tetrahedral Molecular Structure';
      caption = 'Central Carbon atom with 4 Hydrogen atoms showing dipole cancellation.';
      code = `const methane = createTetrahedralMolecule({ bondLength: 1.4 });`;
      subject = 'CHEMISTRY';
    }

    const spec: VizSpec = {
      type: type === '3d' ? '3d' : (type as any),
      title,
      caption,
      code,
      parameters: {
        default3DType,
        subject,
        concept,
        question
      }
    };

    // Validate against Zod schema
    const validated = VizSpecSchema.parse(spec);

    return NextResponse.json({
      success: true,
      spec: validated,
      default3DType,
      subject
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
