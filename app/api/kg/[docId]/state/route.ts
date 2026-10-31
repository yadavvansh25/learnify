import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;
    const body = await request.json();
    const { nodeId, mastery = 80, status = 'mastered' } = body;

    if (!nodeId) {
      return NextResponse.json({ error: 'nodeId is required' }, { status: 400 });
    }

    globalStore.updateNodeMastery(docId, nodeId, Number(mastery), status);
    const updatedKg = globalStore.getKnowledgeGraph(docId);

    return NextResponse.json({
      success: true,
      nodeId,
      status,
      mastery,
      kg: updatedKg
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
