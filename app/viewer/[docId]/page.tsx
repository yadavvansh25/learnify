import React from 'react';
import { globalStore } from '@/lib/store';
import { ViewerClient } from './viewer-client';
import { notFound } from 'next/navigation';

import { SUBJECT_TOPICS } from '@/lib/subjects-data';

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
  const doc = globalStore.getDocument(docId);

  if (!doc) {
    // If not in store, fallback to default seed
    const defaultDoc = globalStore.getDocument('doc-thermo-101');
    if (!defaultDoc) notFound();
    return <ViewerClient docId={docId} initialDoc={{ ...defaultDoc, id: docId }} />;
  }

  return <ViewerClient docId={docId} initialDoc={doc} />;
}

