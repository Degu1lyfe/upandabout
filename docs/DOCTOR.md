# Expo Doctor & Fix Commands (SDK 53)

Run these from the `app/` folder:

```bash
# Clean and verify cache
npm run clean

# Let Expo pin the exact SDK 53-compatible versions
npm run fix

# Check for any remaining issues
npm run doctor
```

If you still see peer-deps warnings, try:
```bash
npm i --legacy-peer-deps
```
