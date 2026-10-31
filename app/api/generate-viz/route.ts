import { NextRequest, NextResponse } from 'next/server';
import { VizSpec, VizSpecSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = '2d-anim', concept = 'Carnot Engine' } = body;

    let spec: VizSpec;

    if (type === '3d') {
      spec = {
        type: '3d',
        title: 'Three.js 3D Quantum Harmonic Manifold',
        caption: 'Rotatable WebGL spatial representation of wave mechanics.',
        code: `const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 100, 16, 2, 3);`,
        parameters: { harmonicN: 2, spinSpeed: 1.0 }
      };
    } else if (type === 'formula') {
      spec = {
        type: 'formula',
        title: 'Step-by-Step KaTeX Derivation',
        caption: 'Expanded derivation steps with marking scheme weights.',
        code: `\\eta = 1 - \\frac{T_C}{T_H}`,
        parameters: { steps: 3 }
      };
    } else if (type === 'graph') {
      spec = {
        type: 'graph',
        title: 'Carnot Limit Coordinate Plot',
        caption: 'Efficiency curve against reservoir temperature.',
        code: `plot(1 - 300 / T_H, T_H in [300, 1200])`,
        parameters: { coldTempK: 300 }
      };
    } else {
      spec = {
        type: '2d-anim',
        title: 'HTML5 Canvas 2D Carnot Heat Engine',
        caption: 'Continuous 4-stroke cycle with P-V indicator curve.',
        code: `requestAnimationFrame(renderLoop);`,
        parameters: { thCelsius: 327, tcCelsius: 27 }
      };
    }

    // Validate with Zod
    const validated = VizSpecSchema.parse(spec);

    return NextResponse.json({
      success: true,
      spec: validated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
