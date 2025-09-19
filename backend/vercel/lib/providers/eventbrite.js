const TOKEN = process.env.EVENTBRITE_TOKEN;
const BASE = 'https://www.eventbriteapi.com/v3';

export async function fetchEventbrite({ city, lat, lon, limit = 25 }) {
  if (!TOKEN) return [];
  const params = new URLSearchParams();
  if (lat && lon) {
    params.set('location.latitude', String(lat));
    params.set('location.longitude', String(lon));
    params.set('location.within', '50km');
  } else if (city) {
    params.set('location.address', city);
    params.set('location.within', '50km');
  }
  params.set('sort_by', 'date');
  params.set('expand', 'venue');
  params.set('page_size', String(Math.min(limit, 50)));

  const url = `${BASE}/events/search/?${params.toString()}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` }});
  if (!res.ok) return [];
  const data = await res.json();

  const items = (data.events || []).map(ev => {
    const venue = ev.venue || {};
    const latNum = venue.latitude ? Number(venue.latitude) : undefined;
    const lonNum = venue.longitude ? Number(venue.longitude) : undefined;
    const url = ev.url;
    const priceTier = (ev.is_free === true) ? 1 : 2;
    const tags = [];
    if (/music/i.test(ev.name?.text || '')) tags.push('live-music');
    if (/food|truck|dinner|tasting/i.test(ev.name?.text || '')) tags.push('food');
    if (/art|museum|gallery/i.test(ev.name?.text || '')) tags.push('arts');
    if (/family|kids|children/i.test(ev.name?.text || '')) tags.push('family');

    return {
      id: `eb_${ev.id}`,
      title: ev.name?.text || 'Event',
      startsAt: ev.start?.utc || ev.start?.local,
      venue: { name: venue.name || 'Venue', lat: latNum, lon: lonNum },
      priceTier: (priceTier >= 1 && priceTier <= 3) ? priceTier : 2,
      tags,
      url
    };
  });

  return items;
}
