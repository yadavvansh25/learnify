export type SubjectCategory = "CODING" | "MATH" | "PHYSICS" | "CHEMISTRY" | "BIOLOGY";

export type Visualizer3DType =
  | "molecule"
  | "benzene"
  | "crystal-lattice"
  | "binary-tree"
  | "graph-network"
  | "call-stack"
  | "carnot-piston"
  | "pendulum"
  | "field-vectors"
  | "vector-field"
  | "eigen-transform"
  | "coord-axes"
  | "dna-helix"
  | "cell-membrane"
  | "neuron";

export interface Allowed3DModel {
  id: string;
  label: string;
  type: Visualizer3DType;
  description: string;
}

export interface SubjectVisualizerTab {
  id: string;
  label: string;
  mode: '3d' | '2d-anim' | 'formula' | 'graph' | '2d-text';
  subType?: string;
  default3DType?: Visualizer3DType;
}

export interface ConceptChip {
  id: string;
  label: string;
  targetTool: 'visualizer' | 'kg' | 'quizzes' | 'feynman' | 'flashcards' | 'chat';
  targetTab?: string;
  target3DModel?: Visualizer3DType;
  badge?: string;
}

export interface CurriculumPage {
  pageNumber: number;
  chapter: string;
  title: string;
  content: string;
  formulas: string[];
  conceptChips: ConceptChip[];
  pyqs: Array<{
    year: number;
    paper: string;
    marks: number;
    text: string;
    trap: string;
  }>;
}

export interface SubjectCurriculum {
  subject: SubjectCategory;
  category: string;
  docId: string;
  title: string;
  description: string;
  examYield: string;
  allowedModels: Allowed3DModel[];
  visualizerTabs: SubjectVisualizerTab[];
  pages: CurriculumPage[];
}

export interface TopicItem {
  id: string;
  subject: SubjectCategory;
  category: string;
  title: string;
  description: string;
  examYield: string;
  pages: number;
  chapters: number;
  default3DType: Visualizer3DType;
  sampleQuestion: string;
  docId: string;
  tags: string[];
}

// ----------------------------------------------------
// 1. STRICT SUBJECT-SCOPED CURRICULA DEFINITIONS
// ----------------------------------------------------

export const SUBJECT_TAXONOMY_CONTRACT = {
  CODING: {
    categories: ['Trees & Graphs', 'Memory & Pointers', 'Algorithms'],
    models: ['Binary Search Tree', 'Graph Network', 'Call Stack']
  },
  CHEMISTRY: {
    categories: ['Organic Geometry', 'Crystal Lattices', 'Reaction Kinetics'],
    models: ['Tetrahedral CH4', 'Benzene Ring', 'FCC Lattice']
  },
  BIOLOGY: {
    categories: ['Genetics', 'Cell Biology', 'Anatomy'],
    models: ['DNA Double Helix', 'Cell Membrane', 'Neuron']
  },
  PHYSICS: {
    categories: ['Thermodynamics', 'Mechanics', 'Electromagnetism'],
    models: ['Carnot Cycle Piston', 'Harmonic Pendulum', 'Field Vectors']
  },
  MATH: {
    categories: ['Linear Algebra', '3D Calculus', 'Geometry'],
    models: ['3D Vector Surface', 'Eigen-Transformation', 'Coordinate Axes']
  }
} as const;

export const PHYSICS_THERMO_CURRICULUM: SubjectCurriculum = {
  subject: "PHYSICS",
  category: "Thermodynamics",
  docId: "doc-thermo-101",
  title: "Physics 101: Thermodynamics & Statistical Mechanics",
  description: "First Law quasi-static expansion, Carnot cycle 4-stage loop, Clausius entropy inequality, and Kelvin temperature conversion.",
  examYield: "92% HIGH YIELD [5 MARKS]",
  allowedModels: [
    { id: "carnot-piston", label: "Carnot Cycle Piston", type: "carnot-piston", description: "Thermodynamic heat engine manifold and state cylinders" },
    { id: "harmonic-pendulum", label: "Harmonic Pendulum", type: "pendulum", description: "Oscillatory mechanics and restorative torque" },
    { id: "field-vectors", label: "Field Vectors", type: "field-vectors", description: "Electromagnetic flux lines and force manifolds" }
  ],
  visualizerTabs: [
    { id: "2d-pv-diagram", label: "2D P-V Diagram", mode: "2d-anim", subType: "carnot" },
    { id: "3d-piston", label: "3D Piston & Reservoir (WebGL)", mode: "3d", default3DType: "carnot-piston" },
    { id: "katex-work", label: "KaTeX Work Derivation", mode: "formula" }
  ],
  pages: [
    {
      pageNumber: 1,
      chapter: "Chapter 1: Foundations & The First Law",
      title: "Internal Energy and Quasi-Static Boundary Work",
      content: `The First Law of Thermodynamics formulates the conservation of energy for closed thermodynamic systems. For an infinitesimal quasi-static transformation, the change in internal energy $dU$ satisfies:

$$dU = \\delta Q - \\delta W$$

where $\\delta Q$ represents heat supplied to the system, and $\\delta W = P dV$ is boundary work performed BY the expanding gas. For an ideal gas undergoing isothermal expansion ($T = \\text{constant}$), internal energy is strictly invariant ($\\Delta U = 0$):

$$W = \\int_{V_i}^{V_f} P \\, dV = nRT \\ln\\left(\\frac{V_f}{V_i}\\right)$$

All absorbed heat converts directly to boundary mechanical work during that stroke.`,
      formulas: ["dU = \\delta Q - \\delta W", "W = nRT \\ln(V_f / V_i)"],
      conceptChips: [
        { id: "p1-chip-1", label: "2D P-V Diagram ↗", targetTool: "visualizer", targetTab: "2d-pv-diagram" },
        { id: "p1-chip-2", label: "3D Carnot Reservoir ↗", targetTool: "visualizer", targetTab: "3d-piston", target3DModel: "pendulum" },
        { id: "p1-chip-3", label: "KaTeX Work Derivation ↗", targetTool: "visualizer", targetTab: "katex-work" },
        { id: "p1-chip-4", label: "[5 Marks ★★★] Cambridge PYQ ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2023,
          paper: "Paper 41",
          marks: 5,
          text: "0.50 moles of gas expands at 289 K to 3x initial volume. Calculate boundary work W.",
          trap: "Using W = P·ΔV instead of logarithmic integral W = nRT ln(Vf/Vi)."
        }
      ]
    },
    {
      pageNumber: 2,
      chapter: "Chapter 2: Reversible Cycles & The Carnot Engine",
      title: "The Four Stages of the Carnot Engine",
      content: `Sadi Carnot proved in 1824 that the maximum thermodynamic efficiency of any heat engine operating between hot reservoir $T_H$ and cold sink $T_C$ is strictly bounded:

$$\\eta = 1 - \\frac{T_C}{T_H} = \\frac{W_{\\text{net}}}{Q_H}$$

The reversible cycle comprises:
1. Stage 1 -> 2: Isothermal expansion at $T_H$ absorbing heat $Q_H = nRT_H \\ln(V_2/V_1)$.
2. Stage 2 -> 3: Reversible adiabatic expansion ($Q = 0, P V^\\gamma = \\text{const}$).
3. Stage 3 -> 4: Isothermal compression at $T_C$ rejecting waste heat $|Q_C|$.
4. Stage 4 -> 1: Reversible adiabatic compression back to $T_H$.

CRITICAL EXAM MARKING RUBRIC: Temperatures MUST strictly be converted to absolute Kelvin ($T_K = T_C + 273.15$). Zero marks are awarded for using Celsius directly.`,
      formulas: ["\\eta = 1 - \\frac{T_C}{T_H}", "P V^\\gamma = \\text{constant}"],
      conceptChips: [
        { id: "p2-chip-1", label: "2D P-V Diagram ↗", targetTool: "visualizer", targetTab: "2d-pv-diagram" },
        { id: "p2-chip-2", label: "3D Piston & Reservoir (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-piston", target3DModel: "pendulum" },
        { id: "p2-chip-3", label: "KaTeX Work Derivation ↗", targetTool: "visualizer", targetTab: "katex-work" },
        { id: "p2-chip-4", label: "[5 Marks ★★★] Efficiency Trap ↗", targetTool: "quizzes", badge: "Trap" }
      ],
      pyqs: [
        {
          year: 2024,
          paper: "Paper 42",
          marks: 5,
          text: "A turbine runs between 280 °C and 25 °C. Calculate theoretical Carnot maximum efficiency.",
          trap: "CRITICAL TRAP: Substituting Celsius directly 1 - (25/280) = 91.1%! Must use Kelvin: 1 - (298.15/553.15) = 46.1%."
        }
      ]
    },
    {
      pageNumber: 3,
      chapter: "Chapter 3: Entropy & The Second Law",
      title: "Clausius Inequality and Multiplicity",
      content: `Rudolf Clausius formulated the Second Law mathematically:

$$\\oint \\frac{\\delta Q_{\\text{rev}}}{T} \\le 0, \\quad dS = \\frac{\\delta Q_{\\text{rev}}}{T}$$

For any spontaneous process in an isolated universe, entropy cannot decrease: $\\Delta S_{\\text{isolated}} \\ge 0$.

Boltzmann statistical interpretation connects entropy to quantum microstates:
$$S = k_B \\ln(\\Omega)$$`,
      formulas: ["dS = \\frac{\\delta Q_{\\text{rev}}}{T}", "S = k_B \\ln(\\Omega)"],
      conceptChips: [
        { id: "p3-chip-1", label: "2D P-V Diagram ↗", targetTool: "visualizer", targetTab: "2d-pv-diagram" },
        { id: "p3-chip-2", label: "3D Piston Reservoir ↗", targetTool: "visualizer", targetTab: "3d-piston", target3DModel: "pendulum" },
        { id: "p3-chip-3", label: "KaTeX Work Derivation ↗", targetTool: "visualizer", targetTab: "katex-work" },
        { id: "p3-chip-4", label: "[3 Marks ★★★] Ice Melting PYQ ↗", targetTool: "quizzes" }
      ],
      pyqs: [
        {
          year: 2022,
          paper: "Paper 2",
          marks: 3,
          text: "State Clausius Second Law and calculate entropy change of 0.20 kg melting ice at 0 °C.",
          trap: "Using room temperature 298 K in denominator instead of ice transition temperature 273.15 K."
        }
      ]
    }
  ]
};

export const CODING_TREE_CURRICULUM: SubjectCurriculum = {
  subject: "CODING",
  category: "Trees & Graphs",
  docId: "doc-cs-tree-101",
  title: "Computer Science: 3D Binary Search Trees & Tree Traversal",
  description: "Hierarchical node pointers, in-order balancing, recursive depth-first search, and asymptotic time complexities.",
  examYield: "96% CORE ALGORITHM [6 MARKS]",
  allowedModels: [
    { id: "bst-3d", label: "Binary Search Tree", type: "binary-tree", description: "Interactive node-link hierarchical tree with pulse traversal" },
    { id: "graph-network", label: "Graph Network", type: "graph-network", description: "Adjacency list directed network graph" },
    { id: "call-stack", label: "Call Stack", type: "call-stack", description: "Activation stack frames for recursive algorithms" }
  ],
  visualizerTabs: [
    { id: "3d-tree-traversal", label: "3D Tree Traversal (WebGL)", mode: "3d", default3DType: "binary-tree" },
    { id: "memory-stack-2d", label: "Memory Stack (2D)", mode: "2d-text" },
    { id: "recurrence-formula", label: "Recurrence Formula", mode: "formula" }
  ],
  pages: [
    {
      pageNumber: 1,
      chapter: "Chapter 1: Binary Search Tree Invariants",
      title: "Binary Search Tree Ordering Property & Pointer Hierarchy",
      content: `A Binary Search Tree (BST) is a hierarchical node-link data structure where each node satisfies the fundamental invariant:
For any node $u$, every key in the left subtree is strictly less than $key(u)$, and every key in the right subtree is strictly greater than $key(u)$:

$$\\forall x \\in \\text{Left}(u), \\, key(x) < key(u) \\quad \\text{and} \\quad \\forall y \\in \\text{Right}(u), \\, key(y) > key(u)$$

In an optimal balanced tree of $n$ nodes, the height is $h = \\lfloor \\log_2 n \\rfloor$, yielding average search, insertion, and deletion asymptotic complexity:

$$T_{\\text{avg}}(n) = O(\\log n)$$

However, inserting pre-sorted sequential keys produces a degenerate singly-linked list with worst-case depth $h = n - 1$ and $T_{\\text{worst}}(n) = O(n)$.`,
      formulas: ["T_{\\text{avg}}(n) = O(\\log n)", "T_{\\text{worst}}(n) = O(n)", "h = \\lfloor \\log_2 n \\rfloor"],
      conceptChips: [
        { id: "cs1-chip-1", label: "3D Tree Traversal (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-tree-traversal", target3DModel: "binary-tree" },
        { id: "cs1-chip-2", label: "Memory Stack (2D) ↗", targetTool: "visualizer", targetTab: "memory-stack-2d" },
        { id: "cs1-chip-3", label: "Recurrence Formula ↗", targetTool: "visualizer", targetTab: "recurrence-formula" },
        { id: "cs1-chip-4", label: "[6 Marks ★★★] Tree Skew Proof ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2024,
          paper: "Paper 2 - Algorithms",
          marks: 6,
          text: "Prove why inserting sequential sorted keys into an unaugmented BST results in O(n) search time, and write the recursive height function.",
          trap: "Confusing complete binary tree height log2(n) with worst-case unaugmented degenerate skew."
        }
      ]
    },
    {
      pageNumber: 2,
      chapter: "Chapter 2: Self-Balancing Trees (AVL Rotations)",
      title: "AVL Balance Factors and Rotational Rebalancing",
      content: `Adelson-Velsky and Landis (AVL) trees enforce balance by maintaining a balance factor $BF(u) \\in \\{-1, 0, +1\\}$ at every node:

$$BF(u) = \\text{height}(\\text{Right}(u)) - \\text{height}(\\text{Left}(u))$$

When an insertion causes $|BF(u)| > 1$, local tree rotations restore strict logarithmic height:
1. Left-Left (LL) violation: Single Right Rotation at pivot.
2. Right-Right (RR) violation: Single Left Rotation at pivot.
3. Left-Right (LR) violation: Double rotation (Left child rotated left, parent rotated right).
4. Right-Left (RL) violation: Double rotation (Right child rotated right, parent rotated left).

Master Theorem Recurrence for Divide-and-Conquer tree searches:
$$T(n) = T(n/2) + O(1) \\implies T(n) = O(\\log n)$$`,
      formulas: ["BF(u) = h_R - h_L \\in \\{-1, 0, 1\\}", "T(n) = T(n/2) + O(1) = O(\\log n)"],
      conceptChips: [
        { id: "cs2-chip-1", label: "3D Tree Traversal (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-tree-traversal", target3DModel: "binary-tree" },
        { id: "cs2-chip-2", label: "Memory Stack (2D) ↗", targetTool: "visualizer", targetTab: "memory-stack-2d" },
        { id: "cs2-chip-3", label: "Recurrence Formula ↗", targetTool: "visualizer", targetTab: "recurrence-formula" },
        { id: "cs2-chip-4", label: "[5 Marks ★★★] AVL Rotation Drill ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2023,
          paper: "Paper 3 - Data Structures",
          marks: 5,
          text: "Draw the sequence of AVL rotations after inserting keys [10, 20, 30, 25] into an initially empty tree.",
          trap: "Failing to perform double rotation (RL) when the sub-tree bends inwards."
        }
      ]
    }
  ]
};

export const CHEMISTRY_METHANE_CURRICULUM: SubjectCurriculum = {
  subject: "CHEMISTRY",
  category: "Organic Geometry",
  docId: "doc-chem-methane-401",
  title: "Organic Chemistry: 3D Tetrahedral Geometry & Bond Energies",
  description: "sp³ hybridization, VSEPR bond repulsion at 109.5°, dipole moment cancellation, and standard enthalpy of combustion.",
  examYield: "94% HIGH YIELD [5 MARKS]",
  allowedModels: [
    { id: "tetrahedral-ch4", label: "Tetrahedral CH4", type: "molecule", description: "Central Carbon with 4 Hydrogens at 109.5° angles" },
    { id: "benzene-ring", label: "Benzene Ring", type: "benzene", description: "Aromatic planar ring with delocalized pi cloud" },
    { id: "fcc-lattice", label: "FCC Lattice", type: "crystal-lattice", description: "Face-centered cubic unit cell with 12 coordination spheres" }
  ],
  visualizerTabs: [
    { id: "3d-tetrahedral", label: "3D Tetrahedral CH₄ (WebGL)", mode: "3d", default3DType: "molecule" },
    { id: "2d-reaction", label: "2D Reaction Activation", mode: "2d-anim", subType: "reaction" },
    { id: "katex-bonds", label: "KaTeX Bond Energies", mode: "formula" }
  ],
  pages: [
    {
      pageNumber: 1,
      chapter: "Chapter 1: Methane & sp³ Hybridization",
      title: "Tetrahedral VSEPR Geometry and Dipole Moment Cancellation",
      content: `Methane ($\\text{CH}_4$) is the prototypical alkane with carbon undergoing $sp^3$ orbital hybridization. One $2s$ orbital mixes with three $2p$ orbitals to form four identical hybrid orbitals directed toward the vertices of a regular tetrahedron with bond angles of exactly $109.5^\\circ$ ($109^\\circ 28'$).

Each $\\text{C}-\\text{H}$ bond has a polar bond dipole due to electronegativity difference (Carbon $\\chi = 2.55$, Hydrogen $\\chi = 2.20$). However, because of perfect tetrahedral $T_d$ point group symmetry, the four dipole vectors sum to zero:

$$\\vec{\\mu}_{\\text{net}} = \\sum_{i=1}^4 \\vec{\\mu}_{\\text{C-H}_i} = \\vec{0}$$

Consequently, methane is strictly non-polar with zero permanent electric dipole.`,
      formulas: ["\\theta_{\\text{H-C-H}} = 109.5^\\circ", "\\vec{\\mu}_{\\text{net}} = \\vec{0}"],
      conceptChips: [
        { id: "ch1-chip-1", label: "3D Tetrahedral CH₄ (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-tetrahedral", target3DModel: "molecule" },
        { id: "ch1-chip-2", label: "2D Reaction Activation ↗", targetTool: "visualizer", targetTab: "2d-reaction" },
        { id: "ch1-chip-3", label: "KaTeX Bond Energies ↗", targetTool: "visualizer", targetTab: "katex-bonds" },
        { id: "ch1-chip-4", label: "[5 Marks ★★★] VSEPR Proof ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2024,
          paper: "Paper 41 - Chemistry",
          marks: 5,
          text: "Explain using VSEPR theory why methane has a net zero dipole moment despite four polar C-H bonds.",
          trap: "Confusing individual bond polarities with net molecular symmetry cancellation."
        }
      ]
    },
    {
      pageNumber: 2,
      chapter: "Chapter 2: Enthalpy of Combustion & Bond Dissociation",
      title: "Combustion Reaction Pathways & Hess's Law",
      content: `The complete combustion of methane is an exothermic oxidation reaction:

$$\\text{CH}_4(g) + 2\\text{O}_2(g) \\longrightarrow \\text{CO}_2(g) + 2\\text{H}_2\\text{O}(l) \\quad \\Delta H_c^\\circ = -890.4 \\text{ kJ/mol}$$

Using average bond dissociation energies:
$$\\Delta H = \\sum E_{\\text{broken}} - \\sum E_{\\text{formed}}$$

Bonds broken: $4 \\times E(\\text{C}-\\text{H}) + 2 \\times E(\\text{O}=\\text{O})$
Bonds formed: $2 \\times E(\\text{C}=\\text{O}) + 4 \\times E(\\text{O}-\\text{H})$`,
      formulas: ["\\Delta H = \\sum E_{\\text{broken}} - \\sum E_{\\text{formed}}", "\\Delta H_c^\\circ = -890.4 \\text{ kJ/mol}"],
      conceptChips: [
        { id: "ch2-chip-1", label: "3D Tetrahedral CH₄ (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-tetrahedral", target3DModel: "molecule" },
        { id: "ch2-chip-2", label: "2D Reaction Activation ↗", targetTool: "visualizer", targetTab: "2d-reaction" },
        { id: "ch2-chip-3", label: "KaTeX Bond Energies ↗", targetTool: "visualizer", targetTab: "katex-bonds" },
        { id: "ch2-chip-4", label: "[4 Marks ★★★] Hess Law Calc ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2023,
          paper: "Paper 42 - Physical Chemistry",
          marks: 4,
          text: "Calculate standard enthalpy of combustion for methane using average bond enthalpies.",
          trap: "Writing formed minus broken instead of broken minus formed for bond energies."
        }
      ]
    }
  ]
};

export const BIOLOGY_DNA_CURRICULUM: SubjectCurriculum = {
  subject: "BIOLOGY",
  category: "Genetics",
  docId: "doc-bio-dna-501",
  title: "Genetics: DNA Double Helix Structure & Base-Pairing",
  description: "Watson-Crick antiparallel strands, major and minor grooves, hydrogen-bonding rules (A=T, G≡C), and helicase unwinding.",
  examYield: "95% TOP EXAM QUESTION [5 MARKS]",
  allowedModels: [
    { id: "dna-helix", label: "DNA Double Helix", type: "dna-helix", description: "B-form DNA with major/minor grooves and base rungs" },
    { id: "cell-membrane", label: "Cell Membrane", type: "cell-membrane", description: "Phospholipid bilayer with embedded proteins" },
    { id: "neuron", label: "Neuron", type: "neuron", description: "Multipolar axon and dendritic synaptic arborization" }
  ],
  visualizerTabs: [
    { id: "3d-dna-helix", label: "3D DNA Double Helix (WebGL)", mode: "3d", default3DType: "dna-helix" },
    { id: "2d-action-potential", label: "Action Potential Curve (2D)", mode: "2d-anim", subType: "reaction" },
    { id: "replication-kinetics", label: "Replication Kinetics", mode: "formula" }
  ],
  pages: [
    {
      pageNumber: 1,
      chapter: "Chapter 1: B-DNA Molecular Architecture",
      title: "Watson-Crick Model: Antiparallel Sugar-Phosphate Helices",
      content: `The double-helical structure of deoxyribonucleic acid (B-DNA) resolved by Watson, Crick, and Franklin features two polynucleotide chains running in opposite directions ($5' \\to 3'$ and $3' \\to 5'$).

Key Geometric Parameters of Canonical B-DNA:
1. Diameter of the helix: $2.0 \\text{ nm}$ ($20 \\text{ Å}$).
2. Axial rise per base pair: $0.34 \\text{ nm}$ ($3.4 \\text{ Å}$).
3. Helical pitch per turn: $3.4 \\text{ nm}$ ($10 \\text{ base pairs per turn}$).

Specific purine-pyrimidine base pairing is mediated by hydrogen bonds:
$$\\text{Adenine} = \\text{Thymine} \\, (2 \\text{ H-bonds}), \\quad \\text{Guanine} \\equiv \\text{Cytosine} \\, (3 \\text{ H-bonds})$$

Because $G \\equiv C$ pairs have 3 hydrogen bonds, DNA sequences with higher GC-content have higher thermal melting temperatures ($T_m$).`,
      formulas: ["\\text{Pitch} = 3.4\\text{ nm} \\, (10\\text{ bp/turn})", "\\text{A=T} \\, (2\\text{ H-bonds}), \\, \\text{G}\\equiv\\text{C} \\, (3\\text{ H-bonds})"],
      conceptChips: [
        { id: "bio1-chip-1", label: "3D DNA Double Helix (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-dna-helix", target3DModel: "dna-helix" },
        { id: "bio1-chip-2", label: "Action Potential Curve (2D) ↗", targetTool: "visualizer", targetTab: "2d-action-potential" },
        { id: "bio1-chip-3", label: "Replication Kinetics ↗", targetTool: "visualizer", targetTab: "replication-kinetics" },
        { id: "bio1-chip-4", label: "[5 Marks ★★★] Chargaff Rule Drill ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2024,
          paper: "Paper 41 - Molecular Biology",
          marks: 5,
          text: "State Chargaff's rules and calculate the percentage of Cytosine in a double-stranded DNA fragment containing 28% Adenine.",
          trap: "Assuming single-stranded DNA obeys Chargaff's rule; only double-stranded DNA enforces %A = %T and %G = %C."
        }
      ]
    }
  ]
};

export const BIOLOGY_NEURO_CURRICULUM: SubjectCurriculum = {
  subject: "BIOLOGY",
  category: "Cell Biology",
  docId: "doc-bio-neuro-502",
  title: "Cell Biology: Action Potential Propagation & Synaptic Cleft",
  description: "Voltage-gated Na+/K+ channels, Hodgkin-Huxley membrane depolarization, and calcium-mediated neurotransmitter vesicle exocytosis.",
  examYield: "88% HIGH YIELD [4 MARKS]",
  allowedModels: [
    { id: "neuron-3d", label: "Neuron & Synapse", type: "neuron", description: "Multipolar axon and dendritic synaptic arborization" },
    { id: "cell-membrane-3d", label: "Cell Membrane Bilayer", type: "cell-membrane", description: "Phospholipid bilayer with voltage-gated ion channels" },
    { id: "dna-helix-3d", label: "Nuclear DNA Helix", type: "dna-helix", description: "B-form DNA with major/minor grooves in somatic nucleus" }
  ],
  visualizerTabs: [
    { id: "3d-neuron", label: "3D Neuron & Axon (WebGL)", mode: "3d", default3DType: "neuron" },
    { id: "2d-action-potential", label: "Action Potential Curve (2D)", mode: "2d-anim", subType: "reaction" },
    { id: "hodgkin-huxley", label: "Hodgkin-Huxley Kinetics", mode: "formula" }
  ],
  pages: [
    {
      pageNumber: 1,
      chapter: "Chapter 1: Axonal Membrane Potential & Ion Gradients",
      title: "Resting Membrane Potential & Voltage-Gated Na+/K+ Dynamics",
      content: `The resting membrane potential ($V_m \\approx -70 \\text{ mV}$) of a mammalian neuron is maintained by the electrogenic $\\text{Na}^+/\\text{K}^+$-ATPase pump, actively exporting $3\\text{Na}^+$ ions for every $2\\text{K}^+$ imported.

When depolarizing stimulus reaches the threshold ($\\approx -55 \\text{ mV}$):
1. **Depolarization phase (0 to 1 ms):** Rapid activation of voltage-gated $\\text{Na}^+$ channels causes massive inward sodium flux, shooting $V_m$ up to $+30 \\text{ mV}$.
2. **Repolarization phase (1 to 2 ms):** $\\text{Na}^+$ channels inactivate (h-gate closes) while voltage-gated $\\text{K}^+$ channels open, driving potassium efflux.
3. **Hyperpolarization & Refractory period:** Slow closing of $\\text{K}^+$ channels dips potential to $-80 \\text{ mV}$ (undershoot) before resting potential is restored.`,
      formulas: ["V_m = \\frac{RT}{F} \\ln \\left( \\frac{P_{\\text{K}}[\\text{K}^+]_o + P_{\\text{Na}}[\\text{Na}^+]_o}{P_{\\text{K}}[\\text{K}^+]_i + P_{\\text{Na}}[\\text{Na}^+]_i} \\right)", "V_{\\text{thresh}} \\approx -55\\text{ mV}"],
      conceptChips: [
        { id: "neuro1-chip-1", label: "3D Neuron & Axon (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-neuron", target3DModel: "neuron" },
        { id: "neuro1-chip-2", label: "Action Potential Curve (2D) ↗", targetTool: "visualizer", targetTab: "2d-action-potential" },
        { id: "neuro1-chip-3", label: "Hodgkin-Huxley Kinetics ↗", targetTool: "visualizer", targetTab: "hodgkin-huxley" },
        { id: "neuro1-chip-4", label: "[4 Marks ★★★] Goldman Eq Drill ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2024,
          paper: "Paper 42 - Neurobiology",
          marks: 4,
          text: "Explain why tetrodotoxin (TTX) blocks action potential propagation without affecting the resting potential.",
          trap: "Failing to distinguish between resting leak channels and voltage-gated transient Na+ channels."
        }
      ]
    },
    {
      pageNumber: 2,
      chapter: "Chapter 2: Synaptic Transmission & Vesicle Exocytosis",
      title: "Calcium Influx, SNARE Complex, and Neurotransmitter Release",
      content: `At the presynaptic terminal, arrival of the action potential opens voltage-gated $\\text{Ca}^{2+}$ channels:
1. Intracellular $\\text{Ca}^{2+}$ concentration spikes from $100 \\text{ nM}$ to $>10 \\, \\mu\\text{M}$ within microseconds.
2. $\\text{Ca}^{2+}$ binds to synaptotagmin-1, triggering complete zippering of the core SNARE complex (syntaxin-1, SNAP-25, and synaptobrevin/VAMP2).
3. Synaptic vesicles fuse with the presynaptic plasma membrane, releasing neurotransmitters (e.g., acetylcholine or glutamate) into the $20 \\text{ nm}$ synaptic cleft.`,
      formulas: ["[\\text{Ca}^{2+}]_{\\text{in}} \\uparrow > 10\\, \\mu\\text{M}", "\\Delta t_{\\text{diffusion}} \\approx \\frac{x^2}{2D}"],
      conceptChips: [
        { id: "neuro2-chip-1", label: "3D Neuron & Axon (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-neuron", target3DModel: "neuron" },
        { id: "neuro2-chip-2", label: "Action Potential Curve (2D) ↗", targetTool: "visualizer", targetTab: "2d-action-potential" },
        { id: "neuro2-chip-3", label: "Hodgkin-Huxley Kinetics ↗", targetTool: "visualizer", targetTab: "hodgkin-huxley" },
        { id: "neuro2-chip-4", label: "[5 Marks ★★★] SNARE Fusion PYQ ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2023,
          paper: "Paper 41 - Neurobiology",
          marks: 5,
          text: "Describe the role of synaptotagmin as a calcium sensor in neurotransmitter exocytosis.",
          trap: "Stating calcium directly fuses the vesicle membrane rather than binding synaptotagmin."
        }
      ]
    }
  ]
};

export const MATH_VECTORS_CURRICULUM: SubjectCurriculum = {
  subject: "MATH",
  category: "3D Calculus",
  docId: "doc-math-vectors-201",
  title: "Multivariable Calculus: 3D Parametric Surfaces & Vector Fields",
  description: "Gradient vectors, divergence and curl, tangent planes to surfaces z = f(x,y), and Stokes' boundary circulation theorem.",
  examYield: "93% HIGH YIELD [6 MARKS]",
  allowedModels: [
    { id: "vector-surface", label: "3D Vector Surface", type: "vector-field", description: "Elliptic paraboloid z = x^2 + y^2 with gradient vector arrows" },
    { id: "eigen-transform", label: "Eigen-Transformation", type: "eigen-transform", description: "Eigenvector basis stretch and rotational deformation" },
    { id: "coord-axes", label: "Coordinate Axes", type: "coord-axes", description: "Orthogonal R3 frame with right-hand orientation" }
  ],
  visualizerTabs: [
    { id: "3d-vector-surface", label: "3D Vector Surface (WebGL)", mode: "3d", default3DType: "vector-field" },
    { id: "2d-contour-plot", label: "2D Contour Plot", mode: "graph" },
    { id: "stokes-derivation", label: "Stokes Derivation", mode: "formula" }
  ],
  pages: [
    {
      pageNumber: 1,
      chapter: "Chapter 1: 3D Parametric Surfaces & Tangent Planes",
      title: "Gradient Normal Vectors and Tangent Plane Equations",
      content: `Consider a smooth two-dimensional surface embedded in $\\mathbb{R}^3$ defined by the level surface $F(x, y, z) = z - f(x, y) = 0$. The gradient vector $\\nabla F$ evaluates to an outward normal vector:

$$\\vec{n} = \\nabla F(x_0, y_0, z_0) = \\left( -\\frac{\\partial f}{\\partial x}, -\\frac{\\partial f}{\\partial y}, 1 \\right)$$

The tangent plane equation at point $P(x_0, y_0, z_0)$ is given by the inner product $\\nabla F \\cdot (\\vec{r} - \\vec{r}_0) = 0$:

$$\\frac{\\partial f}{\\partial x}(x_0, y_0)(x - x_0) + \\frac{\\partial f}{\\partial y}(x_0, y_0)(y - y_0) - (z - z_0) = 0$$

For the elliptic paraboloid $z = x^2 + y^2$, the gradient vectors point radially outward and upward with magnitude proportional to distance from the origin.`,
      formulas: ["\\vec{n} = \\nabla F(x_0, y_0, z_0)", "z - z_0 = f_x(x - x_0) + f_y(y - y_0)"],
      conceptChips: [
        { id: "math1-chip-1", label: "3D Vector Surface (WebGL) ↗", targetTool: "visualizer", targetTab: "3d-vector-surface", target3DModel: "vector-field" },
        { id: "math1-chip-2", label: "2D Contour Plot ↗", targetTool: "visualizer", targetTab: "2d-contour-plot" },
        { id: "math1-chip-3", label: "Stokes Derivation ↗", targetTool: "visualizer", targetTab: "stokes-derivation" },
        { id: "math1-chip-4", label: "[6 Marks ★★★] Tangent Plane Proof ↗", targetTool: "quizzes", badge: "PYQ" }
      ],
      pyqs: [
        {
          year: 2024,
          paper: "Paper 3 - Pure Mathematics",
          marks: 6,
          text: "Find the tangent plane and symmetric normal line equations to z = 2x² + 3y² at P(1, 1, 5).",
          trap: "Sign error in normal vector: omitting the negative signs on partial derivatives fx and fy."
        }
      ]
    }
  ]
};

// ----------------------------------------------------
// 2. CURRICULUM REGISTRY LOOKUP
// ----------------------------------------------------

export const ALL_CURRICULA: Record<string, SubjectCurriculum> = {
  "doc-thermo-101": PHYSICS_THERMO_CURRICULUM,
  "doc-physics-pendulum-301": PHYSICS_THERMO_CURRICULUM,
  "doc-cs-tree-101": CODING_TREE_CURRICULUM,
  "doc-cs-graphs-102": CODING_TREE_CURRICULUM,
  "doc-chem-methane-401": CHEMISTRY_METHANE_CURRICULUM,
  "doc-chem-lattice-402": CHEMISTRY_METHANE_CURRICULUM,
  "doc-bio-dna-501": BIOLOGY_DNA_CURRICULUM,
  "doc-bio-neuro-502": BIOLOGY_NEURO_CURRICULUM,
  "doc-math-vectors-201": MATH_VECTORS_CURRICULUM,
  "doc-linear-alg-301": MATH_VECTORS_CURRICULUM,
  "doc-quantum-201": PHYSICS_THERMO_CURRICULUM,
  "doc-electro-401": PHYSICS_THERMO_CURRICULUM
};

export function getSubjectCurriculum(docId: string, subjectHint?: string): SubjectCurriculum {
  if (ALL_CURRICULA[docId]) {
    return ALL_CURRICULA[docId];
  }

  // Derive by keyword prefix or subjectHint
  const lower = (docId + " " + (subjectHint || "")).toLowerCase();
  if (lower.includes("neuro") || lower.includes("synapse") || lower.includes("502")) {
    return BIOLOGY_NEURO_CURRICULUM;
  }
  if (lower.includes("cs") || lower.includes("coding") || lower.includes("tree") || lower.includes("graph")) {
    return CODING_TREE_CURRICULUM;
  }
  if (lower.includes("chem") || lower.includes("methane") || lower.includes("lattice")) {
    return CHEMISTRY_METHANE_CURRICULUM;
  }
  if (lower.includes("bio") || lower.includes("dna")) {
    return BIOLOGY_DNA_CURRICULUM;
  }
  if (lower.includes("math") || lower.includes("vector") || lower.includes("linear")) {
    return MATH_VECTORS_CURRICULUM;
  }

  // Default to Physics Thermodynamics
  return PHYSICS_THERMO_CURRICULUM;
}

// ----------------------------------------------------
// 3. TOPIC CARDS FOR HOMEPAGE
// ----------------------------------------------------

export const SUBJECT_TOPICS: TopicItem[] = [
  // --- CHEMISTRY ---
  {
    id: "chem-methane-tetrahedral",
    subject: "CHEMISTRY",
    category: "ORGANIC GEOMETRY",
    title: "Organic Chemistry: 3D Tetrahedral Geometry & Bond Energies",
    description: "sp³ hybridization, VSEPR bond repulsion at 109.5°, dipole moment cancellation, and standard enthalpy of combustion.",
    examYield: "94% HIGH YIELD [5 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "molecule",
    sampleQuestion: "Explain why methane (CH4) has a net dipole moment of zero despite polar C-H bonds, and calculate ΔH using average bond enthalpies.",
    docId: "doc-chem-methane-401",
    tags: ["Methane", "VSEPR", "Hybridization", "Bond Enthalpy"]
  },
  {
    id: "chem-crystal-lattice",
    subject: "CHEMISTRY",
    category: "CRYSTAL LATTICES",
    title: "Crystal Lattices: Face-Centered (FCC) & Body-Centered (BCC)",
    description: "Unit cell geometry, packing efficiency calculations, coordination numbers, and Bragg X-ray diffraction peaks.",
    examYield: "89% FREQUENT PYQ [4 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "crystal-lattice",
    sampleQuestion: "Derive the atomic packing factor (APF) for a Face-Centered Cubic (FCC) unit cell with sphere radius r.",
    docId: "doc-chem-lattice-402",
    tags: ["FCC", "BCC", "Packing Fraction", "Unit Cell"]
  },

  // --- CODING / COMPUTER SCIENCE ---
  {
    id: "cs-binary-search-tree",
    subject: "CODING",
    category: "TREES & GRAPHS",
    title: "Computer Science: 3D Binary Search Trees & Tree Traversal",
    description: "Hierarchical node pointers, in-order balancing, recursive depth-first search, and asymptotic time complexities.",
    examYield: "96% CORE ALGORITHM [6 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "binary-tree",
    sampleQuestion: "Demonstrate O(log n) search vs O(n) degenerate tree skew, and write the recursive AVL rebalancing rotation step.",
    docId: "doc-cs-tree-101",
    tags: ["BST", "AVL Trees", "Time Complexity", "Recursion"]
  },
  {
    id: "cs-graph-networks",
    subject: "CODING",
    category: "ALGORITHMS",
    title: "Distributed Systems: Directed Graph Networks & Dijkstra Pathing",
    description: "Adjacency matrices, shortest path relaxation, topological sorting, and cycle detection in dependency graphs.",
    examYield: "91% HIGH YIELD [5 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "binary-tree",
    sampleQuestion: "Trace Dijkstra's single-source shortest path algorithm using a min-heap priority queue on a 6-node weighted graph.",
    docId: "doc-cs-graphs-102",
    tags: ["Dijkstra", "Min-Heap", "Shortest Path", "Graphs"]
  },

  // --- BIOLOGY ---
  {
    id: "bio-dna-double-helix",
    subject: "BIOLOGY",
    category: "GENETICS",
    title: "Genetics: DNA Double Helix Structure & Base-Pairing",
    description: "Watson-Crick antiparallel strands, major and minor grooves, hydrogen-bonding rules (A=T, G≡C), and helicase unwinding.",
    examYield: "95% TOP EXAM QUESTION [5 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "dna-helix",
    sampleQuestion: "Describe the structural significance of 3.4 Å base stacking distance and calculate hydrogen bond density in a 100-bp fragment.",
    docId: "doc-bio-dna-501",
    tags: ["Watson-Crick", "Base Pairs", "Helicase", "Polymerase"]
  },
  {
    id: "bio-neural-synapse",
    subject: "BIOLOGY",
    category: "CELL BIOLOGY",
    title: "Cell Biology: Action Potential Propagation & Synaptic Cleft",
    description: "Voltage-gated Na+/K+ channels, Hodgkin-Huxley membrane depolarization, and calcium-mediated neurotransmitter vesicle exocytosis.",
    examYield: "88% HIGH YIELD [4 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "neuron",
    sampleQuestion: "Detail the chronological sequence of voltage-gated ion channels opening during the 1 ms peak of an axonal action potential.",
    docId: "doc-bio-neuro-502",
    tags: ["Action Potential", "Neurotransmitters", "Synapse", "Axon"]
  },

  // --- PHYSICS ---
  {
    id: "phys-thermo-carnot",
    subject: "PHYSICS",
    category: "THERMODYNAMICS",
    title: "Physics 101: Thermodynamics & Carnot Heat Engines",
    description: "First Law quasi-static expansion, Carnot cycle 4-stage loop, Clausius entropy inequality, and Kelvin temperature conversion.",
    examYield: "92% HIGH YIELD [5 MARKS]",
    pages: 3,
    chapters: 3,
    default3DType: "pendulum",
    sampleQuestion: "A power turbine operates between 280°C and 25°C. Calculate theoretical Carnot maximum efficiency and flag unit traps.",
    docId: "doc-thermo-101",
    tags: ["Carnot", "First Law", "Entropy", "Kelvin"]
  },
  {
    id: "phys-mechanics-pendulum",
    subject: "PHYSICS",
    category: "MECHANICS",
    title: "Classical Mechanics: 3D Simple Harmonic Motion & Pendulum Dynamics",
    description: "Restoring torque derivation, small-angle approximation (sin θ ≈ θ), kinetic/potential phase orbits, and damping coefficients.",
    examYield: "90% FREQUENT PYQ [4 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "pendulum",
    sampleQuestion: "Derive the period T = 2π√(L/g) using Lagrangian mechanics and show how large amplitudes introduce elliptic integral corrections.",
    docId: "doc-physics-pendulum-301",
    tags: ["Harmonic Motion", "Lagrangian", "Small Angle", "Damping"]
  },

  // --- MATHEMATICS ---
  {
    id: "math-vector-calculus",
    subject: "MATH",
    category: "3D CALCULUS",
    title: "Multivariable Calculus: 3D Parametric Surfaces & Vector Fields",
    description: "Gradient vectors, divergence and curl, tangent planes to surfaces z = f(x,y), and Stokes' boundary circulation theorem.",
    examYield: "93% HIGH YIELD [6 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "vector-field",
    sampleQuestion: "Find the tangent plane and normal vector line to the elliptic paraboloid z = 2x² + 3y² at point P(1, 1, 5).",
    docId: "doc-math-vectors-201",
    tags: ["Parametric Surfaces", "Gradient", "Stokes Theorem", "Vector Field"]
  },
  {
    id: "math-linear-algebra-svd",
    subject: "MATH",
    category: "LINEAR ALGEBRA",
    title: "Math 301: Spectral Theorem, Eigenvalues & SVD Transformations",
    description: "Orthogonal diagonalization, characteristic polynomials, singular value decomposition, and geometric hyper-ellipsoid mapping.",
    examYield: "95% TOP PROOF [5 MARKS]",
    pages: 2,
    chapters: 2,
    default3DType: "vector-field",
    sampleQuestion: "Compute the singular values and unitary matrices U and V for a 2x2 asymmetric shear matrix, showing geometric stretching.",
    docId: "doc-linear-alg-301",
    tags: ["Eigenvalues", "SVD", "Diagonalization", "Orthogonal"]
  }
];

export const SUBJECT_COLORS: Record<SubjectCategory, { badge: string; text: string; border: string }> = {
  CHEMISTRY: {
    badge: "bg-[#f5eef8] dark:bg-[#2b1d33]",
    text: "text-[#7a3994] dark:text-[#d797ee]",
    border: "border-[#e0cbed] dark:border-[#522f66]"
  },
  CODING: {
    badge: "bg-[#eaf4fc] dark:bg-[#142838]",
    text: "text-[#186ba0] dark:text-[#7ac4f5]",
    border: "border-[#c4e1f5] dark:border-[#224560]"
  },
  BIOLOGY: {
    badge: "bg-[#eaf7ee] dark:bg-[#152e1c]",
    text: "text-[#1d6935] dark:text-[#5ec77d]",
    border: "border-[#bfe8c9] dark:border-[#245230]"
  },
  PHYSICS: {
    badge: "bg-[#fdf3e7] dark:bg-[#332312]",
    text: "text-[#9e5207] dark:text-[#f7ad59]",
    border: "border-[#f7dcbe] dark:border-[#63411b]"
  },
  MATH: {
    badge: "bg-[#f3f2ef] dark:bg-[#262523]",
    text: "text-[#191816] dark:text-[#edece8]",
    border: "border-[#d8d6cf] dark:border-[#42403b]"
  }
};
