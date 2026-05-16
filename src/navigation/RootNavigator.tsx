import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Stores and Services
import { useAuthStore } from '../store/authStore';
import { onAuthChange, getUserProfile } from '../services/firebase/auth';
import { getFirebaseInitializationError, isFirebaseConfigured } from '../services/firebase/config';

// Navigators
import { CustomerTabs } from './CustomerTabs';
import { RootStackParamList, AuthStackParamList } from './types';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { AdminNavigator } from './AdminNavigator';

// UI
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { COLORS } from '../constants/theme';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

export const RootNavigator = () => {
  const { user, isGuest, isBootstrapping, setUser, setGuestMode } = useAuthStore();
  const firebaseReady = isFirebaseConfigured();
  const firebaseError = getFirebaseInitializationError();

  useEffect(() => {
    if (!firebaseReady) {
      return;
    }

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full profile (with role) from Firestore
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'customer',
              createdAt: new Date(),
              phone: '',
            });
          }
          if (isGuest) {
            setGuestMode(false);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Fallback to avoid logging the user out on network errors
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role: 'customer',
            createdAt: new Date(),
            phone: '',
          });
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [firebaseReady, isGuest, setGuestMode, setUser]);

  if (!firebaseReady) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <LoadingSpinner
          fullScreen
          label="App setup issue detected. Add the Firebase EXPO_PUBLIC_* values before creating a release build."
          detail={firebaseError ?? undefined}
        />
      </SafeAreaProvider>
    );
  }

  if (isBootstrapping) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
          {!user && !isGuest ? (
            // Needs Auth
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <>
              <RootStack.Screen name="CustomerApp" component={CustomerTabs} />
              {user?.role === 'admin' ? (
                <RootStack.Screen name="AdminApp" component={AdminNavigator} />
              ) : null}
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
