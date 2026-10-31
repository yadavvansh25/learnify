import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { parsePdfContentToChunks } from '@/lib/pdf-extract';
import { DocumentMetadata } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject = 'Physics', rawContent = '' } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const docId = `doc-${Date.now()}`;
    const chunks = parsePdfContentToChunks(rawContent || 'Chapter 1: Foundations\n\n$$dU = dQ - dW$$\n\nPast Paper [5 Marks]');

    const docMetadata: DocumentMetadata = {
      id: docId,
      title: title.trim(),
      subject: subject.trim(),
      uploadedAt: new Date().toISOString(),
      pageCount: Math.max(1, Math.ceil(chunks.length / 3)),
      corpusType: 'dual',
      summary: `Dual-corpus indexed curriculum for ${title}. Identified ${chunks.length} chunks with preserved LaTeX formulas.`,
      examYieldPercentage: 88,
      chapters: [
        { id: `${docId}-ch1`, title: `Chapter 1: ${title} Principles`, page: 1, conceptCount: chunks.length, highYield: true }
      ]
    };

    globalStore.addDocument(docMetadata, {
      text: rawContent,
      pages: [
        {
          pageNumber: 1,
          text: rawContent || `Chapter 1: Theory and Core Formulations for ${title}.\n\n$$dU = dQ - dW$$\n\nPast Paper Reference: [5 Marks] Derive the governing relationship.`,
          formulas: chunks.flatMap(c => c.formulas)
        }
      ]
    });

    return NextResponse.json({
      success: true,
      document: docMetadata,
      extractedChunksCount: chunks.length
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
