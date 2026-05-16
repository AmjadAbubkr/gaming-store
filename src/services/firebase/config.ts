/**
 * Firebase configuration and initialization.
 *
 * The key design choice here is that misconfiguration must not crash the app
 * during module import. React needs a chance to render a helpful setup error
 * instead of dying on the splash screen.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
// @ts-ignore getReactNativePersistence exists at runtime in React Native bundles
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

const requiredFirebaseEnv = {
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missingFirebaseEnv = Object.entries(requiredFirebaseEnv)
  .filter(([, value]) => !value || String(value).startsWith('YOUR_'))
  .map(([key]) => key);

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

let servicesCache: FirebaseServices | null = null;
let initializationError: string | null = missingFirebaseEnv.length > 0
  ? `Missing Firebase environment variables: ${missingFirebaseEnv.join(', ')}`
  : null;

const createServices = (): FirebaseServices => {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  let auth: Auth;
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }

  return {
    app,
    auth,
    db: getFirestore(app),
    storage: getStorage(app),
  };
};

export const isFirebaseConfigured = (): boolean => initializationError === null;

export const getFirebaseInitializationError = (): string | null => initializationError;

export const getFirebaseServices = (): FirebaseServices => {
  if (servicesCache) {
    return servicesCache;
  }

  if (initializationError) {
    throw new Error(initializationError);
  }

  try {
    servicesCache = createServices();
    return servicesCache;
  } catch (error) {
    initializationError = error instanceof Error
      ? error.message
      : 'Firebase failed to initialize.';
    throw new Error(initializationError);
  }
};
