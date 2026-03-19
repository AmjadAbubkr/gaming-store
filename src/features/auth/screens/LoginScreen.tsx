import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/authStore';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { CornerHighlight } from '../../../components/layout/CornerHighlight';
import { MaterialIcons } from '@expo/vector-icons';
import { isValidEmail } from '../../../utils/formatting';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, setGuestMode, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    Keyboard.dismiss();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    
    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    try {
      await login({ email: email.trim(), password });
      // Navigation is handled automatically by RootNavigator based on auth state
    } catch (err) {
      // Error is caught and stored in Zustand, but we don't need to do anything here
    }
  };

  const handleGuest = () => {
    setGuestMode(true);
    // Navigation handled by RootNavigator
  };

  return (
    <ScreenWrapper scrollable padding={false} className="justify-center px-6">
      
      {/* Header Area */}
      <View className="items-center mb-10">
        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4 border border-primary/50 shadow-cyan-glow">
          <MaterialIcons name="sports-esports" size={40} color="#8ff5ff" />
        </View>
        <Text className="font-headline font-bold text-3xl text-on-surface tracking-widest uppercase">
          Cyber-Nexus
        </Text>
        <Text className="font-body text-primary text-sm tracking-widest mt-2 uppercase">
          Level Up Your Gear
        </Text>
      </View>

      {/* Login Form Panel */}
      <View className="glass-panel rounded-xl p-6 relative">
        <CornerHighlight color="border-primary" />
        
        <Text className="font-headline font-bold text-lg text-on-surface mb-6 uppercase">
          Authentication
        </Text>

        <Input
          label="Email Address"
          placeholder="player@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setLocalError('');
            clearError();
          }}
          icon={<MaterialIcons name="email" size={20} color="#8ff5ff" />}
        />

        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setLocalError('');
            clearError();
          }}
          icon={<MaterialIcons name="lock" size={20} color="#8ff5ff" />}
        />

        {(localError || error) ? (
          <Text className="text-error font-body text-sm mb-4 text-center">
            {localError || error}
          </Text>
        ) : null}

        <Button
          title="INITIALIZE LOGIN"
          onPress={handleLogin}
          loading={isLoading}
          className="mt-2 mb-4"
          icon={<MaterialIcons name="login" size={20} color="#8ff5ff" />}
        />

        <View className="flex-row justify-center items-center">
          <Text className="text-on-surface-variant font-body text-sm">
            New player?{' '}
          </Text>
          <TouchableOpacity onPress={() => {
            clearError();
            navigation.navigate('Register');
          }}>
            <Text className="text-primary font-bold text-sm tracking-wider">
              CREATE ACCOUNT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Guest Mode Action */}
      <View className="mt-8 items-center">
        <Text className="text-on-surface-variant font-body text-xs uppercase tracking-widest mb-4">
          Or Continue with limited access
        </Text>
        <Button
          title="BROWSE AS GUEST"
          variant="secondary"
          onPress={handleGuest}
          icon={<MaterialIcons name="travel-explore" size={20} color="#d575ff" />}
        />
      </View>

    </ScreenWrapper>
  );
};
