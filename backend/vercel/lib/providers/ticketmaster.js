const KEY = process.env.TICKETMASTER_API_KEY;
const BASE = 'https://app.ticketmaster.com/discovery/v2';

export async function fetchTicketmaster({ city, lat, lon, limit = 25 }) {
  if (!KEY) return [];
  const params = new URLSearchParams();
  if (lat && lon) {
    params.set('latlong', `${lat},${lon}`);
    params.set('radius', '50');
  } else if (city) {
    params.set('city', city);
  }
  params.set('countryCode', 'US');
  params.set('size', String(Math.min(limit, 50)));
  params.set('sort', 'date,asc');
  params.set('apikey', KEY);

  const url = `${BASE}/events.json?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();

  const arr = data?._embedded?.events || [];
  const items = arr.map(ev => {
    const venue = ev._embedded?.venues?.[0] || {};
    const loc = venue.location || {};
    const name = venue.name || 'Venue';
    const latNum = loc.latitude ? Number(loc.latitude) : undefined;
    const lonNum = loc.longitude ? Number(loc.longitude) : undefined;
    const url = (ev.url || '').toString();
    const priceRanges = ev.priceRanges || [];
    let priceTier = 2;
    if (priceRanges.length) {
      const min = priceRanges[0].min || 0;
      if (min < 25) priceTier = 1;
      else if (min > 75) priceTier = 3;
    }
    const tags = [];
    if (/music|concert/i.test(ev.name || '')) tags.push('live-music');
    if (/sports|game/i.test(ev.classifications?.[0]?.segment?.name || '')) tags.push('sports');
    if (/theatre|theater|arts/i.test(ev.classifications?.[0]?.segment?.name || '')) tags.push('arts');

    const startsAt = ev.dates?.start?.dateTime || ev.dates?.start?.localDate;

    return {
      id: `tm_${ev.id}`,
      title: ev.name || 'Event',
      startsAt,
      venue: { name, lat: latNum, lon: lonNum },
      priceTier,
      tags,
      url
    };
  });

  return items;
}
