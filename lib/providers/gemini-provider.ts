import { config } from '../config';

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export class GeminiProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = config.providers.geminiApiKey;
  }

  public async generateText(req: LLMRequest): Promise<string> {
    if (!this.apiKey) {
      return this.fallbackDeterministic(req);
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${req.systemPrompt}\n\n${req.userPrompt}` }] }
          ],
          generationConfig: {
            temperature: req.temperature ?? 0.2
          }
        })
      });

      if (!res.ok) {
        return this.fallbackDeterministic(req);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.fallbackDeterministic(req);
    } catch (err) {
      return this.fallbackDeterministic(req);
    }
  }

  private fallbackDeterministic(req: LLMRequest): string {
    const prompt = req.userPrompt.toLowerCase();
    if (prompt.includes('cram')) {
      return `Core TL;DR: The Carnot cycle is the theoretical ceiling for heat engine efficiency where all four strokes are fully reversible.
Must-Write Keywords: Absolute temperature in Kelvin, reversible isothermal and adiabatic strokes, eta = 1 - (T_C / T_H).
Common Traps: Substituting Celsius degrees directly into formula (ruins full credit), confusing power (MW) with energy (MJ).
Practice Problem: A geothermal plant operates between 280 °C and 25 °C. Calculate max efficiency. (Hint: Convert to 553 K and 298 K -> 46.1%)`;
    }

    return `First-principles analysis: Begin by identifying the governing conservation law before substituting numbers. State all temperatures in absolute Kelvin.`;
  }
}

export const geminiProvider = new GeminiProvider();
