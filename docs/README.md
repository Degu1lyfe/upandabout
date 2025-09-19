# Up & About — Expo App Skeleton (SDK 53)

This is a minimal, production-ready **Expo SDK 53** + **TypeScript** starter for the Up & About MVP.

## Quick Start
```bash
cd app
npm install
npx expo start -c
# press "i" to open iOS Simulator
```

### Native iOS (optional)
```bash
npx expo prebuild --platform ios
cd ios && pod install && cd ..
open ios/*.xcworkspace
```

Update API base in `src/config.ts`.

## Structure
- `src/navigation/RootNavigator.tsx` — Stack nav
- `src/screens/Splash.tsx` — Loads preferences & routes
- `src/screens/Onboarding.tsx` — City/GPS, interests, price tier, family mode
- `src/screens/Home.tsx` — Top 3 events, pull-to-refresh, "See more"
- `src/logic/score.ts` — Event scoring logic
- `src/services/api.ts` — Fetches events
- `src/storage/preferences.ts` — AsyncStorage helpers
- `src/data/fallbackEvents.json` — Safe offline/demo events

### Backend (Optional)
Deploy `/backend/vercel` to Vercel; update `API_BASE` to your deploy origin.
