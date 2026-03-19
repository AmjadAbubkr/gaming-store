import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Keyboard, 
  ImageBackground, 
  StatusBar,
  Dimensions
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/authStore';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { PremiumInput } from '../../../components/ui/PremiumInput';
import { PremiumButton } from '../../../components/ui/PremiumButton';
import { isValidEmail } from '../../../utils/formatting';
import { MaterialIcons } from '@expo/vector-icons';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const { height } = Dimensions.get('window');

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, isLoading, error, clearError } = useAuthStore();

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
    } catch (err) {
      // Handled by Zustand
    }
  };

  return (
    <ScreenWrapper scrollable={false} withKeyboardAvoid={true} padding={false} className="bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Top Section with Astronaut Character */}
      <ImageBackground
        source={require('../../../../assets/auth-bg.png')}
        style={{ width: '100%', height: height * 0.45 }}
        resizeMode="cover"
        className="justify-end items-center"
      >
        {/* Subtle overlay for better text readability if needed */}
        <View className="absolute inset-0 bg-black/20" />
      </ImageBackground>

      {/* Bottom Section: Form */}
      <View className="flex-1 bg-black px-8 pt-6">
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-headline font-bold mb-1">
            Welcome Back!
          </Text>
          <View className="h-1 w-12 bg-primary rounded-full" />
        </View>

        <View className="mb-6">
          <PremiumInput
            placeholder="Username / Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setLocalError('');
            }}
            icon={<MaterialIcons name="person-outline" size={20} color="#adaaaa" />}
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

          <TouchableOpacity className="items-end mt-1">
            <Text className="text-[#adaaaa] text-xs">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {(localError || error) ? (
          <Text className="text-error font-body text-xs mb-4 text-center">
            {localError || error}
          </Text>
        ) : null}

        <PremiumButton
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          className="mb-6"
        />

        <View className="flex-row justify-center items-center">
          <Text className="text-[#adaaaa] text-sm">
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => {
            clearError();
            navigation.navigate('Register');
          }}>
            <Text className="text-primary font-bold text-sm">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};
