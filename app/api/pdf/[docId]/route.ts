import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;
  const doc = globalStore.getDocument(docId);
  const content = globalStore.getPdfContent(docId);

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  return NextResponse.json({
    document: doc,
    content: content || null
  });
}
