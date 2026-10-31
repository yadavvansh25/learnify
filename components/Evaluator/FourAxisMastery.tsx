"use client";

import React from "react";
import { MasteryEvaluator } from "@/lib/schemas-viz";

interface FourAxisMasteryProps {
  scores?: MasteryEvaluator;
}

export function FourAxisMastery({
  scores = {
    memory: 82,
    comprehension: 74,
    structure: 61,
    application: 48,
  }
}: FourAxisMasteryProps) {
  const axes = [
    {
      key: "memory",
      title: "Memory",
      value: scores.memory,
      desc: "Recall accuracy over time through spaced flashcard intervals.",
    },
    {
      key: "comprehension",
      title: "Comprehension",
      value: scores.comprehension,
      desc: "Plain-language articulation and analogy accuracy (Feynman method).",
    },
    {
      key: "structure",
      title: "Structure",
      value: scores.structure,
      desc: "Relational mapping of prerequisite concepts within the Knowledge Graph.",
    },
    {
      key: "application",
      title: "Application",
      value: scores.application,
      desc: "First-attempt solving rate across Past Year Exam questions and numericals.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {axes.map((axis) => (
          <div
            key={axis.key}
            className="p-4 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {axis.title}
                </span>
                <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {axis.value}%
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-3">
                {axis.desc}
              </p>
            </div>

            {/* Linear Progress Indicator */}
            <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${axis.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded border border-[#e5e4df] bg-[#faf9f6] dark:bg-[#1a1918] dark:border-[#2b2a28] text-xs text-[var(--text-secondary)] leading-relaxed">
        <span className="font-semibold text-[var(--text-primary)]">Monotonic Mastery Guarantee:</span> Scores use a clamp algorithm based on active evidence. Scores reflect durable retention across your study sessions.
      </div>
    </div>
  );
}

export default FourAxisMastery;
