import React from 'react';
import { globalStore } from '@/lib/store';
import { ViewerClient } from './viewer-client';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [
    { docId: 'doc-thermo-101' },
    { docId: 'doc-quantum-201' },
    { docId: 'doc-linear-alg-301' },
    { docId: 'doc-electro-401' }
  ];
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

