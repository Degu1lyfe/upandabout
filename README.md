
# Up & About

A minimal, high-signal events app: shows the **Top 3** things near you (tonight / this weekend), ranked by your **interests**, **distance**, and **price**. One tap to open tickets or maps. No infinite scroll. No overwhelm.

## What’s inside
- **app/** — Expo SDK 53 (React Native 0.79, TypeScript)
  - Screens: Splash → Onboarding → Home
  - Scoring: interests / price / distance / time
  - Pull-to-refresh reshuffles ties (seeded)
  - AsyncStorage for local prefs
- **backend/vercel/** — Serverless `GET /api/events`
  - Curated sample events, seeded shuffle, `?aff=UPA001`
  - Node 20 runtime (`vercel.json`)

---

## Quick start

### Backend (Vercel)
```bash
cd backend/vercel
npx vercel login
npx vercel link            # choose (or create) a project
npx vercel deploy --prod
# You’ll get: https://<project>.vercel.app
# API lives at: https://<project>.vercel.app/api/events?city=Tampa
cat > README.md << 'EOF'

'EOF'
