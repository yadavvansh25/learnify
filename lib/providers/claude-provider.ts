import { config } from '../config';
import { LLMRequest } from './gemini-provider';

export class ClaudeProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = config.providers.claudeApiKey;
  }

  public async generateText(req: LLMRequest): Promise<string> {
    if (!this.apiKey) {
      return this.fallbackDeterministic(req);
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: req.systemPrompt,
          messages: [{ role: 'user', content: req.userPrompt }]
        })
      });

      if (!res.ok) {
        return this.fallbackDeterministic(req);
      }

      const data = await res.json();
      return data.content?.[0]?.text || this.fallbackDeterministic(req);
    } catch {
      return this.fallbackDeterministic(req);
    }
  }

  private fallbackDeterministic(req: LLMRequest): string {
    return `Socratic Guide: Check your step carefully. Remember that in an isothermal expansion, work done is logarithmic: W = nRT ln(V_f / V_i).`;
  }
}

export const claudeProvider = new ClaudeProvider();
