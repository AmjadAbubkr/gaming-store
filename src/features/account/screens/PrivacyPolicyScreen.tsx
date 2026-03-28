import React from 'react';
import { Linking, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { CustomerStackParamList } from '../../../navigation/types';
import { APP_CONFIG } from '../../../constants/config';

type Props = NativeStackScreenProps<CustomerStackParamList, 'PrivacyPolicy'>;

const sections = [
  {
    title: 'What We Collect',
    body: 'We collect the account information you enter in the app, including your name, email address, phone number, and the order history you create while using the store.',
  },
  {
    title: 'Why We Use It',
    body: 'We use this data to authenticate your account, show your profile, process store orders, support WhatsApp checkout, and help admins manage fulfillment.',
  },
  {
    title: 'How It Is Stored',
    body: 'Account and order records are stored in Firebase Authentication and Cloud Firestore. Data is sent over encrypted connections.',
  },
  {
    title: 'Your Choices',
    body: 'You can request account deletion from inside the app and also from the external account deletion page linked below.',
  },
];

export const PrivacyPolicyScreen = ({ navigation }: Props) => {
  return (
    <ScreenWrapper scrollable className="bg-black px-4 py-4">
      <View className="mb-6 rounded-[28px] border border-white/10 bg-surface-container-high px-5 py-5">
        <Text className="text-[10px] uppercase tracking-[3px] text-primary">Legal</Text>
        <Text className="mt-2 font-headline text-2xl font-bold text-on-surface">Privacy Policy</Text>
        <Text className="mt-4 text-sm leading-6 text-on-surface-variant">
          This page summarizes how the app handles account, profile, phone, and order data. The public policy page is linked below for Google Play submission and customer review.
        </Text>
      </View>

      {sections.map((section) => (
        <View key={section.title} className="mb-4 rounded-[24px] border border-white/10 bg-surface-container-high px-5 py-5">
          <Text className="font-headline text-lg font-bold text-on-surface">{section.title}</Text>
          <Text className="mt-3 text-sm leading-6 text-on-surface-variant">{section.body}</Text>
        </View>
      ))}

      <View className="mb-4 rounded-[24px] border border-primary/20 bg-primary/10 px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">Public Policy URL</Text>
        <Text className="mt-3 text-sm leading-6 text-on-surface-variant">{APP_CONFIG.support.privacyPolicyUrl}</Text>
      </View>

      <Button
        title="Open Public Policy"
        onPress={() => void Linking.openURL(APP_CONFIG.support.privacyPolicyUrl)}
        className="mb-4"
      />
      <Button title="Back To Store" variant="secondary" onPress={() => navigation.goBack()} className="mb-16" />
    </ScreenWrapper>
  );
};
