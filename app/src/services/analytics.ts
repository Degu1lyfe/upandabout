import { API_BASE } from '../config';

type EventName =
  | 'app_open'
  | 'onboarding_complete'
  | 'card_impression'
  | 'card_tap'
  | 'share_tap';

export async function track(name: EventName, props: Record<string, any> = {}) {
  try {
    await fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, props, ts: Date.now() })
    });
  } catch {
    // best-effort only
  }
}
