import React from 'react';
import { Linking, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { CustomerStackParamList } from '../../../navigation/types';
import { APP_CONFIG } from '../../../constants/config';
import { useI18n } from '../../../localization/LocalizationProvider';

type Props = NativeStackScreenProps<CustomerStackParamList, 'PrivacyPolicy'>;

export const PrivacyPolicyScreen = ({ navigation }: Props) => {
  const { t } = useI18n();
  const sections = [
    { title: t('legal.collectTitle'), body: t('legal.collectBody') },
    { title: t('legal.useTitle'), body: t('legal.useBody') },
    { title: t('legal.storageTitle'), body: t('legal.storageBody') },
    { title: t('legal.choicesTitle'), body: t('legal.choicesBody') },
  ];

  return (
    <ScreenWrapper scrollable className="bg-black px-4 py-4">
      <View className="mb-6 rounded-[28px] border border-white/10 bg-surface-container-high px-5 py-5">
        <Text className="text-[10px] uppercase tracking-[3px] text-primary">{t('legal.legal')}</Text>
        <Text className="mt-2 font-headline text-2xl font-bold text-on-surface">{t('legal.privacyPolicyHeading')}</Text>
        <Text className="mt-4 text-sm leading-6 text-on-surface-variant">
          {t('legal.privacyPolicyIntro')}
        </Text>
      </View>

      {sections.map((section) => (
        <View key={section.title} className="mb-4 rounded-[24px] border border-white/10 bg-surface-container-high px-5 py-5">
          <Text className="font-headline text-lg font-bold text-on-surface">{section.title}</Text>
          <Text className="mt-3 text-sm leading-6 text-on-surface-variant">{section.body}</Text>
        </View>
      ))}

      <View className="mb-4 rounded-[24px] border border-primary/20 bg-primary/10 px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">{t('legal.publicPolicyUrl')}</Text>
        <Text className="mt-3 text-sm leading-6 text-on-surface-variant">{APP_CONFIG.support.privacyPolicyUrl}</Text>
      </View>

      <Button
        title={t('legal.openPublicPolicy')}
        onPress={() => void Linking.openURL(APP_CONFIG.support.privacyPolicyUrl)}
        className="mb-4"
      />
      <Button title={t('legal.backToStore')} variant="secondary" onPress={() => navigation.goBack()} className="mb-16" />
    </ScreenWrapper>
  );
};
