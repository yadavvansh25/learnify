# Contributing to Learnify

Welcome to **Learnify**! We are building an open-source, exam-first academic reasoning platform combining a Reflect-grade desktop split-screen workspace, a Dual-Corpus Ingestion Engine (Textbooks + Past Year Questions), a 6-tool reasoning suite, and a Meta WhatsApp Cloud API mobile companion.

Whether you're fixing a typo, adding past examination question rubrics, or optimizing our force-directed Knowledge Graph, your contributions are warmly welcomed!

---

## 🎯 Hacktoberfest Tracks & Breakdown

We have partitioned issues into 3 structured skill tracks:

### 🟢 Track 1: Interface & Prompts (Beginner / First-Timers)
- **Target Contributions:**
  - System prompts for Night-Before `/cram <topic>` mode.
  - Feynman Technique scoring rubrics & real-world physical analogies.
  - Regex extractors for exam mark schemes (`[3 Marks]`, `[5 Marks]`).
  - Geist Sans / Mono typography audits and accessibility fixes.
  - Adding new course datasets (Calculus III, Quantum Mechanics, Chemistry, CS).

### 🟡 Track 2: Core Components (Intermediate Developers)
- **Target Contributions:**
  - Meta WhatsApp Cloud API webhook handlers & interactive button dispatchers.
  - KaTeX step-by-step formula derivation renderer and variable dictionary.
  - SuperMemo SM-2 spaced repetition scheduler tuning & streak analytics.
  - Procedural Canvas harmonic waves for the `VoiceBlob` oral viva component.
  - Timed PYQ exam simulator with step marking rubric evaluation.

### 🔴 Track 3: Graph RAG & Viz (Advanced Engineers)
- **Target Contributions:**
  - Knowledge Graph relationship extractor (`lib/rag/kg-runner.ts`).
  - Three.js WebGL dynamic 3D spatial mechanics & orbital simulators.
  - Corrective RAG (CRAG) cyclic evaluator & exam weightage inversion scoring ($EPS$).
  - Qdrant hybrid vector & keyword database integration.

---

## 🎨 Visual Identity & Design Standards ("Ink-on-Paper")

Learnify follows a high-contrast, document-centric aesthetic inspired by Reflect and Linear:
- **Zero gradients, zero synthetic paper grain, zero heavy drop shadows.**
- **Typography:** `Geist Sans` for structural prose; `Geist Mono` for formulas, units, and `[5 Marks]` tags.
- **Design Tokens:** Always utilize CSS variables defined in `app/globals.css`:
  - `--surface-canvas`: Outer chrome & topbar background (`#f6f5f2` / `#121211`)
  - `--surface-raised`: Document canvases, cards (`#ffffff` / `#1a1918`)
  - `--border-subtle`: Dividers and card boundaries (`#e5e4df` / `#2b2a28`)
  - `--status-high-yield`: Soft Sage for top exam topics (`#e8f4ec` / `#152419`)
  - `--status-trap`: Soft Coral for examiner pitfalls (`#fdefef` / `#2e1717`)

---

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/learnify.git
   cd learnify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify TypeScript compilation & build:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 🚀 Pull Request Checklist

Before submitting a Pull Request:
- [ ] Ensure `npx tsc --noEmit` and `npm run build` pass with zero errors.
- [ ] Verify that dark mode tokens render with high contrast and zero visual artifacts.
- [ ] No placeholder comments (`// TODO: implement this`).
- [ ] Link your PR to the corresponding Track Issue (`Closes #123`).

Thank you for contributing to open-source education with Learnify! 🎓
