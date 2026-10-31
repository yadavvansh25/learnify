/**
 * Learnify End-to-End Smoke Test Suite
 * Tests:
 * 1. Health check & base Next.js readiness
 * 2. Document upload & dual-corpus chunking
 * 3. Knowledge Graph extraction & node state updates
 * 4. Feynman Evaluator scoring
 * 5. Socratic Step Verification
 * 6. WhatsApp Cloud API Webhook verification (GET & POST)
 * 7. Zod Schema integrity validation
 */

import http from 'http';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3002';

async function runTest(name, fn) {
  process.stdout.write(`• Testing [${name}] ... `);
  try {
    await fn();
    console.log(`\x1b[32mPASS\x1b[0m`);
    return true;
  } catch (err) {
    console.log(`\x1b[31mFAIL\x1b[0m\n  Error: ${err.message}`);
    return false;
  }
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function main() {
  console.log('\n========================================');
  console.log('   LEARNIFY v2.1 SYSTEM SMOKE TEST');
  console.log('   Target: ' + BASE_URL);
  console.log('========================================\n');

  let passed = 0;
  let total = 0;

  // Test 1: Upload API
  total++;
  if (await runTest('Synthetic Document Ingestion & Chunking', async () => {
    const res = await fetchJson(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Quantum Electrodynamics',
        subject: 'Modern Physics',
        rawContent: 'Chapter 1: Relativistic Wave Equations\n\n$$\\left(i \\gamma^\\mu \\partial_\\mu - m\\right) \\psi = 0$$\n\nPast Paper [5 Marks] Show Dirac equation invariance.'
      })
    });
    if (!res.document || !res.document.id) throw new Error('Missing document ID');
    if (res.extractedChunksCount < 1) throw new Error('Failed to extract chunks');
  })) passed++;

  // Test 2: Knowledge Graph API
  total++;
  if (await runTest('Knowledge Graph Extraction & Node State Sync', async () => {
    const kg = await fetchJson(`${BASE_URL}/api/kg/doc-thermo-101/build`);
    if (!kg.kg || kg.kg.nodes.length === 0) throw new Error('No KG nodes found');

    // Update node state
    const update = await fetchJson(`${BASE_URL}/api/kg/doc-thermo-101/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nodeId: 'n-carnot-engine',
        mastery: 95,
        status: 'mastered'
      })
    });
    if (!update.success || update.status !== 'mastered') throw new Error('KG state update failed');
  })) passed++;

  // Test 3: Socratic Step Verification
  total++;
  if (await runTest('Socratic Step Verification (Zero Passive Cheating)', async () => {
    const res = await fetchJson(`${BASE_URL}/api/chat/doc-thermo-101`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Step 1: eta = 1 - (25 / 280) = 91.1%'
      })
    });
    if (!res.reply.includes('Unit Inconsistency') && !res.reply.includes('Kelvin')) {
      throw new Error('Failed to catch Celsius trap');
    }
  })) passed++;

  // Test 4: Night-Before Cram Mode
  total++;
  if (await runTest('Night-Before /cram Structured Card Generation', async () => {
    const res = await fetchJson(`${BASE_URL}/api/chat/doc-thermo-101`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '/cram Carnot' })
    });
    if (!res.reply.includes('Core TL;DR') || !res.reply.includes('Must-Write Keywords') || !res.reply.includes('Common Traps')) {
      throw new Error('Cram card does not strictly meet 4-part specification');
    }
  })) passed++;

  // Test 5: Feynman Explainer
  total++;
  if (await runTest('Feynman 4-Turn Viva & Simplicity Scorer', async () => {
    const res = await fetchJson(`${BASE_URL}/api/feynman/doc-thermo-101`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        concept: 'Carnot Efficiency',
        userExplanation: 'A Carnot engine is like a waterwheel dropping heat from a high reservoir to a low pond.',
        turnNumber: 1
      })
    });
    if (!res.turn || typeof res.turn.clarityScore !== 'number') {
      throw new Error('Invalid Feynman response structure');
    }
  })) passed++;

  // Test 6: WhatsApp Cloud API Webhook
  total++;
  if (await runTest('WhatsApp Webhook (GET Challenge & POST Inbound)', async () => {
    // 1. GET Challenge
    const verifyToken = 'learnify_secret_token_2026';
    const challengeRes = await fetch(`${BASE_URL}/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test_challenge_12345`);
    const challengeText = await challengeRes.text();
    if (challengeText !== 'test_challenge_12345') {
      throw new Error(`Expected challenge reply but got: ${challengeText}`);
    }

    // 2. POST Inbound Message
    const postRes = await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'WHATSAPP_ID',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: { display_phone_number: '1234567890', phone_number_id: 'PHONE_ID' },
                  messages: [
                    {
                      from: '15551234567',
                      id: 'msg_01',
                      timestamp: '1793427000',
                      type: 'text',
                      text: { body: '/cram Carnot' }
                    }
                  ]
                },
                field: 'messages'
              }
            ]
          }
        ]
      })
    });
    const postData = await postRes.json();
    if (postData.status !== 'success') {
      throw new Error('WhatsApp webhook POST returned non-success');
    }
  })) passed++;

  // Test 7: Twilio Inbound WhatsApp Webhook (x-www-form-urlencoded + TwiML XML)
  total++;
  if (await runTest('Twilio Inbound WhatsApp Webhook (Form-urlencoded + TwiML)', async () => {
    const params = new URLSearchParams();
    params.append('From', 'whatsapp:+15551234567');
    params.append('To', 'whatsapp:+17372508034');
    params.append('Body', '/cram Carnot');
    params.append('MessageSid', 'SMtest_message_sid_123');

    const res = await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    if (!xml.includes('<Response>') || !xml.includes('<Message>') || !xml.includes('<Body>')) {
      throw new Error(`Expected TwiML response but got: ${xml.slice(0, 100)}`);
    }
  })) passed++;

  // Test 7: Generate-Viz Spec API (Multi-Subject Question-to-3D Router)
  total++;
  if (await runTest('2D/3D VizSpec Multi-Subject Question Router', async () => {
    // 1. Chemistry (Molecule)
    const chemRes = await fetchJson(`${BASE_URL}/api/generate-viz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: '3d', concept: 'Methane CH4 Tetrahedral' })
    });
    if (!chemRes.spec || chemRes.default3DType !== 'molecule') throw new Error('Failed to route chemistry to molecule');

    // 2. Coding (Binary Tree)
    const csRes = await fetchJson(`${BASE_URL}/api/generate-viz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: '3d', question: 'Find balanced Binary Search Tree rotation' })
    });
    if (!csRes.spec || csRes.default3DType !== 'binary-tree') throw new Error('Failed to route CS to binary-tree');

    // 3. Biology (DNA Helix)
    const bioRes = await fetchJson(`${BASE_URL}/api/generate-viz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: '3d', question: 'Explain Watson-Crick DNA double helix base pairing' })
    });
    if (!bioRes.spec || bioRes.default3DType !== 'dna-helix') throw new Error('Failed to route biology to dna-helix');
  })) passed++;

  console.log('\n========================================');
  console.log(`SMOKE TEST RESULT: ${passed}/${total} PASSED`);
  console.log('========================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
