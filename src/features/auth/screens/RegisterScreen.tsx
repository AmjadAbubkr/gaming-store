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
import { useI18n } from '../../../localization/LocalizationProvider';

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
  const { t } = useI18n();

  const handleRegister = async () => {
    Keyboard.dismiss();
    setLocalError('');
    clearError();

    // Validation
    if (!name || !email || !phone || !password) {
      setLocalError(t('auth.fillAllFields'));
      return;
    }
    if (!isValidEmail(email)) {
      setLocalError(t('auth.invalidEmail'));
      return;
    }
    if (!isValidPhone(phone)) {
      setLocalError(t('auth.invalidPhone'));
      return;
    }
    if (password.length < 6) {
      setLocalError(t('auth.passwordMin'));
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
    <ScreenWrapper
      scrollable
      withKeyboardAvoid
      keyboardVerticalOffset={80}
      padding={false}
      className="bg-black"
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black px-5 pb-10">
        <View className="mt-3 overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-low">
          <ImageBackground
            source={require('../../../../assets/hero-spidey.png')}
            style={{ width: '100%', height: height * 0.32 }}
            resizeMode="contain"
            imageStyle={{ marginTop: 8, alignSelf: 'center' }}
            className="justify-start items-start bg-[#070707] p-5"
          >
            <TouchableOpacity 
              className="w-10 h-10 rounded-full bg-black/50 justify-center items-center"
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View className="mt-[-22] rounded-[28px] border border-white/10 bg-[#111111] px-6 py-7">
          <View className="items-center mb-8">
            <Text className="text-white text-3xl font-headline font-bold mb-1">
              {t('auth.createAccount')}
            </Text>
            <Text className="text-[#9c9898] text-xs uppercase tracking-[3px]">
              {t('auth.joinTheNexus')}
            </Text>
            <View className="mt-4 h-1 w-10 bg-secondary rounded-full" />
          </View>

          <View className="mb-4">
            <PremiumInput
              placeholder={t('auth.username')}
              autoCapitalize="words"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setLocalError('');
              }}
              icon={<MaterialIcons name="person-outline" size={20} color="#adaaaa" />}
            />

            <PremiumInput
              placeholder={t('auth.emailId')}
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
              placeholder={t('auth.phoneNumber')}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setLocalError('');
              }}
              icon={<MaterialIcons name="phone-android" size={20} color="#adaaaa" />}
            />

            <PremiumInput
              placeholder={t('auth.password')}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setLocalError('');
              }}
              icon={<MaterialIcons name="remove-red-eye" size={20} color="#adaaaa" />}
            />

            <Text className="text-[#adaaaa] text-[10px] text-center px-4 leading-4">
              {t('auth.terms')}
            </Text>
          </View>

          {(localError || error) ? (
            <Text className="text-error font-body text-xs mb-4 text-center">
              {localError || error}
            </Text>
          ) : null}

          <PremiumButton
            title={t('auth.signUp')}
            onPress={handleRegister}
            loading={isLoading}
            className="mb-6"
          />

          <View className="flex-row justify-center items-center pb-2">
            <Text className="text-[#adaaaa] text-sm">
              {t('auth.alreadyHaveAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={() => {
              clearError();
              navigation.navigate('Login');
            }}>
              <Text className="text-secondary font-bold text-sm">
                {t('auth.login')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};
