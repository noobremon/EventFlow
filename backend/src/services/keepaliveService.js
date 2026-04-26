const http = require('http');
const https = require('https');
const { URL } = require('url');
const config = require('../config/env');

const fetchUrl = (rawUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const normalized = rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`;
      const url = new URL(normalized);
      const lib = url.protocol === 'https:' ? https : http;
      const req = lib.request(url, { method: 'GET', timeout: 10000 }, (res) => {
        const chunks = [];

        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy(new Error('Request timed out'));
      });
      req.end();
    } catch (error) {
      reject(error);
    }
  });
};

const buildTargets = () => {
  const frontendUrl = config.frontendUrl ? config.frontendUrl.replace(/\/+$/, '') : null;
  const backendUrl = config.keepalive.backendUrl || config.backendUrl || `http://localhost:${config.port}`;
  const mcpUrl = config.keepalive.mcpUrl || null;

  return [
    {
      name: 'backend',
      url: `${backendUrl.replace(/\/+$/, '')}/api/keepalive`,
    },
    {
      name: 'frontend',
      url: frontendUrl ? `${frontendUrl}/api/keepalive` : null,
    },
    {
      name: 'mcp server',
      url: mcpUrl ? `${mcpUrl.replace(/\/+$/, '')}/health` : null,
    },
  ].filter((target) => target.url);
};

const sendKeepalivePings = async () => {
  const targets = buildTargets();

  if (targets.length === 0) {
    console.warn('⚠️  No keepalive targets configured. Set FRONTEND_URL, BACKEND_URL, or MCP_URL in .env.');
    return;
  }

  console.log(`🔁 Keepalive ping: checking ${targets.length} target(s)`);

  for (const target of targets) {
    try {
      const response = await fetchUrl(target.url);
      console.log(`✅ Keepalive success for ${target.name}: ${target.url} [${response.status}]`);
    } catch (error) {
      console.warn(`⚠️ Keepalive failed for ${target.name}: ${target.url} — ${error.message}`);
    }
  }
};

const startKeepaliveScheduler = () => {
  const intervalMinutes = config.keepalive.intervalMinutes;
  sendKeepalivePings();
  setInterval(sendKeepalivePings, intervalMinutes * 60 * 1000);
};

module.exports = {
  startKeepaliveScheduler,
  sendKeepalivePings,
};
