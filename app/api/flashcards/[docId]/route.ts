import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;
  const flashcards = globalStore.getFlashcards(docId);

  return NextResponse.json({
    docId,
    flashcards
  });
}
