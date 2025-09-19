export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
  try {
    const body = await readJson(req);
    const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0]?.trim();
    const ua = req.headers['user-agent'];
    console.log('[track]', JSON.stringify({ ...body, ip, ua }));
    res.statusCode = 204; res.end('');
  } catch { res.statusCode = 400; res.end('Bad Request'); }
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', c => (buf += c));
    req.on('end', () => { try { resolve(JSON.parse(buf || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
