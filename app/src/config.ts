// app/src/config.ts
// IMPORTANT: Do not include `/api` here — only the origin.
export const API_BASE =
  (process.env.EXPO_PUBLIC_API_BASE as string) ??
  'http://localhost:3000';

// temporarily add in app/src/config.ts:
console.log('API_BASE =', API_BASE);

