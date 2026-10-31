#!/usr/bin/env node
/**
 * Learnify Zero-Interstitial Tunnel Launcher
 * 
 * Creates a public HTTPS tunnel with ZERO interstitial pages or click-through blocks,
 * allowing Twilio and external webhooks to POST directly to localhost.
 * 
 * Priority:
 * 1. Cloudflare Quick Tunnel (via untun) -> https://*.trycloudflare.com
 * 2. Pinggy SSH Tunnel (fallback)        -> https://*.a.pinggy.link
 */

import { spawn } from 'node:child_process';

const PORT = process.env.PORT || 3002;

process.env.UNTUN_ACCEPT_CLOUDFLARE_NOTICE = 'true';

function printBanner(publicUrl) {
  const webhookUrl = `${publicUrl.replace(/\/+$/, '')}/api/whatsapp/webhook`;
  console.log('\n' + '='.repeat(68));
  console.log('   🚀 LEARNIFY DIRECT WEBHOOK TUNNEL (ZERO INTERSTITIAL)');
  console.log('='.repeat(68));
  console.log(`   Local Port:        http://localhost:${PORT}`);
  console.log(`   Public URL:        ${publicUrl}`);
  console.log(`   WhatsApp Webhook:  ${webhookUrl}`);
  console.log('-'.repeat(68));
  console.log('   📋 CONFIGURE IN TWILIO CONSOLE:');
  console.log('   1. Open: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox');
  console.log(`   2. Set "WHEN A MESSAGE COMES IN":`);
  console.log(`      URL:    ${webhookUrl}`);
  console.log(`      Method: HTTP POST`);
  console.log('   3. Click Save.');
  console.log('='.repeat(68) + '\n');
}

async function startCloudflareTunnel() {
  try {
    const { startTunnel } = await import('untun');
    console.log(`• Starting Cloudflare tunnel to http://localhost:${PORT} ...`);
    const tunnel = await startTunnel({
      port: Number(PORT),
      acceptCloudflareNotice: true,
    });

    const publicUrl = await tunnel.getURL();
    if (!publicUrl) {
      throw new Error('Could not retrieve public URL from Cloudflare tunnel');
    }

    printBanner(publicUrl);

    // Keep process alive
    process.on('SIGINT', async () => {
      console.log('\nStopping Cloudflare tunnel...');
      await tunnel.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await tunnel.close();
      process.exit(0);
    });

    return true;
  } catch (err) {
    console.warn('⚠️ Cloudflare tunnel initialization failed:', err.message);
    return false;
  }
}

function startPinggyTunnel() {
  console.log(`• Falling back to Pinggy SSH tunnel to http://localhost:${PORT} ...`);
  
  const pinggy = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-p', '443',
    `-R0:localhost:${PORT}`,
    'a.pinggy.io'
  ]);

  let bannerPrinted = false;

  pinggy.stdout.on('data', (data) => {
    const text = data.toString();
    const urlMatch = text.match(/https:\/\/[a-zA-Z0-9-]+\.a\.pinggy\.link/);
    if (urlMatch && !bannerPrinted) {
      bannerPrinted = true;
      printBanner(urlMatch[0]);
    }
  });

  pinggy.stderr.on('data', (data) => {
    const text = data.toString();
    if (!bannerPrinted) {
      const urlMatch = text.match(/https:\/\/[a-zA-Z0-9-]+\.a\.pinggy\.link/);
      if (urlMatch) {
        bannerPrinted = true;
        printBanner(urlMatch[0]);
      }
    }
  });

  pinggy.on('close', (code) => {
    console.log(`Pinggy process exited with code ${code}`);
    process.exit(code || 0);
  });

  process.on('SIGINT', () => {
    pinggy.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    pinggy.kill('SIGTERM');
    process.exit(0);
  });
}

async function main() {
  const cloudflareOk = await startCloudflareTunnel();
  if (!cloudflareOk) {
    startPinggyTunnel();
  }
}

main().catch((err) => {
  console.error('Fatal tunnel error:', err);
  process.exit(1);
});
