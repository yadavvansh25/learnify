import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppWebhookPayload } from '@/lib/whatsapp/types';
import { processInboundWhatsAppMessage } from '@/lib/whatsapp/handler';
import { globalWhatsAppClient } from '@/lib/whatsapp/client';
import { TwilioWhatsAppClient } from '@/lib/whatsapp/twilio';
import { config } from '@/lib/config';

/**
 * GET handler:
 * 1. Meta WhatsApp Cloud API Webhook Verification (hub.challenge)
 * 2. Twilio WhatsApp Webhook Status & Health Check
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = config.whatsapp.verifyToken;

  // Meta Cloud API subscription verification
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WhatsApp Webhook] Meta challenge verification successful.');
    return new NextResponse(challenge, { status: 200 });
  }

  // Twilio & Universal Webhook health check
  return NextResponse.json({
    status: 'active',
    service: 'Learnify WhatsApp Webhook',
    provider: 'Twilio WhatsApp API & Meta Cloud API',
    twilio: {
      accountSid: config.twilio.accountSid ? `${config.twilio.accountSid.slice(0, 8)}...` : 'not_set',
      whatsappNumber: config.twilio.whatsappNumber,
      configured: Boolean(config.twilio.accountSid && config.twilio.authToken)
    },
    meta: {
      configured: Boolean(config.whatsapp.phoneNumberId && config.whatsapp.accessToken)
    },
    webhookInstructions: {
      twilioConsoleUrl: 'https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox',
      webhookMethod: 'POST',
      recommendedUrl: `${request.nextUrl.origin}/api/whatsapp/webhook`
    }
  }, { status: 200 });
}

/**
 * POST handler: Handles both Twilio and Meta inbound WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // ----------------------------------------------------
    // CASE A: TWILIO INBOUND WEBHOOK (form-urlencoded or multipart)
    // ----------------------------------------------------
    if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      const from = formData.get('From')?.toString() || '';
      const to = formData.get('To')?.toString() || '';
      const body = formData.get('Body')?.toString() || '';
      const messageSid = formData.get('MessageSid')?.toString() || `msg-${Date.now()}`;

      console.log(`[Twilio Inbound] From: ${from}, To: ${to}, Body: "${body}"`);

      // Process with Learnify exam reasoning & socratic engine
      const responsePayload = await processInboundWhatsAppMessage({
        from: from.replace('whatsapp:', ''),
        id: messageSid,
        timestamp: String(Date.now()),
        type: 'text',
        text: { body }
      });

      // Format response text with actions for WhatsApp
      let responseText = responsePayload.text || '';
      if (responsePayload.type === 'interactive' && responsePayload.interactive) {
        const parts = [
          responsePayload.interactive.header ? `*${responsePayload.interactive.header}*\n` : '',
          responsePayload.interactive.body,
          responsePayload.interactive.footer ? `\n_${responsePayload.interactive.footer}_` : '',
          '\n\n*Quick Actions:*',
          ...responsePayload.interactive.buttons.map((b, idx) => `[${idx + 1}] ${b.title}`)
        ].filter(Boolean);
        responseText = parts.join('\n');
      }

      // Return TwiML so Twilio automatically sends the reply back to the user
      const twiml = TwilioWhatsAppClient.createTwiML(responseText);
      return new NextResponse(twiml, {
        status: 200,
        headers: {
          'Content-Type': 'text/xml; charset=utf-8'
        }
      });
    }

    // ----------------------------------------------------
    // CASE B: JSON PAYLOAD (Meta Cloud API or Twilio JSON tests)
    // ----------------------------------------------------
    const jsonBody = await request.json();

    // Check if JSON contains Twilio direct fields (From, Body)
    if (jsonBody.From && jsonBody.Body) {
      const from = String(jsonBody.From);
      const body = String(jsonBody.Body);
      const responsePayload = await processInboundWhatsAppMessage({
        from: from.replace('whatsapp:', ''),
        id: jsonBody.MessageSid || `msg-${Date.now()}`,
        timestamp: String(Date.now()),
        type: 'text',
        text: { body }
      });

      let responseText = responsePayload.text || '';
      if (responsePayload.type === 'interactive' && responsePayload.interactive) {
        const parts = [
          responsePayload.interactive.header ? `*${responsePayload.interactive.header}*\n` : '',
          responsePayload.interactive.body,
          responsePayload.interactive.footer ? `\n_${responsePayload.interactive.footer}_` : '',
          '\n\n*Quick Actions:*',
          ...responsePayload.interactive.buttons.map((b, idx) => `[${idx + 1}] ${b.title}`)
        ].filter(Boolean);
        responseText = parts.join('\n');
      }

      const twiml = TwilioWhatsAppClient.createTwiML(responseText);
      return new NextResponse(twiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml; charset=utf-8' }
      });
    }

    // Meta WhatsApp Cloud API payload
    if (jsonBody.object === 'whatsapp_business_account') {
      const entry = jsonBody.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const messages = change?.messages;

      if (!messages || messages.length === 0) {
        return NextResponse.json({ status: 'no_messages' }, { status: 200 });
      }

      for (const msg of messages) {
        console.log(`[Meta Inbound] From ${msg.from}, type: ${msg.type}`);
        const responsePayload = await processInboundWhatsAppMessage(msg);
        await globalWhatsAppClient.sendMessage(responsePayload);
      }

      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    return NextResponse.json({ status: 'unrecognized_payload_format' }, { status: 200 });
  } catch (error: any) {
    console.error('[WhatsApp Webhook Error]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
