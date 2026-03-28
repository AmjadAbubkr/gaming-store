import React, { memo, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Keyboard, 
  ImageBackground, 
  Image,
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
import { useI18n } from '../../../localization/LocalizationProvider';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const { height } = Dimensions.get('window');

const LoginArt = memo(() => (
  <View className="mt-3 overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-low">
    <ImageBackground
      source={require('../../../../assets/hero-spidey.png')}
      style={{ width: '100%', height: height * 0.36 }}
      resizeMode="contain"
      imageStyle={{ marginTop: 10 }}
      className="justify-end items-center bg-[#070707]"
    >
      <View className="absolute inset-0 bg-black/20" />
    </ImageBackground>
  </View>
));

LoginArt.displayName = 'LoginArt';

const LoginHeader = memo(({ title, subtitle }: { title: string; subtitle: string }) => (
  <View className="items-center mb-8">
    <Text className="text-white text-3xl font-headline font-bold mb-1">
      {title}
    </Text>
    <Text className="text-[#9c9898] text-xs uppercase tracking-[3px]">
      {subtitle}
    </Text>
    <View className="mt-4 h-1 w-14 bg-primary rounded-full" />
  </View>
));

LoginHeader.displayName = 'LoginHeader';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, isLoading, error, clearError } = useAuthStore();
  const { t, textAlign } = useI18n();

  const handleLogin = async () => {
    Keyboard.dismiss();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError(t('auth.fillAllFields'));
      return;
    }
    
    if (!isValidEmail(email)) {
      setLocalError(t('auth.invalidEmail'));
      return;
    }

    try {
      await login({ email: email.trim(), password });
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
        <LoginArt />
        <View className="mt-[-30] rounded-[28px] border border-white/10 bg-[#111111] px-6 py-7">
          <LoginHeader title={t('auth.welcomeBack')} subtitle={t('auth.enterTheVault')} />

          <View className="mb-6">
            <PremiumInput
              placeholder={t('auth.emailAddress')}
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
              placeholder={t('auth.password')}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setLocalError('');
              }}
              icon={<MaterialIcons name="lock-outline" size={20} color="#adaaaa" />}
            />

            <TouchableOpacity className="items-end mt-1">
              <Text className="text-[#adaaaa] text-xs" style={{ textAlign }}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          {(localError || error) ? (
            <Text className="text-error font-body text-xs mb-4 text-center">
              {localError || error}
            </Text>
          ) : null}

          <PremiumButton
            title={t('auth.login')}
            onPress={handleLogin}
            loading={isLoading}
            className="mb-6"
          />

          <View className="flex-row justify-center items-center">
            <Text className="text-[#adaaaa] text-sm">
              {t('auth.noAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={() => {
              clearError();
              navigation.navigate('Register');
            }}>
              <Text className="text-primary font-bold text-sm">
                {t('auth.signUp')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};
