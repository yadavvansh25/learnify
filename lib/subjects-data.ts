export type SubjectCategory = "CODING" | "MATH" | "PHYSICS" | "CHEMISTRY" | "BIOLOGY";

export type Visualizer3DType =
  | "molecule"
  | "binary-tree"
  | "vector-field"
  | "dna-helix"
  | "pendulum"
  | "crystal-lattice";

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

export const SUBJECT_TOPICS: TopicItem[] = [
  // --- CHEMISTRY ---
  {
    id: "chem-methane-tetrahedral",
    subject: "CHEMISTRY",
    category: "ORGANIC CHEMISTRY",
    title: "Organic Chemistry: 3D Tetrahedral Geometry & Bond Energies",
    description: "sp³ hybridization, VSEPR bond repulsion at 109.5°, dipole moment cancellation, and standard enthalpy of combustion.",
    examYield: "94% HIGH YIELD [5 MARKS]",
    pages: 4,
    chapters: 3,
    default3DType: "molecule",
    sampleQuestion: "Explain why methane (CH4) has a net dipole moment of zero despite polar C-H bonds, and calculate ΔH using average bond enthalpies.",
    docId: "doc-chem-methane-401",
    tags: ["Methane", "VSEPR", "Hybridization", "Bond Enthalpy"]
  },
  {
    id: "chem-crystal-lattice",
    subject: "CHEMISTRY",
    category: "SOLID STATE",
    title: "Crystal Lattices: Face-Centered (FCC) & Body-Centered (BCC)",
    description: "Unit cell geometry, packing efficiency calculations, coordination numbers, and Bragg X-ray diffraction peaks.",
    examYield: "89% FREQUENT PYQ [4 MARKS]",
    pages: 5,
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
    category: "DATA STRUCTURES",
    title: "Computer Science: 3D Binary Search Trees & Tree Traversal",
    description: "Hierarchical node pointers, in-order balancing, recursive depth-first search, and asymptotic time complexities.",
    examYield: "96% CORE ALGORITHM [6 MARKS]",
    pages: 6,
    chapters: 4,
    default3DType: "binary-tree",
    sampleQuestion: "Demonstrate O(log n) search vs O(n) degenerate tree skew, and write the recursive AVL rebalancing rotation step.",
    docId: "doc-cs-tree-101",
    tags: ["BST", "AVL Trees", "Time Complexity", "Recursion"]
  },
  {
    id: "cs-graph-networks",
    subject: "CODING",
    category: "SYSTEM ARCHITECTURE",
    title: "Distributed Systems: Directed Graph Networks & Dijkstra Pathing",
    description: "Adjacency matrices, shortest path relaxation, topological sorting, and cycle detection in dependency graphs.",
    examYield: "91% HIGH YIELD [5 MARKS]",
    pages: 5,
    chapters: 3,
    default3DType: "binary-tree",
    sampleQuestion: "Trace Dijkstra's single-source shortest path algorithm using a min-heap priority queue on a 6-node weighted graph.",
    docId: "doc-cs-graphs-102",
    tags: ["Dijkstra", "Min-Heap", "Shortest Path", "Graphs"]
  },

  // --- BIOLOGY ---
  {
    id: "bio-dna-double-helix",
    subject: "BIOLOGY",
    category: "MOLECULAR GENETICS",
    title: "Genetics: DNA Double Helix Structure & Base-Pairing",
    description: "Watson-Crick antiparallel strands, major and minor grooves, hydrogen-bonding rules (A=T, G≡C), and helicase unwinding.",
    examYield: "95% TOP EXAM QUESTION [5 MARKS]",
    pages: 4,
    chapters: 3,
    default3DType: "dna-helix",
    sampleQuestion: "Describe the structural significance of 3.4 Å base stacking distance and calculate hydrogen bond density in a 100-bp fragment.",
    docId: "doc-bio-dna-501",
    tags: ["Watson-Crick", "Base Pairs", "Helicase", "Polymerase"]
  },
  {
    id: "bio-neural-synapse",
    subject: "BIOLOGY",
    category: "NEUROBIOLOGY",
    title: "Cell Biology: Action Potential Propagation & Synaptic Cleft",
    description: "Voltage-gated Na+/K+ channels, Hodgkin-Huxley membrane depolarization, and calcium-mediated neurotransmitter vesicle exocytosis.",
    examYield: "88% HIGH YIELD [4 MARKS]",
    pages: 5,
    chapters: 2,
    default3DType: "dna-helix",
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
    category: "CLASSICAL MECHANICS",
    title: "Classical Mechanics: 3D Simple Harmonic Motion & Pendulum Dynamics",
    description: "Restoring torque derivation, small-angle approximation (sin θ ≈ θ), kinetic/potential phase orbits, and damping coefficients.",
    examYield: "90% FREQUENT PYQ [4 MARKS]",
    pages: 4,
    chapters: 3,
    default3DType: "pendulum",
    sampleQuestion: "Derive the period T = 2π√(L/g) using Lagrangian mechanics and show how large amplitudes introduce elliptic integral corrections.",
    docId: "doc-physics-pendulum-301",
    tags: ["Harmonic Motion", "Lagrangian", "Small Angle", "Damping"]
  },

  // --- MATHEMATICS ---
  {
    id: "math-vector-calculus",
    subject: "MATH",
    category: "CALCULUS & GEOMETRY",
    title: "Multivariable Calculus: 3D Parametric Surfaces & Vector Fields",
    description: "Gradient vectors, divergence and curl, tangent planes to surfaces z = f(x,y), and Stokes' boundary circulation theorem.",
    examYield: "93% HIGH YIELD [6 MARKS]",
    pages: 5,
    chapters: 3,
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
    pages: 5,
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
