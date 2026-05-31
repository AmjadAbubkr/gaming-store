import React, { useState } from 'react';
import { Alert, Linking, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { CustomerStackParamList } from '../../../navigation/types';
import { APP_CONFIG } from '../../../constants/config';
import { useAuthStore } from '../../../store/authStore';
import { useI18n } from '../../../localization/LocalizationProvider';

type Props = NativeStackScreenProps<CustomerStackParamList, 'DeleteAccount'>;

export const DeleteAccountScreen = ({ navigation }: Props) => {
  const { user, requestAccountDeletion, isLoading } = useAuthStore();
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);

  const handleDeleteRequest = () => {
    setIsPasswordPromptVisible(true);
  };

  const closePasswordPrompt = () => {
    setPassword('');
    setIsPasswordPromptVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (!password.trim()) {
      Alert.alert(t('auth.password'), 'Enter your password to delete your account.');
      return;
    }

    try {
      await requestAccountDeletion(password);
      Alert.alert(t('legal.deletionRequestedTitle'), t('legal.deletionRequestedBody'));
      setPassword('');
      setIsPasswordPromptVisible(false);
    } catch {
      Alert.alert(t('legal.requestFailedTitle'), t('legal.requestFailedBody'));
    }
  };

  return (
    <ScreenWrapper scrollable className="bg-black px-4 py-4">
      <View className="mb-6 rounded-[28px] border border-error/25 bg-surface-container-high px-5 py-5">
        <Text className="text-[10px] uppercase tracking-[3px] text-error">{t('legal.account')}</Text>
        <Text className="mt-2 font-headline text-2xl font-bold text-on-surface">{t('legal.deleteAccountHeading')}</Text>
        <Text className="mt-4 text-sm leading-6 text-on-surface-variant">
          {t('legal.deleteAccountIntro')}
        </Text>
      </View>

      <View className="mb-4 rounded-[24px] border border-white/10 bg-surface-container-high px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">{t('legal.currentAccountTitle')}</Text>
        <Text className="mt-3 text-sm text-on-surface-variant">
          {t('legal.accountName', { value: user?.name || t('legal.unknown') })}
        </Text>
        <Text className="mt-2 text-sm text-on-surface-variant">
          {t('legal.accountEmail', { value: user?.email || t('legal.unknown') })}
        </Text>
        <Text className="mt-2 text-sm text-on-surface-variant">
          {t('legal.accountPhone', { value: user?.phone || t('legal.notProvided') })}
        </Text>
      </View>

      <View className="mb-4 rounded-[24px] border border-white/10 bg-surface-container-high px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">{t('legal.howThisWorksTitle')}</Text>
        <Text className="mt-3 text-sm leading-6 text-on-surface-variant">
          {t('legal.howThisWorksBody')}
        </Text>
      </View>

      <View className="mb-4 rounded-[24px] border border-primary/20 bg-primary/10 px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">{t('legal.externalDeletionTitle')}</Text>
        <Text className="mt-3 text-sm leading-6 text-on-surface-variant">{APP_CONFIG.support.accountDeletionUrl}</Text>
      </View>

      <Button
        title={isLoading ? t('legal.submitting') : t('legal.requestDeletion')}
        variant="danger"
        loading={isLoading}
        onPress={handleDeleteRequest}
        className="mb-4"
      />
      <Button
        title={t('legal.openExternalDeletion')}
        variant="secondary"
        onPress={() => void Linking.openURL(APP_CONFIG.support.accountDeletionUrl)}
        className="mb-4"
      />
      <Button title={t('legal.backToStore')} variant="secondary" onPress={() => navigation.goBack()} className="mb-16" />

      <Modal
        visible={isPasswordPromptVisible}
        transparent
        animationType="fade"
        onRequestClose={closePasswordPrompt}
      >
        <View className="flex-1 items-center justify-center bg-black/70 px-4">
          <View className="w-full rounded-[24px] border border-white/10 bg-surface-container-high px-5 py-5">
            <Text className="font-headline text-lg font-bold text-on-surface">
              {t('auth.password')}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
              Enter your password to confirm account deletion.
            </Text>
            <View className="mt-4 rounded-lg border border-outline-variant/30 bg-surface-container-low/50 px-4 py-3">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={t('auth.password')}
                placeholderTextColor="#777575"
                className="font-body text-base text-on-surface"
              />
            </View>

            <View className="mt-5 flex-row">
              <Pressable
                onPress={closePasswordPrompt}
                className="mr-3 flex-1 rounded-2xl border border-white/10 px-4 py-3"
              >
                <Text className="text-center font-bold text-on-surface-variant">{t('legal.cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleConfirmDelete()}
                className="flex-1 rounded-2xl bg-error px-4 py-3"
              >
                <Text className="text-center font-bold text-white">{t('legal.requestDeletion')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};
