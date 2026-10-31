import { CorpusADocument, CorpusBDocument, KnowledgeGraphNode, KnowledgeGraphEdge, Flashcard, QuizQuestion } from './types';

export const SAMPLE_CORPUS_A: CorpusADocument[] = [
  {
    id: 'doc-a-thermo-01',
    type: 'corpus_a',
    courseId: 'phys-101',
    courseTitle: 'Thermodynamics & Statistical Mechanics',
    chapterNumber: 1,
    chapterTitle: 'Foundations & The First Law',
    sectionId: 'sec-1.1',
    sectionTitle: 'Internal Energy and Quasi-Static Work',
    content: `The First Law of Thermodynamics is the formulation of the principle of conservation of energy for thermodynamic systems. For an infinitesimal quasi-static transformation, the differential change in internal energy $dU$ is given by:

$$dU = \\delta Q - \\delta W$$

where $\\delta Q$ represents heat supplied to the system, and $\\delta W = P dV$ is the mechanical work performed by the system against external pressure $P$.

Important Note on Sign Convention: In modern IUPAC physics examinations, work done BY the system on the surroundings is treated as positive in $dU = \\delta Q - \\delta W$, or alternatively in chemical thermodynamics $dU = \\delta Q + \\delta W_{on}$. When computing expansion work:

$$W = \\int_{V_i}^{V_f} P(V) \\, dV$$

For an ideal gas undergoing an isothermal process ($T = \\text{constant}$), the equation of state $PV = nRT$ yields:

$$W = nRT \\ln\\left(\\frac{V_f}{V_i}\\right) = nRT \\ln\\left(\\frac{P_i}{P_f}\\right)$$

Because temperature is constant for an ideal gas, $\\Delta U = 0$, implying $Q = W$. All absorbed heat is converted completely into boundary work during that single isothermal stroke.`,
    latexFormulas: [
      'dU = \\delta Q - \\delta W',
      'W = \\int_{V_i}^{V_f} P(V) \\, dV',
      'W = nRT \\ln\\left(\\frac{V_f}{V_i}\\right)',
      '\\Delta U = n C_v \\Delta T'
    ],
    concepts: ['First Law of Thermodynamics', 'Internal Energy', 'Quasi-Static Work', 'Isothermal Expansion'],
    pageNumber: 14
  },
  {
    id: 'doc-a-thermo-02',
    type: 'corpus_a',
    courseId: 'phys-101',
    courseTitle: 'Thermodynamics & Statistical Mechanics',
    chapterNumber: 2,
    chapterTitle: 'Reversible Cycles & The Carnot Engine',
    sectionId: 'sec-2.1',
    sectionTitle: 'The Four Stages of the Carnot Cycle',
    content: `Nicolas Léonard Sadi Carnot established in 1824 that the maximum theoretical efficiency of any heat engine operating between two thermal reservoirs at temperatures $T_H$ (hot) and $T_C$ (cold) depends solely on these absolute temperatures.

The ideal Carnot Cycle consists of four sequential, reversible strokes:

1. Stage 1 -> 2: Reversible Isothermal Expansion at $T_H$. The gas expands from $V_1$ to $V_2$, absorbing heat $Q_H = nRT_H \\ln(V_2/V_1)$.
2. Stage 2 -> 3: Reversible Adiabatic Expansion from $T_H$ down to $T_C$. No heat enters or leaves ($Q = 0$). The gas obeys $P V^\\gamma = \\text{constant}$ and $T V^{\\gamma-1} = \\text{constant}$. Work done is $W_{2\\to 3} = \\frac{n R (T_H - T_C)}{\\gamma - 1}$.
3. Stage 3 -> 4: Reversible Isothermal Compression at $T_C$. The gas is compressed from $V_3$ to $V_4$, ejecting heat $|Q_C| = nRT_C \\ln(V_3/V_4)$ to the cold sink.
4. Stage 4 -> 1: Reversible Adiabatic Compression back to $T_H$. Work is done ON the gas, elevating its temperature back to $T_H$ to close the state loop.

Net thermal efficiency is defined as:

$$\\eta = \\frac{W_{\\text{net}}}{Q_H} = \\frac{Q_H - |Q_C|}{Q_H} = 1 - \\frac{T_C}{T_H}$$

Crucial Exam Theorem: No real heat engine operating between two given reservoirs can be more efficient than a Carnot engine operating between the same reservoirs.`,
    latexFormulas: [
      '\\eta = 1 - \\frac{T_C}{T_H}',
      'Q_H = nRT_H \\ln(V_2/V_1)',
      'P V^\\gamma = \\text{const}',
      'T V^{\\gamma-1} = \\text{const}',
      'W_{\\text{net}} = Q_H - |Q_C|'
    ],
    concepts: ['Carnot Cycle', 'Carnot Efficiency', 'Adiabatic Expansion', 'Thermal Reservoirs', 'Reversibility'],
    pageNumber: 38
  },
  {
    id: 'doc-a-thermo-03',
    type: 'corpus_a',
    courseId: 'phys-101',
    courseTitle: 'Thermodynamics & Statistical Mechanics',
    chapterNumber: 3,
    chapterTitle: 'Entropy & The Second Law',
    sectionId: 'sec-3.1',
    sectionTitle: 'Clausius Inequality and Thermodynamic Entropy',
    content: `Rudolf Clausius formulated the Second Law of Thermodynamics mathematically through the Clausius Theorem. For any thermodynamic cycle:

$$\\oint \\frac{\\delta Q_{\\text{rev}}}{T} \\le 0$$

where equality holds strictly for reversible cycles, and the strict inequality holds for irreversible cycles. This guarantees the existence of a state function called Entropy $S$:

$$dS = \\frac{\\delta Q_{\\text{rev}}}{T}, \\quad \\Delta S = S_B - S_A = \\int_A^B \\frac{\\delta Q_{\\text{rev}}}{T}$$

For an isolated system undergoing any natural process:

$$\\Delta S_{\\text{isolated}} \\ge 0$$

Microscopic Boltzmann interpretation:
$$S = k_B \\ln(\\Omega)$$
where $k_B = 1.380649 \\times 10^{-23} \\, \\text{J/K}$ is the Boltzmann constant and $\\Omega$ represents the number of accessible microstates.`,
    latexFormulas: [
      'dS = \\frac{\\delta Q_{\\text{rev}}}{T}',
      '\\oint \\frac{\\delta Q}{T} \\le 0',
      '\\Delta S_{\\text{universe}} \\ge 0',
      'S = k_B \\ln(\\Omega)'
    ],
    concepts: ['Entropy', 'Clausius Inequality', 'Second Law', 'Microstates', 'Boltzmann Constant'],
    pageNumber: 52
  }
];

export const SAMPLE_CORPUS_B: CorpusBDocument[] = [
  {
    id: 'pyq-2024-p42-q3',
    type: 'corpus_b',
    courseId: 'phys-101',
    examBoard: 'Cambridge A-Level / Advanced Physics',
    year: 2024,
    paperCode: 'Paper 42 (Structured Questions)',
    questionNumber: 'Q3(b)',
    allocatedMarks: 5,
    topic: 'Carnot Engine & Efficiency',
    subtopic: 'Efficiency with Reservoir Temperature Limits',
    questionText: 'A geothermal power plant operates on a cycle resembling an ideal Carnot engine between a hydrothermal vapor reservoir at 280 °C and an ambient condensation stream at 25 °C.\n\n(i) Calculate the maximum theoretical thermal efficiency of this power plant. [3 Marks]\n(ii) If the plant delivers a net electrical output of 120 MW, determine the rate of waste heat rejected into the ambient stream per second. [2 Marks]',
    markingScheme: [
      {
        stepNumber: 1,
        description: 'Convert Celsius to absolute thermodynamic temperatures in Kelvin: T_H = 280 + 273.15 = 553.15 K and T_C = 25 + 273.15 = 298.15 K',
        allocatedMarks: 1,
        mandatoryKeywords: ['Kelvin', 'absolute temperature', '273'],
        evaluatorNote: 'Zero marks for using degrees Celsius directly in the efficiency formula.'
      },
      {
        stepNumber: 2,
        description: 'Apply Carnot efficiency equation: eta = 1 - (T_C / T_H) = 1 - (298.15 / 553.15) = 0.4610 (or 46.1%)',
        allocatedMarks: 2,
        mandatoryKeywords: ['\\eta = 1 - T_C/T_H', '46.1%', '0.461'],
        evaluatorNote: 'Allow 46% if working clearly shows 3 significant figures intermediate calculation.'
      },
      {
        stepNumber: 3,
        description: 'Compute total thermal input rate Q_H = W_net / eta = 120 MW / 0.4610 = 260.3 MW. Reject rate Q_C = Q_H - W_net = 260.3 - 120 = 140.3 MW (or 1.40 x 10^8 J/s)',
        allocatedMarks: 2,
        mandatoryKeywords: ['Q_C = Q_H - W', '140 MW', 'J/s'],
        evaluatorNote: 'Correct units (MW or J/s) mandatory for final mark.'
      }
    ],
    examinerTraps: [
      'CRITICAL TRAP: Over 44% of candidates substituted 280 °C and 25 °C directly into 1 - (25/280), obtaining an invalid efficiency of 91.1%. Absolute temperatures in Kelvin are strictly compulsory.',
      'Unit confusion between power (MW) and energy (MJ) when asked for rate of heat rejection.'
    ],
    recurrenceFrequency: 9,
    recencyWeight: 1.0,
    relatedConceptIds: ['carnot-efficiency', 'thermal-reservoirs']
  },
  {
    id: 'pyq-2023-p41-q4',
    type: 'corpus_b',
    courseId: 'phys-101',
    examBoard: 'Cambridge A-Level / Advanced Physics',
    year: 2023,
    paperCode: 'Paper 41',
    questionNumber: 'Q4(a)',
    allocatedMarks: 5,
    topic: 'First Law of Thermodynamics',
    subtopic: 'Isothermal Expansion & Work Done',
    questionText: 'An ideal diatomic gas of 0.50 moles is initially at pressure 3.0 x 10^5 Pa and volume 4.0 x 10^-3 m^3. It expands isothermally at temperature T to three times its initial volume.\n\n(i) Show that the temperature T of the gas is approximately 289 K. [2 Marks]\n(ii) Calculate the mechanical work done by the gas during this expansion. [3 Marks]',
    markingScheme: [
      {
        stepNumber: 1,
        description: 'Apply Ideal Gas Law PV = nRT to state 1: T = (P_1 * V_1) / (n * R) = (3.0e5 * 4.0e-3) / (0.50 * 8.314) = 1200 / 4.157 = 288.67 K ≈ 289 K',
        allocatedMarks: 2,
        mandatoryKeywords: ['PV = nRT', '8.314', '289 K'],
        evaluatorNote: 'Must show substitution clearly for a "Show that" question.'
      },
      {
        stepNumber: 2,
        description: 'State work formula for isothermal process: W = n R T ln(V_f / V_i) or W = P_1 V_1 ln(V_f / V_i)',
        allocatedMarks: 1,
        mandatoryKeywords: ['W = nRT ln(V_f / V_i)', 'integral P dV'],
        evaluatorNote: 'Do not award if linear P(V_f - V_i) is used for an isothermal expansion.'
      },
      {
        stepNumber: 3,
        description: 'Substitute values: W = (1200) * ln(3) = 1200 * 1.0986 = 1318 J = 1.32 kJ (to 3 s.f.)',
        allocatedMarks: 2,
        mandatoryKeywords: ['ln(3)', '1.32 kJ', '1320 J'],
        evaluatorNote: 'Full credit requires proper SI unit (J or kJ).'
      }
    ],
    examinerTraps: [
      'COMMON PITFALL: Using W = P * Delta V (assuming constant pressure) instead of logarithmic expansion integral for isothermal process.',
      'Sign error: confusing work done BY the gas (positive) with work done ON the gas.'
    ],
    recurrenceFrequency: 8,
    recencyWeight: 0.9,
    relatedConceptIds: ['isothermal-work', 'first-law']
  },
  {
    id: 'pyq-2022-p42-q2',
    type: 'corpus_b',
    courseId: 'phys-101',
    examBoard: 'CBSE Class XII Board / IIT Foundation',
    year: 2022,
    paperCode: 'Set 1 Q24',
    questionNumber: 'Q24',
    allocatedMarks: 3,
    topic: 'Entropy & Second Law',
    subtopic: 'Clausius Statement & Entropy Change',
    questionText: 'State the Clausius form of the Second Law of Thermodynamics. A block of ice of mass 0.20 kg at 0 °C melts completely into liquid water at 0 °C in a large room maintained at 25 °C. Calculate the change in entropy of the ice block. (Latent heat of fusion L_f = 3.34 x 10^5 J/kg) [3 Marks]',
    markingScheme: [
      {
        stepNumber: 1,
        description: 'Definition: It is impossible for heat to flow spontaneously from a cooler body to a warmer body without external work performed on the system.',
        allocatedMarks: 1,
        mandatoryKeywords: ['spontaneously', 'cooler to warmer', 'external work'],
        evaluatorNote: 'Spontaneous or external work keywords required.'
      },
      {
        stepNumber: 2,
        description: 'Heat absorbed by ice: Q = m * L_f = 0.20 * 3.34e5 = 6.68 x 10^4 J',
        allocatedMarks: 1,
        mandatoryKeywords: ['Q = m L_f', '66800 J'],
        evaluatorNote: 'Award for correctly calculating reversible heat transfer at constant 273.15 K.'
      },
      {
        stepNumber: 3,
        description: 'Delta S = Q / T_ice = 66800 / 273.15 = +244.5 J/K (or +245 J/K)',
        allocatedMarks: 1,
        mandatoryKeywords: ['Delta S = Q/T', '+245 J/K', '273.15 K'],
        evaluatorNote: 'Using room temperature 298 K in the denominator for the ice entropy change is a fatal error (-1 mark).'
      }
    ],
    examinerTraps: [
      'TRAP: Candidates used the room temperature (298 K) instead of the melting ice temperature (273.15 K) when calculating Delta S of the ice system.',
      'Missing positive sign: entropy increase must have positive sign or explicit statement.'
    ],
    recurrenceFrequency: 7,
    recencyWeight: 0.8,
    relatedConceptIds: ['entropy', 'clausius-inequality']
  }
];

export const INITIAL_KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = [
  {
    id: 'node-first-law',
    label: 'First Law: dU = dQ - dW',
    category: 'Thermodynamics Core',
    mastery: 'mastered',
    examWeight: 8,
    recurrenceCount: 7,
    isHighYield: true,
    hasTrapAlert: true,
    trapWarning: 'Sign convention mismatch between IUPAC physics (dW = +PdV) and chemistry.',
    prerequisites: [],
    latexFormula: 'dU = \\delta Q - P dV',
    syllabusRef: 'Chapter 1 §1.1',
    pyqReferences: ['pyq-2023-p41-q4'],
    description: 'Conservation of energy for closed thermodynamic systems.'
  },
  {
    id: 'node-isothermal-work',
    label: 'Isothermal Expansion Work',
    category: 'Thermodynamic Processes',
    mastery: 'moderate',
    examWeight: 7,
    recurrenceCount: 8,
    isHighYield: true,
    hasTrapAlert: true,
    trapWarning: 'Never use W = P*ΔV! Logarithmic integral W = nRT ln(V2/V1) is required.',
    prerequisites: ['node-first-law'],
    latexFormula: 'W = nRT \\ln(V_2/V_1)',
    syllabusRef: 'Chapter 1 §1.2',
    pyqReferences: ['pyq-2023-p41-q4'],
    description: 'Work done along constant-temperature isotherm for ideal gases.'
  },
  {
    id: 'node-adiabatic-expansion',
    label: 'Adiabatic Process: PV^γ',
    category: 'Thermodynamic Processes',
    mastery: 'high_friction',
    examWeight: 9,
    recurrenceCount: 9,
    isHighYield: true,
    hasTrapAlert: true,
    trapWarning: 'High Exam Friction: Confusing ratio of specific heats γ = Cp/Cv for monatomic (5/3) vs diatomic (7/5).',
    prerequisites: ['node-first-law'],
    latexFormula: 'P V^\\gamma = \\text{const}',
    syllabusRef: 'Chapter 2 §2.1',
    pyqReferences: ['pyq-2024-p42-q3'],
    description: 'Process with zero heat exchange (Q = 0); temperature changes solely due to work.'
  },
  {
    id: 'node-carnot-cycle',
    label: 'Carnot Heat Engine & Efficiency',
    category: 'Heat Engines',
    mastery: 'high_friction',
    examWeight: 10,
    recurrenceCount: 10,
    isHighYield: true,
    hasTrapAlert: true,
    trapWarning: 'OVER 44% EXAM FAILURE: Forgetting Celsius to Kelvin conversion (T_K = T_C + 273.15).',
    prerequisites: ['node-isothermal-work', 'node-adiabatic-expansion'],
    latexFormula: '\\eta = 1 - \\frac{T_C}{T_H}',
    syllabusRef: 'Chapter 2 §2.1',
    pyqReferences: ['pyq-2024-p42-q3'],
    description: 'The maximum theoretical efficiency reachable between two heat reservoirs.'
  },
  {
    id: 'node-entropy-second-law',
    label: 'Entropy & Clausius Inequality',
    category: 'Second Law',
    mastery: 'moderate',
    examWeight: 8,
    recurrenceCount: 7,
    isHighYield: true,
    hasTrapAlert: true,
    trapWarning: 'Evaluating ΔS of system vs ΔS of surroundings: universe entropy must increase.',
    prerequisites: ['node-carnot-cycle'],
    latexFormula: 'dS = \\frac{\\delta Q_{\\text{rev}}}{T}',
    syllabusRef: 'Chapter 3 §3.1',
    pyqReferences: ['pyq-2022-p42-q2'],
    description: 'State function measuring statistical disorder and directional spontaneity.'
  },
  {
    id: 'node-refrigerators-cop',
    label: 'Refrigerators & COP',
    category: 'Heat Engines',
    mastery: 'mastered',
    examWeight: 6,
    recurrenceCount: 5,
    isHighYield: false,
    hasTrapAlert: false,
    prerequisites: ['node-carnot-cycle'],
    latexFormula: 'COP = \\frac{T_C}{T_H - T_C}',
    syllabusRef: 'Chapter 2 §2.3',
    pyqReferences: [],
    description: 'Reversed Carnot cycle operating to extract heat from a cold enclosure.'
  }
];

export const INITIAL_KNOWLEDGE_GRAPH_EDGES: KnowledgeGraphEdge[] = [
  { id: 'edge-1', source: 'node-first-law', target: 'node-isothermal-work', type: 'prerequisite' },
  { id: 'edge-2', source: 'node-first-law', target: 'node-adiabatic-expansion', type: 'prerequisite' },
  { id: 'edge-3', source: 'node-isothermal-work', target: 'node-carnot-cycle', type: 'derives' },
  { id: 'edge-4', source: 'node-adiabatic-expansion', target: 'node-carnot-cycle', type: 'derives' },
  { id: 'edge-5', source: 'node-carnot-cycle', target: 'node-entropy-second-law', type: 'derives' },
  { id: 'edge-6', source: 'node-carnot-cycle', target: 'node-refrigerators-cop', type: 'applies' }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-carnot-efficiency',
    conceptId: 'node-carnot-cycle',
    topic: 'Carnot Heat Engine',
    front: 'State the formula for maximum theoretical Carnot thermal efficiency η, and identify the #1 most common examiner pitfall.',
    back: 'Carnot Efficiency formula:\n$$\\eta = 1 - \\frac{T_C}{T_H}$$\n\n#1 EXAMINER PITFALL: Substituting Celsius temperatures directly! Temperatures MUST ALWAYS be converted to absolute Kelvin ($K = ^\\circ C + 273.15$).\n\nAlso note: $\\eta < 1$ always because $T_C > 0$ K in practice.',
    formulaLatex: '\\eta = 1 - \\frac{T_C}{T_H}',
    allocatedMarks: 3,
    examYear: 2024,
    isHighYield: true,
    trapWarning: 'Over 44% of students lose all marks by using Celsius!',
    repetition: 0,
    interval: 1,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewState: 'new'
  },
  {
    id: 'fc-isothermal-work',
    conceptId: 'node-isothermal-work',
    topic: 'Thermodynamics - First Law',
    front: 'Why is mechanical work in an isothermal ideal gas expansion NOT equal to P(V_f - V_i)? What is the correct expression?',
    back: 'Because pressure is NOT constant throughout an isothermal process ($P = nRT/V$ diminishes as $V$ increases).\n\nIntegration yields:\n$$W = \\int_{V_i}^{V_f} P \\, dV = nRT \\ln\\left(\\frac{V_f}{V_i}\\right)$$\n\nExam Tip: For an expansion $V_f > V_i$, $\\ln(V_f/V_i) > 0$, so $W > 0$ (work done BY gas).',
    formulaLatex: 'W = nRT \\ln(V_f / V_i)',
    allocatedMarks: 3,
    examYear: 2023,
    isHighYield: true,
    trapWarning: 'Using constant pressure equation P*ΔV is awarded 0 marks.',
    repetition: 1,
    interval: 6,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewState: 'review'
  },
  {
    id: 'fc-adiabatic-index',
    conceptId: 'node-adiabatic-expansion',
    topic: 'Adiabatic Transformations',
    front: 'In an adiabatic expansion of an ideal gas, state the relations between (P, V) and (T, V). How is the adiabatic index γ defined?',
    back: 'Adiabatic Relations:\n$$P V^\\gamma = \\text{constant}$$\n$$T V^{\\gamma - 1} = \\text{constant}$$\n\nAdiabatic Index:\n$$\\gamma = \\frac{C_p}{C_v}$$\n- For Monatomic gas (He, Ne, Ar): $\\gamma = 5/3 \\approx 1.67$\n- For Diatomic gas ($N_2, O_2$): $\\gamma = 7/5 = 1.40$',
    formulaLatex: 'P V^\\gamma = \\text{const}, \\quad T V^{\\gamma-1} = \\text{const}',
    allocatedMarks: 5,
    examYear: 2023,
    isHighYield: true,
    trapWarning: 'Confusing monatomic γ (1.67) with diatomic γ (1.40).',
    repetition: 0,
    interval: 1,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewState: 'new'
  },
  {
    id: 'fc-entropy-definition',
    conceptId: 'node-entropy-second-law',
    topic: 'Entropy & Second Law',
    front: 'Define thermodynamic entropy change dS for a reversible process and state the Clausius inequality for any cyclic process.',
    back: 'Differential entropy change:\n$$dS = \\frac{\\delta Q_{\\text{rev}}}{T}$$\n\nClausius Inequality:\n$$\\oint \\frac{\\delta Q}{T} \\le 0$$\nEquality holds strictly for reversible cycles; strict inequality (< 0) holds for irreversible cycles.',
    formulaLatex: 'dS = \\frac{\\delta Q_{\\text{rev}}}{T}, \\quad \\oint \\frac{\\delta Q}{T} \\le 0',
    allocatedMarks: 3,
    examYear: 2022,
    isHighYield: false,
    repetition: 2,
    interval: 15,
    easinessFactor: 2.6,
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewState: 'mastered'
  }
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-carnot-temp',
    topic: 'Carnot Efficiency',
    subtopic: 'Kelvin Conversion & Limiting Efficiency',
    type: 'mcq',
    question: 'A steam turbine operates between a boiler temperature of 327 °C and a condenser cooling pond at 27 °C. What is the maximum theoretical efficiency achievable by this heat engine?',
    latexEquation: '\\eta = 1 - \\frac{T_C}{T_H}',
    options: [
      '50.0%',
      '91.7%',
      '8.3%',
      '45.8%'
    ],
    correctOptionIndex: 0,
    explanation: 'Convert Celsius to absolute Kelvin: T_H = 327 + 273 = 600 K; T_C = 27 + 273 = 300 K. Efficiency η = 1 - (300 / 600) = 1 - 0.50 = 0.50 or 50.0%.',
    allocatedMarks: 3,
    examRef: 'PYQ 2024 Paper 42 [3 Marks]',
    markingRubric: [
      { stepNumber: 1, description: 'Convert temperatures to Kelvin (600 K and 300 K)', allocatedMarks: 1 },
      { stepNumber: 2, description: 'Apply η = 1 - T_C/T_H with substituted values', allocatedMarks: 1 },
      { stepNumber: 3, description: 'Final answer 50.0% with proper percentage or decimal', allocatedMarks: 1 }
    ],
    commonMisconceptions: {
      1: 'CRITICAL TRAP: You used Celsius directly: 1 - (27/327) = 91.7%! In thermodynamics, Carnot efficiency requires absolute Kelvin.'
    },
    isHighYield: true
  },
  {
    id: 'quiz-isothermal-piston',
    topic: 'First Law & Work',
    subtopic: 'Isothermal Expansion of Ideal Gas',
    type: 'mcq',
    question: 'An ideal gas undergoes an isothermal expansion from volume V to 4V at constant temperature T. How much heat Q was absorbed from the thermal bath during this process?',
    latexEquation: 'Q = W = nRT \\ln\\left(\\frac{V_f}{V_i}\\right)',
    options: [
      'Q = nRT ln(4) ≈ 1.386 nRT',
      'Q = 0 (because temperature is constant)',
      'Q = 3 P V',
      'Q = -nRT ln(4)'
    ],
    correctOptionIndex: 0,
    explanation: 'Since the process is isothermal and the gas is ideal, internal energy ΔU = 0. By the First Law: dU = Q - W = 0 => Q = W. The work done is W = nRT ln(4V/V) = nRT ln(4) > 0. Therefore Q = nRT ln(4).',
    allocatedMarks: 3,
    examRef: 'PYQ 2023 Paper 41 [3 Marks]',
    markingRubric: [
      { stepNumber: 1, description: 'Recognize ΔU = 0 for isothermal ideal gas', allocatedMarks: 1 },
      { stepNumber: 2, description: 'Apply Q = W and logarithmic work formula', allocatedMarks: 2 }
    ],
    commonMisconceptions: {
      1: 'Trap: Confusing isothermal (ΔT = 0, ΔU = 0) with adiabatic (Q = 0). During isothermal expansion, heat MUST enter to keep temperature constant.'
    },
    isHighYield: true
  },
  {
    id: 'quiz-carnot-stages',
    topic: 'Carnot Cycle',
    subtopic: 'Stage Sequence & P-V Diagram',
    type: 'mcq',
    question: 'In which stage of the Carnot cycle is heat ejected to the low-temperature cold reservoir?',
    options: [
      'Stage 3: Reversible Isothermal Compression at T_C',
      'Stage 2: Reversible Adiabatic Expansion',
      'Stage 1: Reversible Isothermal Expansion at T_H',
      'Stage 4: Reversible Adiabatic Compression'
    ],
    correctOptionIndex: 0,
    explanation: 'Heat is absorbed during Stage 1 (Isothermal expansion at T_H) and rejected during Stage 3 (Isothermal compression at T_C). During stages 2 and 4 (adiabatic), heat transfer Q is zero.',
    allocatedMarks: 2,
    examRef: 'PYQ 2022 Paper 2 [2 Marks]',
    markingRubric: [
      { stepNumber: 1, description: 'Identify isothermal compression as the heat-ejection phase', allocatedMarks: 2 }
    ],
    isHighYield: false
  }
];
