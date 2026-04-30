const http = require('http');
const https = require('https');
const url = require('url');

const API_KEY = '0d9c408b126f46a685e9127195a29d7e';
const BASE_URL = 'https://api.football-data.org/v4';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const apiPath = parsedUrl.pathname.replace('/api', '');

  if (!apiPath) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Missing API path' }));
    return;
  }

  const apiUrl = BASE_URL + apiPath + (parsedUrl.search || '');
  console.log(`[PROXY] GET ${apiUrl}`);

  https.get(apiUrl, { headers: { 'X-Auth-Token': API_KEY } }, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => { data += chunk; });
    apiRes.on('end', () => {
      res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }).on('error', (err) => {
    console.error('[PROXY ERROR]', err.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  });
});

server.listen(3000, () => {
  console.log('✅ API Proxy en http://localhost:3000');
  console.log('📊 LaLiga Dashboard en http://localhost:5173 (npm run dev)');
});
