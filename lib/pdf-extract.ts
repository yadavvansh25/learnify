/**
 * PDF Text & LaTeX Extractor and Dual-Corpus Splitter
 * Preserves mathematical expressions ($...$ and $$...$$) and parses exam marks.
 */

export interface ExtractedChunk {
  id: string;
  corpus: 'corpus_a' | 'corpus_b';
  pageNumber: number;
  text: string;
  formulas: string[];
  concepts: string[];
  marks?: number;
  year?: number;
  examRelevanceProbability: number;
}

export function extractLatexExpressions(text: string): string[] {
  const formulas: string[] = [];
  const blockRegex = /\$\$([^$]+)\$\$/g;
  let match;
  while ((match = blockRegex.exec(text)) !== null) {
    if (match[1]) formulas.push(match[1].trim());
  }

  const inlineRegex = /\$([^$]+)\$/g;
  while ((match = inlineRegex.exec(text)) !== null) {
    if (match[1] && !formulas.includes(match[1].trim())) {
      formulas.push(match[1].trim());
    }
  }

  return formulas;
}

export function parsePdfContentToChunks(rawText: string, pageNumber: number = 1): ExtractedChunk[] {
  const paragraphs = rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks: ExtractedChunk[] = [];

  paragraphs.forEach((p, idx) => {
    const formulas = extractLatexExpressions(p);
    const marksMatch = p.match(/\[\s*(\d+)\s*(?:Marks?|marks?|M)\s*\]/i);
    const yearMatch = p.match(/\b(201\d|202\d)\b/);

    const isCorpusB = Boolean(marksMatch || p.toLowerCase().includes('past paper') || p.toLowerCase().includes('pyq') || p.toLowerCase().includes('marking scheme'));
    const marks = marksMatch ? parseInt(marksMatch[1], 10) : undefined;
    const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined;

    // Exam Relevance Probability: higher for recurring marks and past papers
    const relevance = isCorpusB ? 0.92 : (formulas.length > 0 ? 0.78 : 0.60);

    // Extract concepts
    const concepts: string[] = [];
    const words = p.split(/\s+/);
    for (const w of words) {
      if (['carnot', 'entropy', 'isothermal', 'adiabatic', 'thermodynamic', 'efficiency', 'work', 'internal'].includes(w.toLowerCase().replace(/[^a-z]/g, ''))) {
        const clean = w.replace(/[^a-zA-Z]/g, '');
        if (!concepts.includes(clean)) concepts.push(clean);
      }
    }

    chunks.push({
      id: `chunk-${pageNumber}-${idx + 1}`,
      corpus: isCorpusB ? 'corpus_b' : 'corpus_a',
      pageNumber,
      text: p.trim(),
      formulas,
      concepts,
      marks,
      year,
      examRelevanceProbability: relevance
    });
  });

  return chunks;
}
