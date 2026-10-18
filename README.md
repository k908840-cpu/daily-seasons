# Daily Seasons (Expo)

Offline prayer companion for the Western church year. Android-first; v1 focuses on Advent and Christmas.

## Quick start

```bash
cd daily-seasons
npm install
# Add PNG assets under ./assets (icon, splash, adaptive-icon, notification-icon) — see Expo docs.
npx expo start
```

## Verify church calendar

```bash
npm test
```

Expected for **2027**: Easter **Mar 28**, Ash Wednesday **Feb 10**.

## Content

All scripture and prayers are **placeholders** until you supply WEB passages and verified traditional text in:

- `src/data/adventEntries.ts`
- `src/data/christmasEntries.ts`
- `src/data/prayers.ts`

Never edit doctrine in code without your content files.

## Play billing

- SKU: `daily_seasons_lifetime` (create in Play Console; localize pricing).
- Test with license testers and `react-native-iap` internal testing tracks.
- Requires **development build** (not Expo Go) for IAP.

## EAS

Replace `extra.eas.projectId` in `app.json`, then:

```bash
npx eas build --platform android --profile production
```

## Privacy

Set `extra.privacyPolicyUrl` in `app.json` before store submission.
