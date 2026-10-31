import { FeynmanCritique } from '../rag/types';

interface JargonRule {
  term: string;
  regex: RegExp;
  recommendation: string;
}

const COMMON_JARGON_RULES: JargonRule[] = [
  {
    term: 'Adiabatic',
    regex: /\badiabatic\b/i,
    recommendation: 'Explain what adiabatic actually means: "insulated so fast that no heat has time to enter or escape".'
  },
  {
    term: 'Isothermal',
    regex: /\bisothermal\b/i,
    recommendation: 'Translate isothermal into plain words: "kept at a steady temperature using a thermal bath".'
  },
  {
    term: 'Entropy',
    regex: /\bentropy\b/i,
    recommendation: 'Don\'t just say "entropy increases"; describe it using physical disorder, microstate multiplicity, or dispersed heat.'
  },
  {
    term: 'Quasi-static',
    regex: /\bquasi-static|quasistatic\b/i,
    recommendation: 'Replace with: "infinitely slow step-by-step changes keeping the system balanced at every instant".'
  },
  {
    term: 'State Function',
    regex: /\bstate\s+function\b/i,
    recommendation: 'Clarify that it depends only on current altitude/state (like elevation), not the path taken.'
  },
  {
    term: 'Reversible',
    regex: /\breversible\b/i,
    recommendation: 'Explain that the process leaves no trace or wasted friction in the surroundings if run backwards.'
  }
];

export interface EvaluateFeynmanInput {
  topic: string;
  studentExplanation: string;
  turnNumber: number; // 1 to 4
  expectedKeyTerms?: string[];
  mandatoryKeywords?: string[];
}

export function evaluateFeynmanExplanation(input: EvaluateFeynmanInput): FeynmanCritique {
  const { topic, studentExplanation, mandatoryKeywords = ['temperature', 'Kelvin', 'heat', 'work', 'energy'] } = input;
  const text = studentExplanation.trim();
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // 1. Detect Jargon
  const detectedJargon: Array<{ term: string; explanationMissing: boolean; recommendation: string }> = [];
  for (const rule of COMMON_JARGON_RULES) {
    if (rule.regex.test(text)) {
      // Check if student explained it within context
      const explainedPhrases = ['meaning', 'which means', 'in other words', 'like', 'as in', 'because no heat'];
      const isExplained = explainedPhrases.some(p => lowerText.includes(p));
      detectedJargon.push({
        term: rule.term,
        explanationMissing: !isExplained,
        recommendation: rule.recommendation
      });
    }
  }

  // 2. Analogy Strength Check
  const analogyKeywords = ['like a', 'imagine', 'think of', 'similar to', 'as if', 'waterwheel', 'bicycle pump', 'messy room', 'shuffled cards', 'engine', 'sponge', 'balloon'];
  const hasAnalogy = analogyKeywords.some(kw => lowerText.includes(kw));
  let analogyScore = 40;
  let analogyAssessment = 'No clear real-world metaphor found. Try anchoring with a daily object (e.g., a bicycle pump heating up, or a waterfall).';

  if (hasAnalogy) {
    analogyScore = 88;
    analogyAssessment = 'Great conceptual anchor! You connected the theoretical equation to an intuitive mental model.';
  } else if (wordCount > 60) {
    analogyScore = 65;
    analogyAssessment = 'Descriptive explanation, but adding an explicit physical analogy ("imagine a piston like...") will make it stick.';
  }

  // 3. Mandatory Marking-Scheme Keywords (Core Grounding)
  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of mandatoryKeywords) {
    if (lowerText.includes(kw.toLowerCase())) {
      foundKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const groundingScore = Math.min(100, Math.round((foundKeywords.length / Math.max(1, mandatoryKeywords.length)) * 100));

  // 4. Simplicity Score
  // Penalize unexplained jargon and overly dense prose; reward clarity
  const unexplainedCount = detectedJargon.filter(j => j.explanationMissing).length;
  let simplicityScore = Math.max(30, 95 - unexplainedCount * 18);
  if (wordCount < 20) {
    simplicityScore -= 25; // too brief
  }

  // 5. Exam Trap Detection
  const identifiedTraps: string[] = [];
  if (topic.toLowerCase().includes('carnot')) {
    if (lowerText.includes('celsius') || lowerText.includes('°c')) {
      identifiedTraps.push('EXAM TRAP DETECTED: You mentioned Celsius. Examiners strictly require absolute temperature in Kelvin (T_K = T_C + 273.15).');
    }
    if (!lowerText.includes('kelvin') && !lowerText.includes('absolute')) {
      identifiedTraps.push('Missing Anchor: State explicitly that temperatures in the efficiency formula must be in Kelvin.');
    }
  }

  if (topic.toLowerCase().includes('isothermal')) {
    if (lowerText.includes('p * delta v') || lowerText.includes('p*dv')) {
      identifiedTraps.push('CRITICAL TRAP: Isothermal work is NOT P*ΔV. It must be derived using the integral W = nRT ln(V2/V1).');
    }
  }

  // Composite Score
  const compositeScore = Math.round(
    simplicityScore * 0.35 + analogyScore * 0.35 + groundingScore * 0.30
  );

  // Overall feedback tailored to turn
  let overallFeedback = '';
  if (compositeScore >= 80) {
    overallFeedback = 'Outstanding Feynman delivery! You conveyed first-principles physics clearly without hiding behind academic jargon.';
  } else if (compositeScore >= 60) {
    overallFeedback = 'Good conceptual baseline. Refine your explanation by replacing abstract jargon with plain analogies and watching for exam marking anchors.';
  } else {
    overallFeedback = 'Needs simplification. Imagine you are explaining this to a 12-year-old friend who has never taken a physics class.';
  }

  const suggestedAnalogy = topic.toLowerCase().includes('carnot')
    ? 'Analogy idea: Think of a Carnot engine like a watermill. Water falls from a high reservoir (T_H) to a lower pond (T_C). The larger the height drop, the more mechanical energy the wheel can extract!'
    : topic.toLowerCase().includes('entropy')
    ? 'Analogy idea: Imagine dropping a neat stack of papers on the floor. Spontaneous drafts scatter them in hundreds of disordered ways, but they will never blow back into a sorted stack on their own.'
    : undefined;

  return {
    simplicityScore,
    analogyScore,
    groundingScore,
    compositeScore,
    detectedJargon,
    identifiedTraps,
    missingKeywords,
    analogyAssessment,
    overallFeedback,
    suggestedAnalogy
  };
}
