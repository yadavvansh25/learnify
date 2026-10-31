import { z } from "zod";

// 1. Multi-Mode Visualizer Runtime Schema
export const VizModeSchema = z.enum([
  "3d",
  "2d-anim",
  "formula",
  "source-citation",
  "graph"
]);
export type VizMode = z.infer<typeof VizModeSchema>;

export const VizSpecSchema = z.object({
  id: z.string(),
  mode: VizModeSchema,
  title: z.string(),
  subtitle: z.string(),
  tagTrigger: z.string(), // Concept tag inside PDF (e.g. "Tetrahedral geometry")
  data: z.record(z.string(), z.any()), // Parameters specific to the active visualizer mode
});
export type VizSpec = z.infer<typeof VizSpecSchema>;

// 2. Knowledge Graph Schema
export const KGNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  mastery: z.number().min(0).max(100), // 0 to 100%
  chapter: z.string(),
  examWeightage: z.number().default(3), // Average marks tested
});
export type KGNode = z.infer<typeof KGNodeSchema>;

export const KGEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  relationship: z.enum(["prerequisite", "derives", "application"]),
});
export type KGEdge = z.infer<typeof KGEdgeSchema>;

export const KnowledgeGraphSchema = z.object({
  nodes: z.array(KGNodeSchema),
  edges: z.array(KGEdgeSchema),
});
export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;

// 3. Four-Axis Mastery Evaluator Schema
export const MasteryEvaluatorSchema = z.object({
  memory: z.number().min(0).max(100),       // Recall over time
  comprehension: z.number().min(0).max(100), // Understanding in own words (Feynman)
  structure: z.number().min(0).max(100),     // How concepts link together (Graph)
  application: z.number().min(0).max(100),   // Problem-solving & transfers (Quizzes/PYQs)
});
export type MasteryEvaluator = z.infer<typeof MasteryEvaluatorSchema>;
