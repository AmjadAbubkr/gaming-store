/**
 * Firebase configuration and initialization.
 * 
 * HOW IT WORKS:
 * - Firebase is initialized once when the app starts.
 * - We export the auth, db (Firestore), and storage instances
 *   so other services can use them.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Create a new project (or use existing)
 * 3. Enable Authentication (Email/Password provider)
 * 4. Enable Cloud Firestore
 * 5. Enable Storage
 * 6. Go to Project Settings > General > Your apps > Add app (Web)
 * 7. Copy the config values into your .env file
 * 
 * IMPORTANT: Never commit real Firebase keys to git!
 * Use environment variables instead (see .env.example).
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore — getReactNativePersistence exists at runtime (Metro resolves to RN bundle), but isn't in the default TS typings
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Firebase configuration object.
 * 
 * In a production app, these would come from environment variables.
 * For now, we use placeholders — replace with your actual Firebase config.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

/**
 * Initialize Firebase app (only once).
 * getApps() checks if already initialized to prevent duplicate errors.
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Initialize Firebase Auth with AsyncStorage persistence.
 * 
 * WHY THIS IS NEEDED:
 * By default, Firebase Auth in React Native uses IN-MEMORY persistence,
 * meaning the user's login session is lost when the app is closed/restarted.
 * 
 * By using `getReactNativePersistence(AsyncStorage)`, we tell Firebase to
 * store the auth token in AsyncStorage (which survives app restarts).
 * This way, when the user opens the app again, Firebase automatically
 * restores their login session without requiring them to sign in again.
 * 
 * We use a try/catch because if auth is already initialized (e.g., hot reload),
 * `initializeAuth` will throw — in that case we fall back to `getAuth`.
 */
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Auth already initialized (e.g., during hot reload), reuse existing instance
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
