export type Interest = 'live-music'|'food'|'arts'|'family'|'sports'|'outdoors'|'nightlife';

export type EventItem = {
  id: string;
  title: string;
  startsAt: string; // ISO
  venue: { name: string; lat: number; lon: number };
  priceTier: 1|2|3;
  tags: Interest[];
  url: string;
};

export type Preferences = {
  city?: string;
  lat?: number;
  lon?: number;
  interests: Interest[];
  maxPriceTier: 1|2|3;
  familyMode?: boolean;
};

function haversine(lat1:number, lon1:number, lat2:number, lon2:number) {
  const toRad = (d:number)=>d*Math.PI/180;
  const R = 6371; // km
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function scoreEvent(e: EventItem, prefs: Preferences): number {
  let score = 0;

  // interests: +3 per match, cap 6
  const matches = e.tags.filter(t => prefs.interests.includes(t)).length;
  score += Math.min(matches * 3, 6);

  // price: +2 if within, else -2 per tier over
  if (e.priceTier <= prefs.maxPriceTier) score += 2;
  else score -= 2 * (e.priceTier - prefs.maxPriceTier);

  // distance: 0..5 bonus up to 20km
  if (prefs.lat && prefs.lon) {
    const d = haversine(prefs.lat, prefs.lon, e.venue.lat, e.venue.lon);
    const distBonus = Math.max(0, 5 * (1 - (d/20)));
    score += Math.min(5, distBonus);
  }

  // freshness: 0..4 (within 48h, closer is more)
  const now = Date.now();
  const starts = new Date(e.startsAt).getTime();
  const dtHours = Math.max(0, (starts - now)/3600000);
  if (dtHours <= 48) {
    const freshness = 4 * (1 - dtHours/48);
    score += Math.max(0, freshness);
  }

  // family/nightlife adjustments
  if (prefs.familyMode) {
    if (e.tags.includes('family')) score += 2;
    if (e.tags.includes('nightlife')) score -= 1;
  }

  return score;
}

export function rankEvents(items: EventItem[], prefs: Preferences): EventItem[] {
  return [...items].sort((a,b)=> scoreEvent(b, prefs) - scoreEvent(a, prefs));
}
