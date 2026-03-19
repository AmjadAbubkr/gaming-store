import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Stores and Services
import { useAuthStore } from '../store/authStore';
import { onAuthChange, getUserProfile } from '../services/firebase/auth';

// Navigators
import { CustomerTabs } from './CustomerTabs';
import { AdminNavigator } from './AdminNavigator';
import { RootStackParamList, AuthStackParamList } from './types';

// UI
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { COLORS } from '../constants/theme';

// Placeholder Auth Screens
import { View, Text, Button } from 'react-native';
const LoginScreen = ({ navigation }: any) => {
  const setGuest = useAuthStore(s => s.setGuestMode);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <Text style={{ color: COLORS.primary, marginBottom: 20 }}>Login Screen</Text>
      <Button title="Continue as Guest" onPress={() => setGuest(true)} color={COLORS.secondary} />
    </View>
  );
};
const RegisterScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.background }}><Text>Register</Text></View>;

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

export const RootNavigator = () => {
  const { user, isGuest, isLoading, setUser, setGuestMode } = useAuthStore();

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full profile (with role) from Firestore
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser(profile);
          // If they logged in, they are no longer a guest
          setGuestMode(false);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {/* Conditional Routing (Auth Guard) */}
          {!user && !isGuest ? (
            // Needs Auth
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          ) : user?.role === 'admin' ? (
            // Is Admin
            <RootStack.Screen name="AdminApp" component={AdminNavigator} />
          ) : (
            // Is Customer or Guest
            <RootStack.Screen name="CustomerApp" component={CustomerTabs} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
