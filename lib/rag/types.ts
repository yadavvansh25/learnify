export type CorpusType = 'corpus_a' | 'corpus_b';

export interface CorpusADocument {
  id: string;
  type: 'corpus_a'; // Syllabus notes, textbooks, lectures
  courseId: string;
  courseTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionId: string;
  sectionTitle: string;
  content: string;
  latexFormulas: string[];
  concepts: string[];
  pageNumber: number;
}

export interface MarkingSchemeStep {
  stepNumber: number;
  description: string;
  allocatedMarks: number;
  mandatoryKeywords?: string[];
  evaluatorNote?: string;
}

export interface CorpusBDocument {
  id: string;
  type: 'corpus_b'; // Past 10-year exam papers & marking rubrics
  courseId: string;
  examBoard: string; // e.g., 'Cambridge A-Level', 'CBSE Class XII', 'AP Physics C'
  year: number; // e.g., 2024
  paperCode: string; // e.g., 'Paper 42'
  questionNumber: string; // e.g., 'Q3(b)'
  allocatedMarks: number; // e.g., 5
  topic: string;
  subtopic: string;
  questionText: string;
  markingScheme: MarkingSchemeStep[];
  examinerTraps: string[]; // Pitfalls flagged in examiner reports
  recurrenceFrequency: number; // Times this pattern appeared in past 10 years (1-10)
  recencyWeight: number; // 0.0 - 1.0 (recent years weighted higher)
  relatedConceptIds: string[];
}

export interface RetrievalResult {
  doc: CorpusADocument | CorpusBDocument;
  semanticSimilarity: number;
  examRecurrenceScore: number;
  recencyScore: number;
  examProbabilityScore: number; // Inverted Exam Weightage Composite Score
  highYieldBadge: boolean;
  trapAlerts: string[];
}

export type MasteryLevel = 'mastered' | 'moderate' | 'high_friction';

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: string;
  mastery: MasteryLevel;
  examWeight: number; // 1-10 determines visual node radius
  recurrenceCount: number;
  isHighYield: boolean;
  hasTrapAlert: boolean;
  trapWarning?: string;
  prerequisites: string[];
  latexFormula?: string;
  syllabusRef: string;
  pyqReferences: string[];
  description: string;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'prerequisite' | 'derives' | 'applies' | 'exam_variation';
}

export interface Flashcard {
  id: string;
  conceptId: string;
  topic: string;
  front: string;
  back: string;
  formulaLatex?: string;
  allocatedMarks: number;
  examYear: number;
  isHighYield: boolean;
  trapWarning?: string;
  // SM-2 Spaced Repetition fields
  repetition: number;
  interval: number; // in days
  easinessFactor: number; // defaults to 2.5
  lastReviewDate?: string;
  nextReviewDate: string;
  reviewState: 'new' | 'learning' | 'review' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  topic: string;
  subtopic: string;
  type: 'mcq' | 'subjective';
  question: string;
  latexEquation?: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  allocatedMarks: number;
  examRef: string; // e.g., '2023 Paper 2 [5 Marks]'
  markingRubric: MarkingSchemeStep[];
  commonMisconceptions?: Record<number, string>;
  isHighYield: boolean;
}

export interface FeynmanCritique {
  simplicityScore: number; // 0-100
  analogyScore: number; // 0-100
  groundingScore: number; // 0-100
  compositeScore: number; // 0-100
  detectedJargon: Array<{
    term: string;
    explanationMissing: boolean;
    recommendation: string;
  }>;
  identifiedTraps: string[];
  missingKeywords: string[];
  analogyAssessment: string;
  overallFeedback: string;
  suggestedAnalogy?: string;
}

export interface SocraticStepAudit {
  status: 'correct' | 'faulty' | 'incomplete';
  faultyStepIndex?: number;
  faultType?: 'sign_error' | 'algebraic_misstep' | 'unit_inconsistency' | 'formula_misapplication' | 'conceptual_gap';
  socraticHint: string;
  relevantSyllabusSection: string;
  pyqMarkSchemeCitation: string;
  guidingQuestion: string;
}
