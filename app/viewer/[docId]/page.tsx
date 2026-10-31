import React from 'react';
import { globalStore } from '@/lib/store';
import { ViewerClient } from './viewer-client';
import { notFound } from 'next/navigation';

import { SUBJECT_TOPICS, getSubjectCurriculum } from '@/lib/subjects-data';

export function generateStaticParams() {
  const customIds = [
    'doc-thermo-101',
    'doc-quantum-201',
    'doc-linear-alg-301',
    'doc-electro-401'
  ];
  const topicIds = SUBJECT_TOPICS.map(t => t.docId);
  const uniqueIds = Array.from(new Set([...customIds, ...topicIds]));
  return uniqueIds.map(docId => ({ docId }));
}

export default async function ViewerPage({
  params
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  let doc = globalStore.getDocument(docId);

  if (!doc) {
    const curr = getSubjectCurriculum(docId);
    doc = {
      id: docId,
      title: curr.title,
      subject: curr.category,
      uploadedAt: new Date().toISOString(),
      pageCount: curr.pages.length,
      corpusType: 'dual',
      summary: curr.description,
      examYieldPercentage: parseInt(curr.examYield.match(/\d+/)?.[0] || '90', 10),
      chapters: curr.pages.map((p) => ({
        id: `ch-${p.pageNumber}`,
        title: p.chapter,
        page: p.pageNumber,
        conceptCount: p.conceptChips.length,
        highYield: true
      }))
    };
    globalStore.createDocument?.(doc);
  }

  return <ViewerClient docId={docId} initialDoc={doc} />;
}

