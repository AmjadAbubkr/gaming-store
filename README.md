# Game Technologie

Game Technologie is a premium React Native / Expo gaming store app built for Android, with Firebase powering authentication, catalog storage, and order management. The app gives customers a polished storefront for browsing consoles, games, and accessories, while admins can manage products and review orders from the same codebase.

## Core Features

- Customer authentication with Firebase Auth
- Product catalog backed by Cloud Firestore
- WhatsApp-based checkout flow
- Admin dashboard for product and order management
- Multi-language support for English, French, and Arabic
- RTL-aware layout foundation for Arabic
- Play-readiness additions including privacy policy and account deletion request flow

## Tech Stack

- Expo 55
- React Native 0.83
- Firebase Auth / Firestore / Storage
- Zustand for state management
- React Navigation
- NativeWind
- EAS Build for Android release builds

## Project Structure

- `src/features/auth`: login, registration, admin login
- `src/features/products`: home, catalog, product detail
- `src/features/cart`: cart and checkout flow
- `src/features/admin`: admin dashboard, product management, order center
- `src/features/account`: privacy policy and account deletion request screens
- `src/services/firebase`: Firebase config, auth, Firestore services
- `docs/`: public legal pages and Play release notes

## Local Development

Install dependencies:

```bash
npm install
```

Start the Expo app:

```bash
npm start
```

Start the dev client:

```bash
npm run dev-client
```

Run a typecheck:

```bash
npx tsc --noEmit
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase and WhatsApp values:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_WHATSAPP_NUMBER`

## Android Release Build

The GitHub Actions workflow builds a production Android App Bundle (`.aab`) through EAS remote build and uploads it as an artifact on pushes to `main`.

For Google Play submission:

1. Push changes to `main`
2. Wait for the workflow to finish
3. Download the `gaming-store-android-aab` artifact
4. Upload the `.aab` file to Google Play Console

## Legal / Play Console Assets

The repo includes:

- `docs/privacy-policy.html`
- `docs/account-deletion.html`
- `docs/google-play-data-safety.md`
- `docs/release-hardening-checklist.md`

Enable GitHub Pages from the `docs/` folder if you want those legal pages hosted publicly for Play Console URLs.
