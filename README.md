# 📖 Learnify
### Autonomous Exam-First Agentic RAG, Knowledge Graph & Visual Reasoning Engine
> **v2.1 Master Specification** • Open-Source Production Educational Workspace

[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?style=flat&logo=threedotjs)](https://threejs.org/)
[![KaTeX](https://img.shields.io/badge/KaTeX-Math%20Rendering-green?style=flat&logo=latex)](https://katex.org/)
[![WhatsApp Cloud API](https://img.shields.io/badge/Meta-WhatsApp%20Cloud%20API-25d366?style=flat&logo=whatsapp)](https://developers.facebook.com/docs/whatsapp/cloud-api/)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026-ff7a00?style=flat)](https://hacktoberfest.com/)

---

## 1. Executive Summary & Core Philosophy

Standard "Chat with PDF" educational tools suffer from two systemic failures in high-stakes academic preparation:
1. **Flat Semantic Prioritization:** Conventional RAG treats obscure footnotes identically to core theorems appearing in 90% of past examinations.
2. **Passive Cheating:** Chatbots dump complete derivations and final numerical answers immediately, depriving students of procedural troubleshooting.

**Learnify** solves this through a three-pillar architecture:
- 🖥️ **Reflect-Grade Split-Screen Desktop Workspace:** Document Canvas alongside an interactive 6-tool reasoning pane.
- 🧠 **Dual-Corpus Ingestion & Weightage Inversion Engine:** Cross-referencing syllabus notes against 10 years of Past Year Questions (PYQs).
- 📱 **Zero-Friction WhatsApp Mobile Agent:** Meta Cloud API integration for night-before cram cards, oral viva voice evaluations, daily spaced-repetition pings, and scratchpad error debugging.

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LEARNIFY CORE ARCHITECTURE                      │
└────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────────────┐                       ┌───────────────────┐
│     DESKTOP WORKSPACE     │                       │ WHATSAPP AGENT    │
│  (Next.js 15 App Router)  │                       │ (Meta Cloud API)  │
└─────────────┬─────────────┘                       └─────────┬─────────┘
              │                                               │
     ┌────────┴────────┐                             ┌────────┴────────┐
     ▼                 ▼                             ▼                 ▼
┌──────────────┐ ┌──────────────┐             ┌─────────────┐ ┌─────────────┐
│ LEFT PANE:   │ │ RIGHT PANE:  │             │ /cram Cards │ │ Oral Viva   │
│ Canvas Reader│ │ 6-Tool Suite │             │ (TL;DR+Traps│ │ (Whisper API│
│ & Anchored   │ │ 1. Visualizer│             │ +PYQ Prob)  │ │ + Rubric)   │
│ 10-Yr PYQs   │ │ 2. KG Graph  │             └─────────────┘ └─────────────┘
└──────────────┘ │ 3. Feynman   │
                 │ 4. Socratic  │
                 │ 5. SM-2 Cards│
                 │ 6. PYQ Quiz  │
                 └──────┬───────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│        DUAL-CORPUS INGESTION & WEIGHTAGE INVERSION ENGINE (EPS)        │
├────────────────────────────────────┬───────────────────────────────────┤
│ Corpus A: Syllabus & Textbooks     │ Corpus B: 10-Year Exam Papers     │
│ • LaTeX preservation ($...$)       │ • Regex marks parser [5 Marks]    │
│ • Chapter & Concept hierarchies    │ • Recurrence frequency indexing   │
│ • First-principles theory          │ • Examiner pitfalls & rubrics     │
└────────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. The 6-Tool Right Pane Reasoning Suite

| Tool | Mode / Engine | Description |
| :--- | :--- | :--- |
| **1. Visualizer** | 5 Modes (`3D WebGL`, `2D Carnot`, `Formula`, `Graph`, `Flowtree`) | Three.js orbital mechanics, HTML5 Canvas Carnot cycle with live piston & P-V loop, KaTeX derivation dictionary, and frequency graphs. |
| **2. Knowledge Graph** | Dynamic Force-Directed SVG | Curriculum concept dependency map. Nodes categorized by mastery: *Mastered* (Soft Sage), *Moderate* (Amber), and *High Exam Friction* (Soft Coral with strikethrough). |
| **3. Feynman Evaluator** | 4-Turn Oral / Text Viva Engine | Evaluates candidate explanations along 3 criteria: Simplicity, Analogy Strength, and Core Grounding. Features procedural canvas `VoiceBlob` orb and real-time jargon detector. |
| **4. Socratic Debugger** | Step-by-Step Mathematical Auditor | Detects algebraic missteps, sign convention errors, or unit inconsistencies without spoiling final answers. Strict citations to syllabus and exam mark schemes. |
| **5. Flashcards** | SuperMemo SM-2 Spaced Repetition | 3D flip card animations with KaTeX equations on front & back. Adaptive scheduling (`Again`, `Hard`, `Good`, `Easy`) with retention streak tracking. |
| **6. PYQ Quizzes** | Timed Exam Simulator | Real exam countdown drills with step-marking rubrics (`+1 Mark Formula`, `+2 Marks Substitution`) and examiner misconception warnings. |

---

## 4. Dual-Corpus Weightage Inversion ($EPS$)

Standard semantic search fails high-stakes exam preparation by prioritizing obscure academic text. Learnify computes the **Exam Probability Score ($EPS$)**:

$$EPS = (\text{SemanticSimilarity} \times 0.40) + (\text{ExamRecurrenceFrequency} \times 0.40) + (\text{RecencyWeight} \times 0.20)$$

Questions that have appeared $\ge 7$ times over the past 10 years receive an additional $+1.8\times$ priority boost.

---

## 5. Design System ("Ink-on-Paper")

Learnify uses a clean, high-contrast, document-centric palette:
```css
:root {
  --surface-canvas: #f6f5f2;       /* Outer chrome / topbar */
  --surface-raised: #ffffff;       /* Main content panes & cards */
  --surface-sunken: #f3f2ef;       /* Inputs and active chips */
  --border-subtle: #e5e4df;
  --text-primary: #191816;
  --status-high-yield: #e8f4ec;   /* Soft Sage (Top 10% topics) */
  --status-high-yield-text: #1d6935;
  --status-trap: #fdefef;         /* Soft Coral (Examiner pitfalls) */
  --status-trap-text: #962828;
}
```

Typography:
- **Geist Sans:** UI prose, navigation, headers.
- **Geist Mono:** KaTeX formulas, units, and `[5 Marks]` badges.

---

## 6. Mobile WhatsApp Companion (Meta Cloud API)

Learnify connects directly to WhatsApp without requiring native mobile app installations:
- 🌙 **Night-Before `/cram <topic>`:** High-density revision cards containing (1) 3-line plain-English TL;DR, (2) Bold mandatory keywords, (3) Strikethrough traps (`~trap~`), and (4) 1 high-yield numerical problem.
- 🎙️ **Oral Viva Voice Notes:** Audio transcribing and terminology evaluation.
- 🔘 **Interactive Quizzes:** Daily spaced-repetition pings with native WhatsApp quick-reply buttons (A, B, C, D).
- 📷 **Vision Scratchpad Audit:** Handwritten math photo check.

An **interactive in-app WhatsApp Simulator** is built into the desktop workspace so you can test all mobile flows without requiring a live Meta account!

---

## 7. Quickstart & Installation

### Option A: Local Node.js Setup
```bash
# Clone the repository
git clone https://github.com/your-username/learnify.git
cd learnify

# Install dependencies
npm install

# Run development server
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

### Option B: 1-Click Docker Compose
```bash
docker compose up -d --build
```
This launches both the Learnify Next.js 15 application (`localhost:3000`) and the Qdrant Vector Database (`localhost:6333`).

---

## 8. Hacktoberfest Open-Source Roadmap

Join our Hacktoberfest tracks! See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for full issue guides:
- 🟢 **Track 1:** System prompts for `/cram` mode, Feynman rubrics, regex extractors for exam marks.
- 🟡 **Track 2:** Meta WhatsApp Cloud API webhooks, KaTeX step-by-step formula renderer, SM-2 flashcard scheduler.
- 🔴 **Track 3:** Knowledge graph relationship extractor (`kg-runner.ts`), Three.js WebGL spatial mechanics, CRAG cyclic evaluator.

---

## 9. License

Open-source under the MIT License. Built for students, educators, and hackers worldwide. 🚀
