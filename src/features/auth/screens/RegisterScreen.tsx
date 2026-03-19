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
import { isValidEmail, isValidPhone } from '../../../utils/formatting';
import { MaterialIcons } from '@expo/vector-icons';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

const { height } = Dimensions.get('window');

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
      setLocalError('Please enter a valid phone number.');
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
    } catch (err) {
      // Handled by Zustand
    }
  };

  return (
    <ScreenWrapper scrollable={true} withKeyboardAvoid={true} padding={false} className="bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Top Section with Astronaut Character */}
      <ImageBackground
        source={require('../../../../assets/auth-bg.png')}
        style={{ width: '100%', height: height * 0.35 }}
        resizeMode="cover"
        className="justify-start items-start p-6"
      >
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-black/40 justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Bottom Section: Form */}
      <View className="flex-1 bg-black px-8">
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-headline font-bold mb-1">
            Sign up
          </Text>
          <View className="h-1 w-8 bg-secondary rounded-full" />
        </View>

        <View className="mb-4">
          <PremiumInput
            placeholder="Username"
            autoCapitalize="words"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setLocalError('');
            }}
            icon={<MaterialIcons name="person-outline" size={20} color="#adaaaa" />}
          />

          <PremiumInput
            placeholder="Email id"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setLocalError('');
            }}
            icon={<MaterialIcons name="mail-outline" size={20} color="#adaaaa" />}
          />

          <PremiumInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setLocalError('');
            }}
            icon={<MaterialIcons name="remove-red-eye" size={20} color="#adaaaa" />}
          />

          <Text className="text-[#adaaaa] text-[10px] text-center px-4 leading-4">
            By registering you agree with our <Text className="text-white font-bold">Terms and Conditions</Text>
          </Text>
        </View>

        {(localError || error) ? (
          <Text className="text-error font-body text-xs mb-4 text-center">
            {localError || error}
          </Text>
        ) : null}

        <PremiumButton
          title="Sign up"
          onPress={handleRegister}
          loading={isLoading}
          className="mb-6"
        />

        <View className="flex-row justify-center items-center pb-8">
          <Text className="text-[#adaaaa] text-sm">
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => {
            clearError();
            navigation.navigate('Login');
          }}>
            <Text className="text-secondary font-bold text-sm">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};
