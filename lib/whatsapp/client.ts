import { WhatsAppResponsePayload } from './handler';
import { globalTwilioWhatsAppClient } from './twilio';
import { config } from '../config';

/**
 * Universal WhatsApp Client: routes to Twilio WhatsApp or Meta Cloud API
 */
export class WhatsAppClient {
  private phoneNumberId: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(phoneNumberId?: string, accessToken?: string, apiVersion: string = 'v21.0') {
    this.phoneNumberId = phoneNumberId || config.whatsapp.phoneNumberId;
    this.accessToken = accessToken || config.whatsapp.accessToken;
    this.apiVersion = apiVersion;
  }

  public async sendMessage(payload: WhatsAppResponsePayload): Promise<{ success: boolean; data?: any; error?: string }> {
    // 1. Try Twilio if configured
    if (config.twilio.accountSid && config.twilio.authToken) {
      let messageBody = payload.text || '';

      // If interactive with buttons, format nicely for Twilio WhatsApp
      if (payload.type === 'interactive' && payload.interactive) {
        const parts = [
          payload.interactive.header ? `*${payload.interactive.header}*\n` : '',
          payload.interactive.body,
          payload.interactive.footer ? `\n_${payload.interactive.footer}_` : '',
          '\n\n*Quick Actions:*',
          ...payload.interactive.buttons.map((b, idx) => `[${idx + 1}] ${b.title}`)
        ].filter(Boolean);
        messageBody = parts.join('\n');
      }

      const twilioRes = await globalTwilioWhatsAppClient.sendMessage({
        to: payload.to,
        body: messageBody
      });

      return {
        success: twilioRes.success,
        data: twilioRes.data,
        error: twilioRes.error
      };
    }

    // 2. Try Meta Cloud API if configured
    if (this.phoneNumberId && this.accessToken) {
      const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

      let bodyData: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: payload.to,
      };

      if (payload.type === 'interactive' && payload.interactive) {
        bodyData.type = 'interactive';
        bodyData.interactive = {
          type: 'button',
          ...(payload.interactive.header && {
            header: { type: 'text', text: payload.interactive.header }
          }),
          body: { text: payload.interactive.body },
          ...(payload.interactive.footer && {
            footer: { text: payload.interactive.footer }
          }),
          action: {
            buttons: payload.interactive.buttons.map(b => ({
              type: 'reply',
              reply: { id: b.id, title: b.title.slice(0, 20) }
            }))
          }
        };
      } else {
        bodyData.type = 'text';
        bodyData.text = { body: payload.text || '' };
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyData)
        });

        const data = await response.json();
        if (!response.ok) {
          return { success: false, error: data?.error?.message || response.statusText };
        }
        return { success: true, data };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // 3. Fallback: Simulation mode
    console.warn('[WhatsAppClient] Credentials not configured. Simulated dispatch.');
    return {
      success: true,
      data: { simulated: true, payload }
    };
  }
}

export const globalWhatsAppClient = new WhatsAppClient();
