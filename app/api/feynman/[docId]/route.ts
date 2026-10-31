import { NextRequest, NextResponse } from 'next/server';
import { FeynmanTurn } from '@/lib/schemas';
import { evaluateFeynmanExplanation } from '@/lib/feynman/evaluator';
import { globalStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;
    const body = await request.json();
    const { concept = 'Carnot Engine', userExplanation = '', turnNumber = 1 } = body;

    const critique = evaluateFeynmanExplanation({
      topic: concept,
      studentExplanation: userExplanation,
      turnNumber
    });

    const turn: FeynmanTurn = {
      concept,
      userExplanation,
      turnNumber,
      clarityScore: critique.simplicityScore,
      analogyScore: critique.analogyScore,
      missingKeywords: critique.missingKeywords,
      evaluatorFeedback: critique.overallFeedback,
      followupQuestion: critique.suggestedAnalogy
        ? `Can you incorporate this analogy: "${critique.suggestedAnalogy}" into your explanation?`
        : 'How does this principle relate to the absolute zero limit of thermodynamic temperature?'
    };

    // Update node in store if good score
    if (turn.clarityScore >= 70 && turn.analogyScore >= 70) {
      globalStore.updateNodeMastery(docId, 'n-carnot-engine', 85, 'mastered');
    }

    return NextResponse.json({
      success: true,
      turn
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
