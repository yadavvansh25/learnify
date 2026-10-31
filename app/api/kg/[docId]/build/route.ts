import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;
  const kg = globalStore.getKnowledgeGraph(docId);
  return NextResponse.json({ kg });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;
  const kg = globalStore.getKnowledgeGraph(docId);
  return NextResponse.json({ success: true, kg });
}
