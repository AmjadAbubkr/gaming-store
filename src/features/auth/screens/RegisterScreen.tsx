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
import { isValidEmail, isValidPhone } from '../../../utils/formatting';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    Keyboard.dismiss();
    setLocalError('');
    clearError();

    // Validation
    if (!name || !email || !phone || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setLocalError('Please enter a valid phone number (+XX XXX XXX).');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      // Navigation handled automatically by RootNavigator listener
    } catch (err) {
      // Handled by Zustand
    }
  };

  return (
    <ScreenWrapper scrollable padding={false} className="justify-center px-6 py-6">
      
      {/* Header Area */}
      <View className="mb-6 flex-row items-center">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-surface-container justify-center items-center mr-4"
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="font-headline font-bold text-2xl text-on-surface uppercase tracking-wider">
          New Player
        </Text>
      </View>

      {/* Register Form Panel */}
      <View className="glass-panel rounded-xl p-6 relative">
        <CornerHighlight color="border-secondary" />
        
        <Input
          label="Full Name"
          placeholder="John Doe"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setLocalError('');
          }}
          icon={<MaterialIcons name="person" size={20} color="#d575ff" />}
        />

        <Input
          label="Email Address"
          placeholder="player@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setLocalError('');
          }}
          icon={<MaterialIcons name="email" size={20} color="#d575ff" />}
        />

        <Input
          label="Phone Number"
          placeholder="+235 XX XX XX XX"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setLocalError('');
          }}
          icon={<MaterialIcons name="phone" size={20} color="#d575ff" />}
        />

        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setLocalError('');
          }}
          icon={<MaterialIcons name="lock" size={20} color="#d575ff" />}
        />

        {(localError || error) ? (
          <Text className="text-error font-body text-sm mb-4 text-center">
            {localError || error}
          </Text>
        ) : null}

        <Button
          title="CREATE ACCOUNT"
          variant="secondary"
          onPress={handleRegister}
          loading={isLoading}
          className="mt-4"
          icon={<MaterialIcons name="person-add" size={20} color="#d575ff" />}
        />
      </View>

    </ScreenWrapper>
  );
};
