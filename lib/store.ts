import {
  DocumentMetadata,
  KnowledgeGraph,
  QuizQuestion,
  Flashcard,
  VizSpec
} from './schemas';
import { SUBJECT_TOPICS } from './subjects-data';

// In-Memory Document Store
class LearnifyStore {
  private documents: Map<string, DocumentMetadata> = new Map();
  private pdfContents: Map<string, { text: string; pages: Array<{ pageNumber: number; text: string; formulas: string[] }> }> = new Map();
  private knowledgeGraphs: Map<string, KnowledgeGraph> = new Map();
  private quizzes: Map<string, QuizQuestion[]> = new Map();
  private flashcards: Map<string, Flashcard[]> = new Map();
  private activeVisualizers: Map<string, VizSpec> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const docId = 'doc-thermo-101';
    
    // Seed Document Metadata (Thermo)
    this.documents.set(docId, {
      id: docId,
      title: 'Physics 101: Thermodynamics & Statistical Mechanics',
      subject: 'Thermal Physics',
      uploadedAt: new Date().toISOString(),
      pageCount: 3,
      corpusType: 'dual',
      summary: 'Comprehensive dual-corpus textbook covering the First Law, Reversible Carnot Engines, Clausius Entropy, and 10-Year Cambridge A-Level PYQ mark schemes.',
      examYieldPercentage: 92,
      chapters: [
        { id: 'ch-1', title: 'Chapter 1: Foundations & The First Law', page: 1, conceptCount: 4, highYield: true },
        { id: 'ch-2', title: 'Chapter 2: Reversible Cycles & The Carnot Engine', page: 2, conceptCount: 5, highYield: true },
        { id: 'ch-3', title: 'Chapter 3: Entropy & The Second Law', page: 3, conceptCount: 4, highYield: false }
      ]
    });

    // Seed Document Metadata (Quantum)
    this.documents.set('doc-quantum-201', {
      id: 'doc-quantum-201',
      title: 'Physics 201: Quantum Mechanics & Wave Equations',
      subject: 'Quantum Physics',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      pageCount: 4,
      corpusType: 'dual',
      summary: 'Wave functions, Schrödinger equation, potential wells, and quantum harmonic oscillators with 5-year PYQ mark allocations.',
      examYieldPercentage: 88,
      chapters: [
        { id: 'qm-1', title: 'Chapter 1: Wave-Particle Duality & De Broglie', page: 1, conceptCount: 3, highYield: true },
        { id: 'qm-2', title: 'Chapter 2: Time-Independent Schrödinger Equation', page: 2, conceptCount: 4, highYield: true },
        { id: 'qm-3', title: 'Chapter 3: Infinite Potential Square Well', page: 3, conceptCount: 5, highYield: true }
      ]
    });

    // Seed Document Metadata (Linear Algebra)
    this.documents.set('doc-linear-alg-301', {
      id: 'doc-linear-alg-301',
      title: 'Math 301: Linear Algebra & Spectral Theorem',
      subject: 'Pure Mathematics',
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      pageCount: 5,
      corpusType: 'dual',
      summary: 'Vector spaces, eigenvalues, singular value decomposition (SVD), and exam-proven proof structures.',
      examYieldPercentage: 95,
      chapters: [
        { id: 'la-1', title: 'Chapter 1: Vector Spaces & Linear Independence', page: 1, conceptCount: 4, highYield: true },
        { id: 'la-2', title: 'Chapter 2: Eigenvalues & Characteristic Polynomials', page: 2, conceptCount: 6, highYield: true }
      ]
    });

    // Seed Document Metadata (Electrodynamics)
    this.documents.set('doc-electro-401', {
      id: 'doc-electro-401',
      title: 'Physics 401: Classical Electrodynamics & Maxwell Equations',
      subject: 'Electromagnetism',
      uploadedAt: new Date(Date.now() - 259200000).toISOString(),
      pageCount: 6,
      corpusType: 'dual',
      summary: 'Gauss Law, Faraday Induction, Ampere-Maxwell corrections, and electromagnetic wave propagation in vacuum.',
      examYieldPercentage: 91,
      chapters: [
        { id: 'em-1', title: 'Chapter 1: Electrostatics & Coulomb Force', page: 1, conceptCount: 3, highYield: false },
        { id: 'em-2', title: 'Chapter 2: Maxwell Equations in Differential Form', page: 2, conceptCount: 5, highYield: true }
      ]
    });

    // Seed PDF Pages & Chunks
    this.pdfContents.set(docId, {
      text: `Full academic syllabus for Thermodynamics with First Law dU = dQ - dW and Carnot Engine eta = 1 - (T_C / T_H).`,
      pages: [
        {
          pageNumber: 1,
          text: `Chapter 1: Foundations & The First Law of Thermodynamics\n\nThe First Law establishes conservation of energy: dU = \\delta Q - \\delta W. For quasi-static ideal gas expansion, work done is given by the integral W = \\int P(V) dV = nRT \\ln(V_f / V_i). In an isothermal process, \\Delta U = 0, so all absorbed heat converts directly to expansion work.`,
          formulas: ['dU = \\delta Q - \\delta W', 'W = nRT \\ln(V_f / V_i)', '\\Delta U = 0']
        },
        {
          pageNumber: 2,
          text: `Chapter 2: Reversible Cycles & The Carnot Engine\n\nSadi Carnot established that the upper efficiency bound of any heat engine operating between hot reservoir T_H and cold sink T_C is: \\eta = 1 - \\frac{T_C}{T_H}. The cycle comprises: (1) Isothermal expansion at T_H, (2) Adiabatic expansion, (3) Isothermal compression at T_C, (4) Adiabatic compression back to T_H.\n\nCRITICAL EXAM MARKING RUBRIC: Temperatures MUST strictly be converted to absolute Kelvin: T_K = T_C + 273.15. Zero credit is awarded for using Celsius.`,
          formulas: ['\\eta = 1 - \\frac{T_C}{T_H}', 'P V^\\gamma = \\text{constant}', 'W_{\\text{net}} = Q_H - |Q_C|']
        },
        {
          pageNumber: 3,
          text: `Chapter 3: Entropy & The Second Law\n\nClausius theorem states: \\oint \\frac{dQ_{\\text{rev}}}{T} \\le 0. Thermodynamic entropy change is dS = \\frac{dQ_{\\text{rev}}}{T}. Microscopic Boltzmann multiplicity connects disorder to microstates: S = k_B \\ln(\\Omega). For any spontaneous process in an isolated universe, \\Delta S_{\\text{universe}} \\ge 0.`,
          formulas: ['dS = \\frac{\\delta Q_{\\text{rev}}}{T}', '\\oint \\frac{dQ}{T} \\le 0', 'S = k_B \\ln(\\Omega)']
        }
      ]
    });

    // Seed Knowledge Graph
    this.knowledgeGraphs.set(docId, {
      nodes: [
        { id: 'n-first-law', label: 'First Law of Thermodynamics', chapter: 'Chapter 1', examWeightage: 8, mastery: 85, status: 'mastered' },
        { id: 'n-isothermal-work', label: 'Isothermal Expansion Work', chapter: 'Chapter 1', examWeightage: 8, mastery: 65, status: 'learning' },
        { id: 'n-adiabatic-process', label: 'Adiabatic Transformations (PV^γ)', chapter: 'Chapter 2', examWeightage: 9, mastery: 40, status: 'friction' },
        { id: 'n-carnot-engine', label: 'Carnot Heat Engine & Efficiency', chapter: 'Chapter 2', examWeightage: 10, mastery: 35, status: 'friction' },
        { id: 'n-clausius-entropy', label: 'Entropy & Clausius Inequality', chapter: 'Chapter 3', examWeightage: 7, mastery: 60, status: 'learning' }
      ],
      edges: [
        { source: 'n-first-law', target: 'n-isothermal-work', relationship: 'prerequisite' },
        { source: 'n-first-law', target: 'n-adiabatic-process', relationship: 'prerequisite' },
        { source: 'n-isothermal-work', target: 'n-carnot-engine', relationship: 'derives' },
        { source: 'n-adiabatic-process', target: 'n-carnot-engine', relationship: 'derives' },
        { source: 'n-carnot-engine', target: 'n-clausius-entropy', relationship: 'derives' }
      ]
    });

    // Seed Quizzes
    this.quizzes.set(docId, [
      {
        id: 'q-1',
        question: 'A steam turbine operates between a boiler temperature of 327 °C and a cooling condenser at 27 °C. What is the maximum theoretical efficiency achievable by this heat engine?',
        options: [
          '50.0%',
          '91.7%',
          '8.3%',
          '45.8%'
        ],
        correctIndex: 0,
        pyqYear: 2024,
        marks: 3,
        markingSchemeExplanation: 'Convert to Kelvin: T_H = 327 + 273.15 = 600 K; T_C = 27 + 273.15 = 300 K. Efficiency eta = 1 - (300 / 600) = 50.0%. Pitfall: Using Celsius directly (1 - 27/327 = 91.7%) loses all marks.'
      },
      {
        id: 'q-2',
        question: 'An ideal gas expands isothermally at temperature T from initial volume V to 3V. How much work W is performed by the expanding gas?',
        options: [
          'W = nRT ln(3)',
          'W = 2 P V',
          'W = 0',
          'W = -nRT ln(3)'
        ],
        correctIndex: 0,
        pyqYear: 2023,
        marks: 3,
        markingSchemeExplanation: 'In an isothermal process, pressure varies as P = nRT/V. Integrating P dV from V to 3V gives W = nRT ln(3). Since gas expands, work done BY gas is positive.'
      }
    ]);

    // Seed Flashcards
    this.flashcards.set(docId, [
      {
        id: 'fc-1',
        front: 'State the Carnot efficiency formula and identify the #1 most common examiner pitfall.',
        back: 'Efficiency: \\eta = 1 - \\frac{T_C}{T_H}\n\n#1 EXAMINER PITFALL: Substituting Celsius temperatures directly! Temperatures MUST ALWAYS be converted to absolute Kelvin (T_K = T_C + 273.15).',
        category: 'trap',
        interval: 1,
        easeFactor: 2.5
      },
      {
        id: 'fc-2',
        front: 'Why is mechanical work in an isothermal ideal gas expansion NOT equal to P(V_f - V_i)? What is the correct formula?',
        back: 'Because pressure is NOT constant throughout an isothermal process (P diminishes inversely with V).\n\nIntegration yields:\nW = \\int P dV = nRT \\ln(V_f / V_i)',
        category: 'formula',
        interval: 6,
        easeFactor: 2.6
      }
    ]);
  }

  // Document methods
  public getDocuments(): DocumentMetadata[] {
    return Array.from(this.documents.values());
  }

  public getDocument(id: string): DocumentMetadata | undefined {
    const existing = this.documents.get(id);
    if (existing) return existing;

    // Check in SUBJECT_TOPICS
    const topic = SUBJECT_TOPICS.find(t => t.docId === id || t.id === id);
    if (topic) {
      const doc: DocumentMetadata = {
        id,
        title: topic.title,
        subject: topic.subject,
        uploadedAt: new Date().toISOString(),
        pageCount: topic.pages,
        corpusType: 'dual',
        summary: topic.description,
        examYieldPercentage: parseInt(topic.examYield) || 90,
        chapters: Array.from({ length: topic.chapters }, (_, i) => ({
          id: `ch-${i + 1}`,
          title: `Chapter ${i + 1}: ${topic.category} Foundations & Core Formulations`,
          page: i + 1,
          conceptCount: 4,
          highYield: true
        }))
      };
      this.documents.set(id, doc);
      return doc;
    }

    return undefined;
  }

  public addDocument(doc: DocumentMetadata, content: { text: string; pages: Array<{ pageNumber: number; text: string; formulas: string[] }> }) {
    this.documents.set(doc.id, doc);
    this.pdfContents.set(doc.id, content);
  }

  public getPdfContent(docId: string) {
    return this.pdfContents.get(docId);
  }

  // Knowledge Graph methods
  public getKnowledgeGraph(docId: string): KnowledgeGraph {
    return this.knowledgeGraphs.get(docId) || { nodes: [], edges: [] };
  }

  public updateNodeMastery(docId: string, nodeId: string, newMastery: number, newStatus: 'unseen' | 'learning' | 'mastered' | 'friction') {
    const kg = this.knowledgeGraphs.get(docId);
    if (!kg) return;
    const node = kg.nodes.find(n => n.id === nodeId);
    if (node) {
      node.mastery = newMastery;
      node.status = newStatus;
    }
  }

  // Quizzes & Flashcards
  public getQuizzes(docId: string): QuizQuestion[] {
    return this.quizzes.get(docId) || [];
  }

  public getFlashcards(docId: string): Flashcard[] {
    return this.flashcards.get(docId) || [];
  }
}

export const globalStore = new LearnifyStore();
