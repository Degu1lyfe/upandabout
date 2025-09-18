import { EventItem } from '../logic/score';
import { API_BASE } from '../config';

export async function fetchEvents(params: { city: string; lat?: number; lon?: number; interests?: string[]; limit?: number }): Promise<EventItem[]> {
  const q = new URLSearchParams();
  q.set('city', params.city);
  if (params.lat !== undefined && params.lon !== undefined) {
    q.set('lat', String(params.lat));
    q.set('lon', String(params.lon));
  }
  if (params.interests && params.interests.length) {
    q.set('interests', params.interests.join(','));
  }
  if (params.limit) q.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/api/events?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  return data.items as EventItem[];
}
