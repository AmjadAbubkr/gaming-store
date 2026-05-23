import React from 'react';
import { Alert, Linking, Text, View } from 'react-native';
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

  const handleDeleteRequest = () => {
    Alert.alert(
      t('legal.requestDeletionPromptTitle'),
      t('legal.requestDeletionPromptBody'),
      [
        { text: t('legal.cancel'), style: 'cancel' },
        {
          text: t('legal.requestDelete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await requestAccountDeletion();
              Alert.alert(
                t('legal.deletionRequestedTitle'),
                t('legal.deletionRequestedBody')
              );
            } catch {
              Alert.alert(t('legal.requestFailedTitle'), t('legal.requestFailedBody'));
            }
          },
        },
      ]
    );
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
    </ScreenWrapper>
  );
};
