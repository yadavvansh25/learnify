import { config } from '../config';

export interface SendTwilioMessageParams {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface TwilioMessageResponse {
  success: boolean;
  messageSid?: string;
  data?: any;
  error?: string;
}

export class TwilioWhatsAppClient {
  private accountSid: string;
  private authToken: string;
  private whatsappNumber: string;

  constructor(accountSid?: string, authToken?: string, whatsappNumber?: string) {
    this.accountSid = accountSid || config.twilio.accountSid;
    this.authToken = authToken || config.twilio.authToken;
    this.whatsappNumber = whatsappNumber || config.twilio.whatsappNumber;
  }

  /**
   * Send WhatsApp message using Twilio REST API
   */
  public async sendMessage(params: SendTwilioMessageParams): Promise<TwilioMessageResponse> {
    if (!this.accountSid || !this.authToken) {
      console.warn('[TwilioWhatsAppClient] Twilio credentials missing. Running in simulated mode.');
      return {
        success: true,
        messageSid: `sim-${Date.now()}`,
        data: { simulated: true, ...params }
      };
    }

    const normalizedTo = params.to.startsWith('whatsapp:') ? params.to : `whatsapp:${params.to}`;
    const normalizedFrom = this.whatsappNumber.startsWith('whatsapp:')
      ? this.whatsappNumber
      : `whatsapp:${this.whatsappNumber}`;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
    const basicAuth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    const formParams = new URLSearchParams();
    formParams.append('From', normalizedFrom);
    formParams.append('To', normalizedTo);
    formParams.append('Body', params.body);

    if (params.mediaUrl) {
      formParams.append('MediaUrl', params.mediaUrl);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formParams.toString()
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data?.message || `Twilio HTTP error ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        messageSid: data.sid,
        data
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Unknown network error sending Twilio WhatsApp message'
      };
    }
  }

  /**
   * Helper to generate a valid TwiML Messaging XML response
   */
  public static createTwiML(bodyText: string): string {
    const escaped = bodyText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>\n    <Body>${escaped}</Body>\n  </Message>\n</Response>`;
  }
}

export const globalTwilioWhatsAppClient = new TwilioWhatsAppClient();
