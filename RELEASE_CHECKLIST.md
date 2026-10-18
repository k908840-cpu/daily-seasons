# Daily Seasons — release gate (Batch 5)

## Automated validation
- GitHub Actions runs `npm ci` and `npm run typecheck` on pushes and pull requests.
- Do not assume a passing check until GitHub reports it green.
- On Windows: `cd D:\\daily-seasons`, `git pull origin main`, `npx.cmd tsc --noEmit`, `npx.cmd expo start --tunnel --clear`.

## Manual Android test matrix
- Fresh install and onboarding; verify preferences persist after restart.
- Test dark/light themes and large text across all screens.
- Save journal, prayer intentions, bookmarks, Rosary, novena and seasonal progress; force close and reopen.
- Export backup, save privately, restore on a clean test install, and verify data. Verify invalid JSON and unsupported backup versions are rejected. Purchases must not transfer in backup.
- Test airplane mode: local content and progress work; online BibleGateway links cannot load. Do not advertise a full offline Bible yet.
- Test Night Prayer: no autoplay, explicit play/stop, rate choices, leaving screen stops audio, timer behavior.
- Test local reminders in an Android development/production build, not Expo Go.
- Test lifetime purchase and restore using Google Play license testers and a signed development/internal-testing build. Pending/cancelled transactions must not unlock. Validate acknowledgement, refunds, delayed transactions and offline entitlement behavior before release.
- Confirm actual in-app price from Play rather than hardcoding USD.
- Verify all prayers and translations have accurate sources, appropriate rights, and denominational labeling.
- Verify privacy policy, store listing, screenshots, age/content declarations, data safety, accessibility and real EAS project ID.

## Blocking release issues
- Complete licensed/public-domain offline Bible text and verse-level navigation/search.
- Replace placeholder prayer texts with verified content and citations.
- Billing needs end-to-end Play purchase lifecycle and acknowledgement/consumption validation; current confirmation check is a safeguard, not a production-ready billing system.
- `app.json` still has placeholder EAS project ID and example privacy policy URL.
- Native audio downloads/background playback and app-lock are not implemented.
- Full device testing and CI status have not been verified.
