import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppWebhookPayload } from '@/lib/whatsapp/types';
import { processInboundWhatsAppMessage } from '@/lib/whatsapp/handler';
import { globalWhatsAppClient } from '@/lib/whatsapp/client';

/**
 * GET handler: Meta WhatsApp Cloud API Webhook Verification
 * Responds to Meta challenge during webhook setup
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'learnify_secret_token_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WhatsApp Webhook] Verification successful. Challenge received.');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed. Token mismatch.' }, { status: 403 });
}

/**
 * POST handler: Inbound message handling
 */
export async function POST(request: NextRequest) {
  try {
    const payload: WhatsAppWebhookPayload = await request.json();

    if (payload.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const messages = change?.messages;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: 'no_messages' }, { status: 200 });
    }

    for (const msg of messages) {
      console.log(`[WhatsApp Inbound] From ${msg.from}, type: ${msg.type}`);
      const responsePayload = await processInboundWhatsAppMessage(msg);
      await globalWhatsAppClient.sendMessage(responsePayload);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    console.error('[WhatsApp Webhook Error]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
