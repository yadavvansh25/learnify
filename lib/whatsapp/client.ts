import { WhatsAppResponsePayload } from './handler';

/**
 * Meta WhatsApp Cloud API Client
 */
export class WhatsAppClient {
  private phoneNumberId: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(phoneNumberId?: string, accessToken?: string, apiVersion: string = 'v21.0') {
    this.phoneNumberId = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.apiVersion = apiVersion;
  }

  public async sendMessage(payload: WhatsAppResponsePayload): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.phoneNumberId || !this.accessToken) {
      console.warn('[WhatsAppClient] Credentials not set in environment. Running in mock/simulation mode.');
      return {
        success: true,
        data: { simulated: true, payload }
      };
    }

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
            reply: { id: b.id, title: b.title.slice(0, 20) } // Meta 20-char max for button title
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
}

export const globalWhatsAppClient = new WhatsAppClient();
