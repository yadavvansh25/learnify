import { NextRequest, NextResponse } from 'next/server';
import { evaluateFeynmanExplanation } from '@/lib/feynman/evaluator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, explanation, turnNumber = 1, mandatoryKeywords } = body;

    if (!explanation || !explanation.trim()) {
      return NextResponse.json({ error: 'Explanation is required' }, { status: 400 });
    }

    const critique = evaluateFeynmanExplanation({
      topic: topic || 'Carnot Engine & Thermodynamics',
      studentExplanation: explanation,
      turnNumber,
      mandatoryKeywords
    });

    return NextResponse.json({
      topic,
      turnNumber,
      critique
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
