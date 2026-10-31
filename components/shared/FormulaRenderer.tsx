'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface FormulaRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const FormulaRenderer: React.FC<FormulaRendererProps> = ({
  math,
  block = false,
  className = ''
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false
      });
    } catch (err) {
      console.warn('[KaTeX error]', err);
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`my-3 overflow-x-auto py-2 text-center font-mono ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block font-mono ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
