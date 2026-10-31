import { z } from 'zod';

/**
 * 3. CORE DATA SCHEMAS (lib/schemas.ts)
 */

// 1. VizSpec Schema
export const VizSpecSchema = z.object({
  type: z.enum(['3d', '2d-anim', 'formula', 'graph', '2d-text']),
  title: z.string(),
  caption: z.string(),
  code: z.string().describe('Executable JS for Three.js canvas, Canvas 2D render loop, or KaTeX string'),
  parameters: z.record(z.string(), z.any()).optional().describe('Dictionary of dynamic control sliders/values')
});
export type VizSpec = z.infer<typeof VizSpecSchema>;

// 2. KnowledgeGraph Schema
export const KnowledgeGraphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  chapter: z.string(),
  examWeightage: z.number().min(1).max(10),
  mastery: z.number().min(0).max(100),
  status: z.enum(['unseen', 'learning', 'mastered', 'friction'])
});
export type KnowledgeGraphNode = z.infer<typeof KnowledgeGraphNodeSchema>;

export const KnowledgeGraphEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  relationship: z.enum(['prerequisite', 'derives', 'applies_to'])
});
export type KnowledgeGraphEdge = z.infer<typeof KnowledgeGraphEdgeSchema>;

export const KnowledgeGraphSchema = z.object({
  nodes: z.array(KnowledgeGraphNodeSchema),
  edges: z.array(KnowledgeGraphEdgeSchema)
});
export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;

// 3. FeynmanTurn Schema
export const FeynmanTurnSchema = z.object({
  concept: z.string(),
  userExplanation: z.string(),
  turnNumber: z.number().min(1).max(4),
  clarityScore: z.number().min(0).max(100),
  analogyScore: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()),
  evaluatorFeedback: z.string(),
  followupQuestion: z.string()
});
export type FeynmanTurn = z.infer<typeof FeynmanTurnSchema>;

// 4. QuizQuestion Schema
export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  pyqYear: z.number().optional(),
  marks: z.number().default(3),
  markingSchemeExplanation: z.string()
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

// 5. Flashcard Schema
export const FlashcardSchema = z.object({
  id: z.string(),
  front: z.string(),
  back: z.string(),
  category: z.enum(['formula', 'definition', 'theorem', 'trap']),
  interval: z.number().default(1),
  easeFactor: z.number().default(2.5)
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

// Document Entity Schema
export const DocumentMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  subject: z.string(),
  uploadedAt: z.string(),
  pageCount: z.number(),
  corpusType: z.enum(['corpus_a', 'corpus_b', 'dual']),
  summary: z.string(),
  examYieldPercentage: z.number(),
  chapters: z.array(z.object({
    id: z.string(),
    title: z.string(),
    page: z.number(),
    conceptCount: z.number(),
    highYield: z.boolean()
  }))
});
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
