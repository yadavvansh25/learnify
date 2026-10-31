import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text();
    let incomingMsg = "";
    let from = "";

    if (rawText.trim().startsWith("{")) {
      try {
        const json = JSON.parse(rawText);
        incomingMsg =
          json.Body ||
          json.text?.body ||
          json.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ||
          "";
        from =
          json.From ||
          json.from ||
          json.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
          "";
      } catch {
        // fallback to url search params
      }
    }

    if (!incomingMsg && !from) {
      const params = new URLSearchParams(rawText);
      incomingMsg = params.get("Body") || "";
      from = params.get("From") || "";
    }

    console.log(`[WHATSAPP INBOUND] Message from ${from}: "${incomingMsg}"`);

    const twiml = new twilio.twiml.MessagingResponse();
    const normalized = incomingMsg.trim().toLowerCase();

    if (normalized.startsWith("/cram")) {
      const topic = incomingMsg.replace(/\/cram/i, "").trim() || "Carnot Cycle";
      twiml.message(
        `📚 *Learnify Cram Mode: ${topic}*\n\n` +
        `• *Core TL;DR:* Thermodynamic cycle with two isothermal and two adiabatic reversible processes achieving max theoretical efficiency.\n` +
        `• *Must-Write Keywords:* $\\eta = 1 - T_C/T_H$, Isothermal Expansion, Adiabatic Reversible, Reversible Heat Engine.\n` +
        `• *Common Trap:* Temperatures MUST be in Kelvin, never Celsius!\n\n` +
        `_Tap Split-Screen viewer to explore the 3D Piston model._`
      );
    } else if (normalized.startsWith("/quiz")) {
      twiml.message(
        `📝 *Learnify Active Recall Quiz*\n\n` +
        `*Q:* For an ideal Carnot engine, efficiency depends solely on:\n` +
        `A) Working substance mass\n` +
        `B) Absolute temperatures of reservoirs\n` +
        `C) Piston cylinder volume\n` +
        `D) Speed of stroke cycle\n\n` +
        `_Reply with A, B, C, or D._`
      );
    } else {
      twiml.message(
        `⚡ *Learnify AI Doubts Solver*\n\n` +
        `Received: "${incomingMsg}"\n\n` +
        `*Answer:* Carnot engine efficiency is bounded by second law of thermodynamics: eta = 1 - (T_cold / T_hot). Reply with */cram <topic>* or */quiz* for exam drills.`
      );
    }

    // If request sent JSON (e.g. Meta Cloud API, simulator or smoke tests)
    const contentTypeHeader = req.headers.get("content-type") || "";
    if (
      contentTypeHeader.includes("application/json") &&
      !contentTypeHeader.includes("x-www-form-urlencoded")
    ) {
      return NextResponse.json({
        status: "success",
        reply: twiml.toString(),
        from,
        body: incomingMsg,
      });
    }

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("[WHATSAPP WEBHOOK ERROR]", err);
    return new NextResponse(
      `<Response><Message>Learnify system busy. Error: ${err?.message || "Unknown"}</Message></Response>`,
      { status: 200, headers: { "Content-Type": "text/xml; charset=utf-8" } }
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl?.searchParams;
  const challenge = searchParams?.get("hub.challenge");
  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({
    status: "active",
    engine: "Learnify Twilio Webhook v1",
    provider: "Twilio MessagingResponse",
    webhookInstructions: {
      method: "POST",
      format: "x-www-form-urlencoded",
      params: ["From", "To", "Body", "MessageSid"],
    },
  });
}
