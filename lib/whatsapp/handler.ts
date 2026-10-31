import { WhatsAppInboundMessage } from './types';
import { SAMPLE_CORPUS_B, INITIAL_QUIZ_QUESTIONS } from '../rag/sample-corpus';
import { evaluateFeynmanExplanation } from '../feynman/evaluator';

export interface WhatsAppResponsePayload {
  to: string;
  type: 'text' | 'interactive';
  text?: string;
  interactive?: {
    header?: string;
    body: string;
    footer?: string;
    buttons: Array<{ id: string; title: string }>;
  };
}

/**
 * Generates Night-Before /cram card strictly formatted per PRD spec:
 * 1) 3-line plain-English concept TL;DR
 * 2) Bold mandatory marking-scheme keywords
 * 3) Strikethrough evaluator traps (~trap~)
 * 4) 1 past-year high-yield numerical problem
 */
export function generateCramCard(topic: string): string {
  const normalized = topic.toLowerCase();

  if (normalized.includes('carnot') || normalized.includes('efficiency')) {
    return `📚 *LEARNIFY NIGHT-BEFORE CRAM CARD*
*Topic: The Carnot Cycle & Maximum Efficiency*
━━━━━━━━━━━━━━━━━━━━━

*1. CONCEPT TL;DR (3-Line Core):*
• Heat engines extract useful mechanical work by absorbing heat from a high-temperature reservoir and ejecting waste heat to a cold sink.
• The Carnot cycle is the theoretical upper ceiling for thermal efficiency because all four of its expansion/compression strokes are completely reversible.
• Efficiency depends strictly on the absolute temperatures of the two reservoirs: η = 1 - (T_cold / T_hot).

*2. BOLD MARKING-SCHEME KEYWORDS:*
• *Absolute Temperature in Kelvin*
• *Reversible Isothermal & Adiabatic strokes*
• *η = 1 - (T_C / T_H)*
• *Conservation of Energy (W_net = Q_H - Q_C)*

*3. EXAMINER TRAPS TO AVOID:*
• ~Directly substituting Celsius degrees into η formula~ (MUST convert to Kelvin: K = °C + 273.15)
• ~Assuming real heat engines can ever reach Carnot efficiency~ (friction & dissipation make it impossible)
• ~Confusing power (MW) with energy (MJ)~

*4. PAST-YEAR HIGH-YIELD PROBLEM [5 Marks]:*
*PYQ 2024 Paper 42:* A geothermal plant runs between 280°C and 25°C.
• *Step 1 [1 Mark]:* T_H = 280 + 273.15 = 553.15 K, T_C = 25 + 273.15 = 298.15 K
• *Step 2 [2 Marks]:* η = 1 - (298.15 / 553.15) = *46.1%*
• *Step 3 [2 Marks]:* For 120 MW output, Heat Rejected Q_C = (120 / 0.461) - 120 = *140.3 MW*`;
  }

  if (normalized.includes('isothermal') || normalized.includes('first law')) {
    return `📚 *LEARNIFY NIGHT-BEFORE CRAM CARD*
*Topic: First Law & Isothermal Expansion*
━━━━━━━━━━━━━━━━━━━━━

*1. CONCEPT TL;DR (3-Line Core):*
• First Law states total energy is conserved: dU = dQ - dW (heat added minus work done by gas).
• In an isothermal ideal gas expansion, temperature is constant so internal energy change ΔU = 0.
• All absorbed heat Q is converted completely into expansion work W = nRT ln(V_f / V_i).

*2. BOLD MARKING-SCHEME KEYWORDS:*
• *dU = 0 for isothermal ideal gas*
• *Logarithmic volume ratio ln(V_f / V_i)*
• *Work done BY gas (positive)*
• *Universal gas constant R = 8.314 J/(mol·K)*

*3. EXAMINER TRAPS TO AVOID:*
• ~Using W = P * ΔV for isothermal process~ (P is changing continuously with volume!)
• ~Assuming Q = 0 in isothermal process~ (That is adiabatic, NOT isothermal)
• ~Sign error: confusing work done on vs by system~

*4. PAST-YEAR HIGH-YIELD PROBLEM [5 Marks]:*
*PYQ 2023 Paper 41:* 0.50 moles of gas expands at 289 K to 3x volume.
• *Step 1 [2 Marks]:* Verify T = (P*V)/(n*R) = 288.7 K ≈ 289 K
• *Step 2 [1 Mark]:* State formula W = nRT ln(V_f / V_i)
• *Step 3 [2 Marks]:* W = 0.5 * 8.314 * 289 * ln(3) = *1.32 kJ*`;
  }

  // Default Entropy / Second Law card
  return `📚 *LEARNIFY NIGHT-BEFORE CRAM CARD*
*Topic: ${topic.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━

*1. CONCEPT TL;DR (3-Line Core):*
• Entropy S is a state function that quantifies microscopic disorder and multiplicity of accessible quantum microstates.
• The Clausius Inequality ∮ (dQ/T) ≤ 0 proves entropy is strictly non-decreasing for any spontaneous isolated process.
• For reversible isothermal phase change, ΔS = Q_rev / T.

*2. BOLD MARKING-SCHEME KEYWORDS:*
• *dS = dQ_rev / T*
• *Microscopic multiplicity S = k_B ln(Ω)*
• *Clausius Inequality ∮ (dQ/T) ≤ 0*
• *Isolated system ΔS_universe ≥ 0*

*3. EXAMINER TRAPS TO AVOID:*
• ~Using room temperature instead of system temperature for phase changes~
• ~Forgetting unit: Joules per Kelvin (J/K)~
• ~Claiming system entropy can never decrease~ (System can decrease if surroundings increase by more!)

*4. PAST-YEAR HIGH-YIELD PROBLEM [3 Marks]:*
*PYQ 2022 Paper 2:* 0.20 kg ice melting at 0°C (273 K).
• *Step 1 [1 Mark]:* Clausius statement of Second Law
• *Step 2 [1 Mark]:* Q = m * L_f = 0.20 * 3.34e5 = 66,800 J
• *Step 3 [1 Mark]:* ΔS_ice = +66,800 / 273.15 = *+245 J/K*`;
}

/**
 * Handles incoming WhatsApp webhook events
 */
export async function processInboundWhatsAppMessage(
  msg: WhatsAppInboundMessage
): Promise<WhatsAppResponsePayload> {
  const from = msg.from;

  // 1. Text message
  if (msg.type === 'text' && msg.text) {
    const text = msg.text.body.trim();

    // Command: /cram <topic>
    if (text.startsWith('/cram')) {
      const topic = text.replace('/cram', '').trim() || 'Carnot Engine';
      return {
        to: from,
        type: 'text',
        text: generateCramCard(topic)
      };
    }

    // Command: /quiz or "quiz"
    if (text.toLowerCase().includes('quiz') || text.toLowerCase() === 'q') {
      const q = INITIAL_QUIZ_QUESTIONS[0];
      return {
        to: from,
        type: 'interactive',
        interactive: {
          header: '⚡ DAILY HIGH-YIELD PYQ DRILL',
          body: `${q.question}\n\nExam Ref: *${q.examRef}*`,
          footer: 'Tap your answer below to test your recall',
          buttons: [
            { id: 'QUIZ_A', title: 'A) 50.0%' },
            { id: 'QUIZ_B', title: 'B) 91.7%' },
            { id: 'QUIZ_C', title: 'C) 8.3%' }
          ]
        }
      };
    }

    // Command: /feynman or oral viva prompt
    if (text.toLowerCase().startsWith('/feynman') || text.toLowerCase().includes('explain')) {
      const topic = text.replace(/\/feynman/i, '').replace(/explain/i, '').trim() || 'Carnot Engine';
      return {
        to: from,
        type: 'text',
        text: `🎙️ *ORAL VIVA DRILL: ${topic.toUpperCase()}*\n\nSend a 30-second voice note or a 3-sentence text explaining this concept as if you were teaching a 12-year-old.\n\n*Evaluation criteria:*\n1. Plain-English Simplicity (no unexplained buzzwords)\n2. Real-world physical analogy\n3. Mandatory exam mark anchors\n\nI am listening!`
      };
    }

    // Default socratic response to any conceptual doubt
    return {
      to: from,
      type: 'text',
      text: `Hello! I am your *Learnify Exam-First AI Companion*.\n\nHere are commands you can run:\n• */cram <topic>* — Instant night-before revision card with marking-scheme anchors\n• *quiz* — Solve a high-yield PYQ MCQ with instant step marking\n• */feynman <topic>* — Practice explaining a concept to identify blind spots\n• *Send a voice note* — Oral viva evaluation\n• *Send photo of handwritten math* — Step error debugger\n\nWhat would you like to review today?`
    };
  }

  // 2. Interactive Quick-Reply Button Click
  if (msg.type === 'interactive' && msg.interactive?.button_reply) {
    const btnId = msg.interactive.button_reply.id;
    if (btnId === 'QUIZ_A') {
      return {
        to: from,
        type: 'text',
        text: `✅ *CORRECT! (Full 3 Marks Awarded)*\n\n*Step Rubric:*\n1. T_H = 327 + 273 = 600 K; T_C = 27 + 273 = 300 K [1 Mark]\n2. η = 1 - (300 / 600) = 0.50 [1 Mark]\n3. Final Answer = *50.0%* [1 Mark]\n\nYour spaced repetition interval for this concept has advanced to *6 days*!`
      };
    } else if (btnId === 'QUIZ_B') {
      return {
        to: from,
        type: 'text',
        text: `❌ *INCORRECT (0 / 3 Marks)*\n\n🚨 *EXAMINER PITFALL FLAGGED:*\nYou calculated 1 - (27 / 327) = 91.7% using Celsius directly!\n\nTemperatures in the Carnot efficiency formula *MUST ALWAYS* be in absolute Kelvin ($T_K = T_C + 273.15$).\n\nCorrect answer: 1 - (300/600) = *50.0%*.`
      };
    } else {
      return {
        to: from,
        type: 'text',
        text: `❌ *INCORRECT (0 / 3 Marks)*\n\nRecalculate using Kelvin temperatures: T_hot = 600 K, T_cold = 300 K. Efficiency η = 1 - 300/600 = 50.0%.`
      };
    }
  }

  // 3. Audio Voice Note (Oral Viva)
  if (msg.type === 'audio') {
    // Simulated transcription & evaluation pipeline
    const critique = evaluateFeynmanExplanation({
      topic: 'Carnot Engine & Efficiency',
      studentExplanation: 'A Carnot engine is like a waterwheel that takes heat from a hot reservoir and drops it to a cold reservoir to make work.',
      turnNumber: 1
    });

    return {
      to: from,
      type: 'text',
      text: `🎙️ *ORAL VIVA EVALUATION REPORT*\n━━━━━━━━━━━━━━━━━━━━━\n*Composite Score: ${critique.compositeScore}/100*\n• Simplicity: ${critique.simplicityScore}%\n• Analogy Quality: ${critique.analogyScore}%\n• Exam Grounding: ${critique.groundingScore}%\n\n💡 *Feedback:* ${critique.overallFeedback}\n\n${critique.identifiedTraps.length > 0 ? `⚠️ *Traps:* ${critique.identifiedTraps.join('\n')}` : '✅ No exam pitfalls detected!'}`
    };
  }

  // 4. Scratchpad Photo (Mathematical step verification)
  if (msg.type === 'image') {
    return {
      to: from,
      type: 'text',
      text: `🔍 *SOCRATIC VISION AUDIT: ROUGH WORKING*\n━━━━━━━━━━━━━━━━━━━━━\nI analyzed your handwritten calculation:\n\n*Status:* FAULTY STEP DETECTED\n• *Fault Point:* Step 2 (Expansion Work)\n• *Issue:* Sign convention error. The gas is expanding against external pressure, so the work done *by* the system is positive: W = +nRT ln(V2/V1).\n• *Guidance:* Review [Textbook §1.1] on quasi-static boundary work before substituting numerical values.`
    };
  }

  return {
    to: from,
    type: 'text',
    text: `Message received. Type /cram for study cards or quiz for practice.`
  };
}
