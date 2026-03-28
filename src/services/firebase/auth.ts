/**
 * Firebase Authentication service.
 * 
 * Handles:
 * - User registration (creates Firestore user doc with role 'customer')
 * - User login (email/password)
 * - User logout
 * - Auth state listener (auto-login on app restart)
 * 
 * WHY we create a Firestore doc on register:
 * Firebase Auth only stores email/password. We need extra fields
 * like name, phone, and role, so we create a parallel document
 * in the 'users' collection.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDocFromCache, getDocFromServer, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User, RegisterData, LoginData } from '../../types';
import { APP_CONFIG } from '../../constants/config';

const profileCache = new Map<string, User>();

/**
 * Register a new user.
 * 1. Creates Firebase Auth account (email/password)
 * 2. Creates a Firestore document with extra user info
 * 3. Returns the full User object
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    // Step 1: Create auth account
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);

    // Step 2: Build the user document
    const userData: User = {
      id: credential.user.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',  // New users are always customers
      createdAt: new Date(),
    };

    // Step 3: Save to Firestore
    await setDoc(
      doc(db, APP_CONFIG.collections.users, credential.user.uid),
      {
        ...userData,
        createdAt: userData.createdAt.toISOString(), // Firestore-friendly date
      }
    );

    profileCache.set(userData.id, userData);
    return userData;
  } catch (error: any) {
    // Re-throw with a more user-friendly message
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Login an existing user.
 * 1. Authenticates with Firebase Auth
 * 2. Fetches the full user profile from Firestore
 * 3. Returns the User object (with role, phone, etc.)
 */
export const login = async (data: LoginData): Promise<User> => {
  try {
    const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const userProfile = await getUserProfile(credential.user.uid);

    if (!userProfile) {
      throw new Error('User profile not found. Please contact support.');
    }

    profileCache.set(userProfile.id, userProfile);
    return userProfile;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign out the current user.
 */
export const logout = async (): Promise<void> => {
  await firebaseSignOut(auth);
  profileCache.clear();
};

export const requestAccountDeletion = async (uid: string): Promise<void> => {
  await updateDoc(doc(db, APP_CONFIG.collections.users, uid), {
    deletionRequestStatus: 'requested',
    deletionRequestedAt: new Date().toISOString(),
  });

  profileCache.delete(uid);
};

/**
 * Fetch a user's profile from Firestore.
 * Returns null if the profile doesn't exist.
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const cachedProfile = profileCache.get(uid);
  if (cachedProfile) {
    return cachedProfile;
  }

  const docRef = doc(db, APP_CONFIG.collections.users, uid);
  let docSnap;

  try {
    docSnap = await getDocFromCache(docRef);
  } catch {
    docSnap = await getDocFromServer(docRef);
  }

  if (!docSnap.exists()) {
    docSnap = await getDocFromServer(docRef);
  }

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  const user = {
    ...data,
    id: docSnap.id,
    createdAt: new Date(data.createdAt),
  } as User;

  profileCache.set(uid, user);
  return user;
};

/**
 * Listen for auth state changes.
 * Called on app startup to auto-login returning users.
 * Returns an unsubscribe function.
 */
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Convert Firebase Auth error codes to human-readable messages.
 * These messages are shown to the user in the UI.
 */
const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};
