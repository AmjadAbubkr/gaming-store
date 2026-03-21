import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Image,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/authStore';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { PremiumInput } from '../../../components/ui/PremiumInput';
import { PremiumButton } from '../../../components/ui/PremiumButton';
import { isValidEmail } from '../../../utils/formatting';

type AdminLoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'AdminLogin'>;
};

export const AdminLoginScreen = ({ navigation }: AdminLoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { loginAsAdmin, isLoading, error, clearError } = useAuthStore();

  const handleAdminLogin = async () => {
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
      await loginAsAdmin({ email: email.trim(), password });
    } catch {
      // handled by auth store
    }
  };

  return (
    <ScreenWrapper
      scrollable
      withKeyboardAvoid
      keyboardVerticalOffset={24}
      padding={false}
      className="bg-black"
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black px-5 pb-10">
        <View className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-low p-5">
          <TouchableOpacity
            className="mb-6 h-11 w-11 items-center justify-center rounded-full bg-black/40"
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View className="items-center">
            <Image
              source={require('../../../../assets/icon.png')}
              style={{ width: 86, height: 86 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="mt-[-24] rounded-[28px] border border-white/10 bg-[#111111] px-6 py-7">
          <View className="mb-8 items-center">
            <Text className="mb-1 text-3xl font-headline font-bold text-white">Admin Login</Text>
            <Text className="text-xs uppercase tracking-[3px] text-[#9c9898]">Control room access</Text>
            <View className="mt-4 h-1 w-14 rounded-full bg-primary" />
          </View>

          <View className="mb-6">
            <PremiumInput
              placeholder="Admin email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setLocalError('');
              }}
              icon={<MaterialIcons name="shield" size={20} color="#adaaaa" />}
            />

            <PremiumInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setLocalError('');
              }}
              icon={<MaterialIcons name="lock-outline" size={20} color="#adaaaa" />}
            />
          </View>

          {(localError || error) ? (
            <Text className="mb-4 text-center text-xs font-body text-error">{localError || error}</Text>
          ) : null}

          <PremiumButton
            title="Enter Admin Dashboard"
            onPress={handleAdminLogin}
            loading={isLoading}
            className="mb-6"
          />

          <TouchableOpacity
            className="items-center"
            onPress={() => {
              clearError();
              navigation.navigate('Login');
            }}
          >
            <Text className="text-sm text-[#adaaaa]">Return to customer login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};
