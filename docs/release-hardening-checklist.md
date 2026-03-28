# Release Hardening Checklist

This checklist covers the remaining items that cannot be honestly completed through static code edits alone.

## Implemented in code

- JS render crash boundary added
- Firebase config now fails fast when required env values are missing
- Firebase auth and Firestore requests now fail faster with timeout messages
- `.env.example` added so secrets are not tied to source code setup
- Android build properties pinned to compile/target SDK 35

## Still requires manual validation

- Crash handler service integration
  - Crashlytics was not added in this Expo setup
- Native memory leak checks
  - LeakCanary not added
- No main thread blocking
  - needs profiling on a release build
- No internet / timeouts
  - verify login, profile load, product load, order creation while offline and on slow internet
- Empty states / corrupt data / storage full
  - test with missing product fields, broken image URIs, failed image picker writes, and near-full device storage
- App lifecycle
  - backgrounding during login
  - return from WhatsApp checkout
  - phone calls/interruption
  - activity recreation / process death
- Rotation
  - current app is portrait locked, so confirm that remains intentional
- ProGuard / R8
  - verify a production release build starts, logs in, and opens all major flows
- 64-bit support
  - Expo Android builds should already satisfy this, but verify with the generated AAB in Play Console pre-checks

## Suggested release test pass

1. Install a production AAB-derived build on a physical Android device.
2. Test:
   - register
   - login
   - logout
   - customer browsing
   - product detail
   - cart checkout
   - admin login
   - add product
   - order management
3. Repeat key flows with airplane mode and unstable Wi-Fi.
4. Upload the AAB to Play Console internal testing first.
