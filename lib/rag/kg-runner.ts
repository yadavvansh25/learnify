import { KnowledgeGraphNode, KnowledgeGraphEdge, MasteryLevel } from './types';
import {
  INITIAL_KNOWLEDGE_GRAPH_NODES,
  INITIAL_KNOWLEDGE_GRAPH_EDGES,
  SAMPLE_CORPUS_A,
  SAMPLE_CORPUS_B
} from './sample-corpus';

/**
 * Knowledge Graph Relationship Extractor (kg-runner.ts)
 * Builds a dynamic force-directed concept dependency graph from syllabus notes & 10-year PYQ papers.
 */
export class KnowledgeGraphRunner {
  private nodes: Map<string, KnowledgeGraphNode> = new Map();
  private edges: KnowledgeGraphEdge[] = [];

  constructor() {
    // Initialize with standard nodes & edges
    INITIAL_KNOWLEDGE_GRAPH_NODES.forEach(n => this.nodes.set(n.id, { ...n }));
    this.edges = [...INITIAL_KNOWLEDGE_GRAPH_EDGES];
  }

  public getGraphData(): { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges
    };
  }

  /**
   * Recomputes graph from dual corpus
   */
  public extractFromCorpora(): { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] } {
    // Map PYQ recurrence to nodes
    for (const [id, node] of this.nodes.entries()) {
      const matchingPyqs = SAMPLE_CORPUS_B.filter(pyq =>
        pyq.relatedConceptIds.includes(id) ||
        pyq.topic.toLowerCase().includes(node.label.toLowerCase())
      );

      const totalRecurrence = matchingPyqs.reduce((acc, p) => acc + p.recurrenceFrequency, 0);
      node.recurrenceCount = Math.max(node.recurrenceCount, totalRecurrence);
      node.examWeight = Math.min(10, Math.max(5, Math.round(node.recurrenceCount)));
      node.isHighYield = node.recurrenceCount >= 7;

      if (matchingPyqs.some(p => p.examinerTraps.length > 0)) {
        node.hasTrapAlert = true;
        const topTrap = matchingPyqs.flatMap(p => p.examinerTraps)[0];
        if (topTrap) {
          node.trapWarning = topTrap;
        }
      }
    }

    return this.getGraphData();
  }

  /**
   * Update student mastery for a concept node
   */
  public updateNodeMastery(nodeId: string, newMastery: MasteryLevel): KnowledgeGraphNode | null {
    const node = this.nodes.get(nodeId);
    if (!node) return null;
    node.mastery = newMastery;
    return node;
  }

  /**
   * Add a new concept node with automatic edge generation
   */
  public addConceptNode(
    label: string,
    category: string,
    prerequisiteIds: string[],
    latexFormula?: string,
    trapWarning?: string
  ): KnowledgeGraphNode {
    const id = `node-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const newNode: KnowledgeGraphNode = {
      id,
      label,
      category,
      mastery: 'moderate',
      examWeight: 7,
      recurrenceCount: 6,
      isHighYield: true,
      hasTrapAlert: Boolean(trapWarning),
      trapWarning,
      prerequisites: prerequisiteIds,
      latexFormula,
      syllabusRef: 'Custom Chapter',
      pyqReferences: [],
      description: `Concept node dynamically extracted for ${label}.`
    };

    this.nodes.set(id, newNode);

    prerequisiteIds.forEach(prereqId => {
      if (this.nodes.has(prereqId)) {
        this.edges.push({
          id: `edge-${prereqId}-${id}`,
          source: prereqId,
          target: id,
          type: 'prerequisite'
        });
      }
    });

    return newNode;
  }
}

export const globalKgRunner = new KnowledgeGraphRunner();
