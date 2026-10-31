import { NextRequest, NextResponse } from 'next/server';
import { globalDualCorpusEngine } from '@/lib/rag/dual-corpus-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || '';
    const limit = typeof body.limit === 'number' ? body.limit : 6;

    if (!query.trim()) {
      return NextResponse.json({
        stats: globalDualCorpusEngine.getCorpusStats(),
        results: []
      });
    }

    const results = globalDualCorpusEngine.query(query, limit);
    const stats = globalDualCorpusEngine.getCorpusStats();

    return NextResponse.json({
      query,
      stats,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const stats = globalDualCorpusEngine.getCorpusStats();
  return NextResponse.json({ stats });
}
