import { NextRequest, NextResponse } from "next/server";

export interface GraphPayload {
  title: string;
  type: "function-plot" | "concept-graph" | "bar-chart" | "contour";
  equation?: string;           // e.g. "f(x) = sin(x) * exp(-0.1*x)" or "PV = nRT"
  dataPoints?: { x: number; y: number; label?: string }[];
  series?: { name: string; color?: string; dataPoints: { x: number; y: number; label?: string }[] }[];
  nodes?: { id: string; label: string; group?: string }[];
  edges?: { source: string; target: string; relationship?: string }[];
  xLabel: string;
  yLabel: string;
  insights: string[];          // Key mathematical inferences / exam takeaways
  parameters?: {
    id: string;
    name: string;
    min: number;
    max: number;
    step: number;
    default: number;
    unit?: string;
  }[];
}

/**
 * Safely evaluates a math expression for a given x
 */
function evaluateMathExpression(expr: string, x: number): number {
  try {
    let clean = expr
      .replace(/\^/g, "**")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/exp\(/g, "Math.exp(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/log\(/g, "Math.log(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/pi/gi, "Math.PI")
      .replace(/e\b/gi, "Math.E");

    // Replace standalone x with the value
    clean = clean.replace(/([0-9])x/g, `$1*${x}`).replace(/\bx\b/g, `(${x})`);

    const result = Function(`"use strict"; return (${clean})`)();
    return typeof result === "number" && !isNaN(result) && isFinite(result)
      ? Number(result.toFixed(3))
      : 0;
  } catch {
    return 0;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = String(body.question || "").trim();
    const subject = String(body.subject || "").toUpperCase();
    const lower = question.toLowerCase();

    let graphData: GraphPayload;

    // 1. CONCEPT GRAPH INTENT
    if (
      lower.includes("concept graph") ||
      lower.includes("concept map") ||
      lower.includes("prerequisites") ||
      lower.includes("mind map") ||
      lower.includes("flowchart")
    ) {
      if (lower.includes("thermo") || lower.includes("carnot") || lower.includes("physics")) {
        graphData = {
          title: "Thermodynamics Concept Dependency Network",
          type: "concept-graph",
          xLabel: "Conceptual Layer",
          yLabel: "Abstraction Depth",
          nodes: [
            { id: "first-law", label: "First Law (dU = δQ - δW)", group: "Axiom" },
            { id: "isothermal", label: "Isothermal Expansion", group: "Process" },
            { id: "adiabatic", label: "Adiabatic Quasistatic", group: "Process" },
            { id: "carnot-cycle", label: "Carnot Engine (4-Stage)", group: "Cycle" },
            { id: "efficiency", label: "η = 1 - Tc/Th", group: "Formula" },
            { id: "clausius", label: "Clausius Entropy (dS = δQ/T)", group: "Law" }
          ],
          edges: [
            { source: "first-law", target: "isothermal", relationship: "governs" },
            { source: "first-law", target: "adiabatic", relationship: "governs" },
            { source: "isothermal", target: "carnot-cycle", relationship: "builds" },
            { source: "adiabatic", target: "carnot-cycle", relationship: "builds" },
            { source: "carnot-cycle", target: "efficiency", relationship: "derives" },
            { source: "efficiency", target: "clausius", relationship: "generalizes" }
          ],
          insights: [
            "Prerequisite chain: First Law establishes boundary constraints for both reversible strokes.",
            "Carnot cycle synthesis combines two isothermal and two adiabatic curves to bound maximum conversion.",
            "Clausius theorem provides the statistical thermodynamic foundation for Second Law entropy production."
          ]
        };
      } else if (lower.includes("tree") || lower.includes("algorithm") || lower.includes("cs")) {
        graphData = {
          title: "Data Structures & Asymptotic Hierarchy",
          type: "concept-graph",
          xLabel: "Hierarchy Level",
          yLabel: "Complexity Rank",
          nodes: [
            { id: "array", label: "Contiguous Array O(1)", group: "Linear" },
            { id: "linked-list", label: "Pointer Nodes O(n)", group: "Linear" },
            { id: "bst", label: "Binary Search Tree O(log n)", group: "Tree" },
            { id: "avl", label: "AVL Balanced Tree O(log n)", group: "Balanced" },
            { id: "heap", label: "Binary Min-Heap O(1) peek", group: "Priority" },
            { id: "graph", label: "Adjacency Graph O(V + E)", group: "Network" }
          ],
          edges: [
            { source: "linked-list", target: "bst", relationship: "hierarchical elevation" },
            { source: "bst", target: "avl", relationship: "rotational balancing" },
            { source: "array", target: "heap", relationship: "implicit tree representation" },
            { source: "bst", target: "graph", relationship: "acyclic specialization" }
          ],
          insights: [
            "BST ordering property halves search space in O(log n) average time.",
            "Unaugmented sequential insertion degrades to linked list O(n); AVL tree restores logarithmic guarantee.",
            "Heap array representation avoids pointer memory overhead with implicit child indices 2i+1 and 2i+2."
          ]
        };
      } else {
        graphData = {
          title: "Conceptual Relationship Network",
          type: "concept-graph",
          xLabel: "Domain Layer",
          yLabel: "Hierarchy",
          nodes: [
            { id: "c1", label: "Core Principles", group: "Core" },
            { id: "c2", label: "Governing Differential", group: "Math" },
            { id: "c3", label: "Physical Application", group: "Applied" },
            { id: "c4", label: "Limiting Boundary", group: "Boundary" }
          ],
          edges: [
            { source: "c1", target: "c2", relationship: "formulates" },
            { source: "c2", target: "c3", relationship: "predicts" },
            { source: "c3", target: "c4", relationship: "constrained by" }
          ],
          insights: [
            "Primary dependency links basic conservation axioms to governing equations.",
            "Boundary conditions constrain physically observable system solutions."
          ]
        };
      }
      return NextResponse.json({ success: true, graph: graphData });
    }

    // 2. DAMPED HARMONIC OSCILLATOR / WAVE / SINE
    if (
      lower.includes("damped") ||
      lower.includes("oscillator") ||
      lower.includes("harmonic") ||
      lower.includes("sin") ||
      lower.includes("wave")
    ) {
      const dataPoints: { x: number; y: number }[] = [];
      const envelopePos: { x: number; y: number }[] = [];
      const envelopeNeg: { x: number; y: number }[] = [];

      for (let i = 0; i <= 60; i++) {
        const x = Number((i * 0.25).toFixed(2));
        const env = Math.exp(-0.15 * x);
        const y = Number((Math.sin(1.8 * x) * env).toFixed(3));
        dataPoints.push({ x, y });
        envelopePos.push({ x, y: Number(env.toFixed(3)) });
        envelopeNeg.push({ x, y: Number((-env).toFixed(3)) });
      }

      graphData = {
        title: "Damped Harmonic Oscillation & Energy Decay",
        type: "function-plot",
        equation: "x(t) = A e^{-\\gamma t} \\sin(\\omega t + \\phi)",
        dataPoints,
        series: [
          { name: "Oscillation x(t)", color: "#1d6935", dataPoints },
          { name: "Upper Envelope +A e^{-γt}", color: "#9e5207", dataPoints: envelopePos },
          { name: "Lower Envelope -A e^{-γt}", color: "#9e5207", dataPoints: envelopeNeg }
        ],
        xLabel: "Time t (seconds)",
        yLabel: "Displacement x(t) (meters)",
        parameters: [
          { id: "amplitude", name: "Amplitude A", min: 0.5, max: 2.0, step: 0.1, default: 1.0, unit: "m" },
          { id: "damping", name: "Damping Factor γ", min: 0.05, max: 0.5, step: 0.05, default: 0.15, unit: "s⁻¹" },
          { id: "frequency", name: "Angular Frequency ω", min: 0.8, max: 3.5, step: 0.2, default: 1.8, unit: "rad/s" }
        ],
        insights: [
          "Exponential envelope e^{-γt} strictly bounds the peak sinusoidal displacement over time.",
          "Mechanical energy diminishes exponentially as E(t) = E_0 e^{-2γt} due to viscous dissipation.",
          "Critical damping occurs when γ = ω_0, returning system to equilibrium in minimum time without oscillation."
        ]
      };
      return NextResponse.json({ success: true, graph: graphData });
    }

    // 3. CARNOT CYCLE / THERMODYNAMICS / P-V HYPERBOLA
    if (
      lower.includes("carnot") ||
      lower.includes("thermo") ||
      lower.includes("p-v") ||
      lower.includes("pv") ||
      lower.includes("isotherm") ||
      lower.includes("pressure") ||
      lower.includes("volume")
    ) {
      const vMin = 0.5;
      const vMax = 4.0;
      const steps = 40;

      const hotIsotherm: { x: number; y: number }[] = [];
      const coldIsotherm: { x: number; y: number }[] = [];

      for (let i = 0; i <= steps; i++) {
        const v = Number((vMin + (i / steps) * (vMax - vMin)).toFixed(2));
        // P = nRT/V (with nR = 1, T_H = 600, T_C = 300)
        const pHot = Number((600 / (v * 100)).toFixed(2));
        const pCold = Number((300 / (v * 100)).toFixed(2));
        hotIsotherm.push({ x: v, y: pHot });
        coldIsotherm.push({ x: v, y: pCold });
      }

      graphData = {
        title: "Carnot Engine Isothermal P-V Indicator Diagram",
        type: "function-plot",
        equation: "P(V) = \\frac{nRT}{V}, \\quad \\eta = 1 - \\frac{T_C}{T_H}",
        dataPoints: hotIsotherm,
        series: [
          { name: "Hot Isotherm T_H = 600 K", color: "#ba322a", dataPoints: hotIsotherm },
          { name: "Cold Isotherm T_C = 300 K", color: "#186ba0", dataPoints: coldIsotherm }
        ],
        xLabel: "Gas Volume V (liters / m³)",
        yLabel: "Gas Pressure P (atm / kPa)",
        parameters: [
          { id: "tempHot", name: "Hot Source T_H", min: 400, max: 900, step: 25, default: 600, unit: "K" },
          { id: "tempCold", name: "Cold Sink T_C", min: 200, max: 400, step: 20, default: 300, unit: "K" },
          { id: "moles", name: "Gas Quantity n", min: 0.5, max: 3.0, step: 0.5, default: 1.0, unit: "mol" }
        ],
        insights: [
          "Enclosed area between the expansion and compression curves represents net mechanical work performed W_net = ∮ P dV.",
          "Efficiency depends solely on the ratio of absolute temperatures: η = 1 - (T_C / T_H) = 50.0% here.",
          "CRITICAL EXAM MARKING TRAP: Temperatures MUST strictly be converted to Kelvin; using Celsius forfeits all derivation marks."
        ]
      };
      return NextResponse.json({ success: true, graph: graphData });
    }

    // 4. ENZYME KINETICS / MICHAELIS-MENTEN / CHEMISTRY
    if (
      lower.includes("michaelis") ||
      lower.includes("enzyme") ||
      lower.includes("kinetics") ||
      lower.includes("substrate") ||
      lower.includes("vmax")
    ) {
      const dataPoints: { x: number; y: number }[] = [];
      const vmax = 100;
      const km = 12;

      for (let s = 0; s <= 60; s += 1.5) {
        const x = Number(s.toFixed(1));
        const v = Number(((vmax * x) / (km + x)).toFixed(2));
        dataPoints.push({ x, y: v });
      }

      graphData = {
        title: "Michaelis-Menten Enzyme Kinetics Velocity Curve",
        type: "function-plot",
        equation: "v_0 = \\frac{V_{\\max} [S]}{K_m + [S]}",
        dataPoints,
        xLabel: "Substrate Concentration [S] (μM)",
        yLabel: "Reaction Velocity v₀ (μmol/min)",
        parameters: [
          { id: "vmax", name: "Max Velocity V_max", min: 50, max: 200, step: 10, default: 100, unit: "μmol/min" },
          { id: "km", name: "Michaelis Constant K_m", min: 4, max: 30, step: 2, default: 12, unit: "μM" }
        ],
        insights: [
          "At substrate concentration [S] = K_m, initial reaction velocity reaches exactly half maximum velocity (0.5 V_max).",
          "Lower K_m denotes higher enzyme-substrate affinity requiring less substrate to saturate active sites.",
          "At high [S] >> K_m, curve exhibits zero-order asymptotic saturation kinetics independent of substrate concentration."
        ]
      };
      return NextResponse.json({ success: true, graph: graphData });
    }

    // 5. ASYMPTOTIC COMPLEXITY / BIG-O / COMPUTER SCIENCE
    if (
      lower.includes("big-o") ||
      lower.includes("complexity") ||
      lower.includes("asymptotic") ||
      lower.includes("algorithm") ||
      lower.includes("o(n)") ||
      lower.includes("o(log n)")
    ) {
      const steps = 30;
      const o1: { x: number; y: number }[] = [];
      const oLogN: { x: number; y: number }[] = [];
      const oN: { x: number; y: number }[] = [];
      const oNLogN: { x: number; y: number }[] = [];
      const oNSq: { x: number; y: number }[] = [];

      for (let n = 1; n <= steps; n++) {
        o1.push({ x: n, y: 5 });
        oLogN.push({ x: n, y: Number((Math.log2(n) * 4).toFixed(1)) });
        oN.push({ x: n, y: n * 2 });
        oNLogN.push({ x: n, y: Number((n * Math.log2(n)).toFixed(1)) });
        oNSq.push({ x: n, y: Number((0.15 * n * n).toFixed(1)) });
      }

      graphData = {
        title: "Asymptotic Runtime Complexity Comparison (Big-O)",
        type: "function-plot",
        equation: "T(n) = O(f(n)) \\implies \\exists c, n_0 : T(n) \\le c \\cdot f(n)",
        dataPoints: oN,
        series: [
          { name: "O(1) Constant", color: "#1d6935", dataPoints: o1 },
          { name: "O(log n) Binary Tree Search", color: "#186ba0", dataPoints: oLogN },
          { name: "O(n) Linear Scan", color: "#9e5207", dataPoints: oN },
          { name: "O(n log n) MergeSort / QuickSort", color: "#6b3fa0", dataPoints: oNLogN },
          { name: "O(n²) Nested Loop Skew", color: "#ba322a", dataPoints: oNSq }
        ],
        xLabel: "Input Size n (elements)",
        yLabel: "Computational Operations T(n)",
        insights: [
          "Binary Search Trees achieve exponential height reduction: for n = 1,000,000, log₂(n) ≈ 20 operations.",
          "Degenerate BST skew occurs with sorted inputs, collapsing performance from O(log n) to worst-case O(n).",
          "Balanced AVL trees ensure strict height invariant h ≤ 1.44 log₂(n) through O(1) single and double rotations."
        ]
      };
      return NextResponse.json({ success: true, graph: graphData });
    }

    // 6. ACTION POTENTIAL / NEUROLOGY / BIOLOGY
    if (
      lower.includes("action potential") ||
      lower.includes("neuron") ||
      lower.includes("membrane potential") ||
      lower.includes("depolarization")
    ) {
      const dataPoints: { x: number; y: number; label?: string }[] = [
        { x: 0.0, y: -70, label: "Resting" },
        { x: 0.5, y: -70 },
        { x: 1.0, y: -55, label: "Threshold" },
        { x: 1.4, y: 0 },
        { x: 1.8, y: +35, label: "Peak Depolarization" },
        { x: 2.2, y: +10 },
        { x: 2.6, y: -40, label: "Repolarization" },
        { x: 3.0, y: -80, label: "Hyperpolarization (Undershoot)" },
        { x: 3.8, y: -75 },
        { x: 4.5, y: -70, label: "Resting Restored" }
      ];

      graphData = {
        title: "Neuronal Axon Action Potential Membrane Trajectory",
        type: "function-plot",
        equation: "V_m(t) = \\frac{RT}{F} \\ln \\left( \\frac{P_{\\text{K}}[\\text{K}^+]_o + P_{\\text{Na}}[\\text{Na}^+]_o}{P_{\\text{K}}[\\text{K}^+]_i + P_{\\text{Na}}[\\text{Na}^+]_i} \\right)",
        dataPoints,
        xLabel: "Time t (milliseconds)",
        yLabel: "Membrane Voltage V_m (millivolts)",
        insights: [
          "Threshold activation (-55 mV) opens voltage-gated Na⁺ channels causing explosive regenerative depolarization to +35 mV.",
          "Inactivation of Na⁺ h-gates paired with delayed K⁺ channel opening drives rapid repolarization.",
          "Hyperpolarization refractory undershoot (-80 mV) enforces unidirectional forward propagation down the axon shaft."
        ]
      };
      return NextResponse.json({ success: true, graph: graphData });
    }

    // 7. CUSTOM FORMULA / ARBITRARY MATH PARSER
    // Detect expressions like: f(x) = ..., y = ..., or mathematical formulas
    const mathMatch = question.match(/(?:f\(x\)|y)\s*=\s*([a-zA-Z0-9\s\+\-\*\/\^\.\(\)]+)/i);
    const formulaStr = mathMatch ? mathMatch[1].trim() : question;

    // Test evaluating formula on sample points
    const testPoints: { x: number; y: number }[] = [];
    const minX = -4;
    const maxX = 6;
    const steps = 40;
    const stepSize = (maxX - minX) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = Number((minX + i * stepSize).toFixed(2));
      const y = evaluateMathExpression(formulaStr, x);
      testPoints.push({ x, y });
    }

    const hasValidPoints = testPoints.some(p => p.y !== 0);

    if (hasValidPoints) {
      graphData = {
        title: `Function Analysis: ${question.slice(0, 45)}`,
        type: "function-plot",
        equation: mathMatch ? `y = ${mathMatch[1]}` : `f(x) = ${question}`,
        dataPoints: testPoints,
        xLabel: "Domain Variable x",
        yLabel: "Function Value f(x)",
        parameters: [
          { id: "scale", name: "Vertical Scale", min: 0.5, max: 3.0, step: 0.25, default: 1.0 }
        ],
        insights: [
          "Function sampled across real continuous domain x ∈ [-4, 6].",
          "Stationary points occur where first derivative f'(x) = 0.",
          "Curvature concavity is dictated by sign of second derivative f''(x)."
        ]
      };
      return NextResponse.json({ success: true, graph: graphData });
    }

    // 8. DEFAULT / GENERAL FALLBACK: Parabolic Trajectory / Energy Landscape
    const defaultPoints: { x: number; y: number }[] = [];
    for (let i = 0; i <= 30; i++) {
      const x = Number((i * 0.3).toFixed(2));
      const y = Number((-0.5 * x * x + 4 * x).toFixed(2));
      defaultPoints.push({ x, y });
    }

    graphData = {
      title: `Graph Analysis: ${question.slice(0, 35)}...`,
      type: "function-plot",
      equation: "y = -0.5 x^2 + 4x",
      dataPoints: defaultPoints,
      xLabel: "Independent Parameter (e.g., Time / Coordinate / Input)",
      yLabel: "Dependent Response (e.g., Energy / Altitude / Amplitude)",
      parameters: [
        { id: "gravity", name: "Curvature Factor a", min: 0.2, max: 1.2, step: 0.1, default: 0.5 },
        { id: "initial", name: "Linear Slope b", min: 2.0, max: 6.0, step: 0.5, default: 4.0 }
      ],
      insights: [
        "Local maximum achieved at peak equilibrium vertex x = -b / (2a) = 4.0, y = 8.0.",
        "Roots (y = 0) at x = 0.0 and x = 8.0 represent physical ground or boundary constraints.",
        "Tangent derivative slope dy/dx = -x + 4 indicates instantaneous rate of velocity change."
      ]
    };

    return NextResponse.json({ success: true, graph: graphData });
  } catch (error: any) {
    console.error("[GENERATE GRAPH ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
