import { aff } from '../lib/normalize.js';
import { fetchEventbrite } from '../lib/providers/eventbrite.js';
import { fetchTicketmaster } from '../lib/providers/ticketmaster.js';

const curated = [
  { id:'cur_001', title:'Sunset Jazz on the Bay', startsAt:new Date(Date.now()+3*3600e3).toISOString(),
    venue:{ name:'Riverfront', lat:27.951, lon:-82.457 }, priceTier:2, tags:['live-music','nightlife'], url:'https://tickets.example.com/evt_001' },
  { id:'cur_002', title:'Food Truck Friday', startsAt:new Date(Date.now()+24*3600e3).toISOString(),
    venue:{ name:'Central Park', lat:27.960, lon:-82.460 }, priceTier:1, tags:['food','outdoors','family'], url:'https://tickets.example.com/evt_002' },
  { id:'cur_003', title:'Museum Late Nights', startsAt:new Date(Date.now()+40*3600e3).toISOString(),
    venue:{ name:'City Museum', lat:27.955, lon:-82.445 }, priceTier:3, tags:['arts','nightlife'], url:'https://tickets.example.com/evt_003' },
  { id:'cur_004', title:'Riverwalk Yoga', startsAt:new Date(Date.now()+12*3600e3).toISOString(),
    venue:{ name:'Waterfront Lawn', lat:27.952, lon:-82.452 }, priceTier:1, tags:['outdoors','family'], url:'https://tickets.example.com/evt_004' }
];

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const city = url.searchParams.get('city') || 'Tampa, FL';
  const lat = toNum(url.searchParams.get('lat'));
  const lon = toNum(url.searchParams.get('lon'));
  const interests = (url.searchParams.get('interests') || '').split(',').filter(Boolean);
  const limit = Math.min(Number(url.searchParams.get('limit') || 10), 25);
  const seed = Number(url.searchParams.get('seed') || Date.now());
  const affTag = process.env.AFFILIATE_TAG || 'UPA001';

  let items = [];
  try {
    const [eb, tm] = await Promise.all([
      fetchEventbrite({ city, lat, lon, limit: 50 }),
      fetchTicketmaster({ city, lat, lon, limit: 50 })
    ]);
    items = [...(eb || []), ...(tm || [])];
  } catch (e) {
    console.error('provider error', e);
  }

  if (!items.length) items = curated;

  if (interests.length) {
    const filtered = items.filter(it => it.tags?.some(t => interests.includes(t)));
    if (filtered.length) items = filtered;
  }

  const seen = new Set();
  items = items.filter(it => {
    const key = `${(it.title||'').toLowerCase()}@${it.startsAt}@${(it.venue?.name||'').toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });

  const rand = rng(seed);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  items = items.map(it => ({ ...it, url: aff(it.url, affTag) }));

  res.setHeader('content-type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.statusCode = 200;
  res.end(JSON.stringify({ items: items.slice(0, limit) }));
}

function toNum(v) {
  const n = v == null ? NaN : Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function rng(s) { let t = (s>>>0) || 1; return () => (t = (1664525*t + 1013904223) >>> 0, t / 2**32); }
