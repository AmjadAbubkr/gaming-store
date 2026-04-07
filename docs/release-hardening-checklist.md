# Release Hardening Checklist

This checklist covers the remaining items that cannot be honestly completed through static code edits alone.

## Implemented in code

- JS render crash boundary added
- Firebase config now fails fast when required env values are missing
- Firebase auth and Firestore requests now fail faster with timeout messages
- `.env.example` added so secrets are not tied to source code setup
- Android build properties pinned to compile/target SDK 35
- iOS deployment target set to 15.1
- iOS bundle identifier configured (`com.cybernexus.gamingstore`)
- iOS permission usage strings added (camera, photo library)
- iOS encryption declaration set (`ITSAppUsesNonExemptEncryption: false`)

## Still requires manual validation — Android

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

## Still requires manual validation — iOS

- Safe area / notch handling
  - verify all screens respect the notch, Dynamic Island, and home indicator on various iPhone models
- Keyboard handling
  - test text inputs on screens with keyboards (login, registration, admin product forms)
  - verify keyboard avoidance works correctly
- Permissions flow
  - test camera/photo library permission dialogs appear with correct usage strings
  - test denying permissions gracefully shows an error, not a crash
- App lifecycle (iOS-specific)
  - backgrounding during login and returning to the app
  - interruptions (phone calls, Control Center, Notification Center)
  - force-quit and cold restart — verify auth persistence works
- No internet / timeouts (same as Android)
  - verify on iOS specifically, since network error messages may differ
- Memory / performance
  - test on older supported devices (e.g., iPhone 8 running iOS 15)
  - watch for memory warnings in Xcode Instruments
- iPad rejection check
  - `supportsTablet` is `false` — confirm app is not listed as iPad-compatible in App Store Connect
- Dark mode
  - `userInterfaceStyle` is `light`, so verify the app doesn't break if the device is in dark mode
- TestFlight
  - distribute a preview build via TestFlight
  - test with at least 2-3 different iPhone models

## Suggested release test pass — Android

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

## Suggested release test pass — iOS

1. Build a production IPA via `eas build --platform ios --profile production`.
2. Upload to TestFlight via `eas submit --platform ios`.
3. Test on a physical iPhone (preferably 2+ models with different screen sizes):
   - register
   - login
   - logout
   - customer browsing
   - product detail
   - cart checkout
   - admin login
   - add product
   - order management
4. Repeat key flows with airplane mode and unstable Wi-Fi.
5. Verify all screens look correct with the notch / Dynamic Island.
6. Submit for App Store review only after TestFlight testing is complete.
