# Play Store Audit Handoff

## What was changed

- Removed tracked local-only files from git:
  - `.env`
  - `.expo-dev-client.log`
  - `.expo-dev-client.err.log`
- Removed unused native-capable packages from the release dependency graph:
  - `expo-notifications`
  - `expo-dev-client`
- Removed the `dev-client` npm script because the package is no longer installed.
- Added `android.blockedPermissions` for `android.permission.CAMERA` because the app is gallery-only.
- Reworked Firebase initialization so missing release env values no longer crash the app during module import.
- Added a startup-safe fallback in navigation that surfaces Firebase misconfiguration as a visible setup error.
- Updated GitHub Actions to:
  - validate required Firebase release secrets
  - produce both Android APK and AAB artifacts on pushes to `main`

## Why these changes matter

- The previous `src/services/firebase/config.ts` threw immediately when any Firebase env var was missing. Because auth and navigation import that module on startup, a bad release env could crash the app before the first screen.
- `expo-notifications` was installed but unused in JS. Keeping it would add extra Android manifest surface during Play review without product value.
- `expo-image-picker` can contribute camera permission by default even when you only need gallery access. Blocking the camera permission keeps the manifest closer to actual app behavior.

## Current architecture decisions

- Firebase remains on the web/JS SDK. There is still no need to add `google-services.json` or `GoogleService-Info.plist` unless a future change introduces native Firebase modules.
- Gallery-only remains the intended admin media flow.
- Startup should now degrade into a visible config error rather than a process-level crash when release secrets are missing.

## Files changed

- `app.json`
- `package.json`
- `package-lock.json`
- `.gitignore`
- `.github/workflows/build.yml`
- `scripts/validate-release-env.js`
- `src/services/firebase/config.ts`
- `src/services/firebase/auth.ts`
- `src/services/firebase/firestore.ts`
- `src/services/firebase/storage.ts`
- `src/navigation/RootNavigator.tsx`
- `src/components/ui/LoadingSpinner.tsx`
- `docs/google-play-data-safety.md`

## Still needs validation

- Run `npx tsc --noEmit`.
- Run `npx expo-doctor`.
- Build a preview APK and confirm:
  - cold start works
  - login/register flows work
  - guest browsing works
  - admin gallery picker works
  - denying gallery permission does not crash
- Build a production AAB and inspect the merged Android manifest to verify:
  - no unexpected notification permissions remain
  - no unexpected exported components remain
- Compare the new build against the Google Play pre-launch report crash stack once available.

## Most likely remaining risk

- If Play's original crash was not caused by missing Firebase env values, the next most likely area is generated native manifest/component behavior from Expo modules. The updated AAB should be checked with Play internal testing before resubmission.
