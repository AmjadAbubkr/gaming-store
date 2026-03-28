import React from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { CustomerStackParamList } from '../../../navigation/types';
import { APP_CONFIG } from '../../../constants/config';
import { useAuthStore } from '../../../store/authStore';

type Props = NativeStackScreenProps<CustomerStackParamList, 'DeleteAccount'>;

export const DeleteAccountScreen = ({ navigation }: Props) => {
  const { user, requestAccountDeletion, isLoading } = useAuthStore();

  const handleDeleteRequest = () => {
    Alert.alert(
      'Request Account Deletion',
      'This will submit a deletion request for your account data and sign you out of the app immediately. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await requestAccountDeletion();
              Alert.alert(
                'Deletion Requested',
                'Your deletion request has been recorded. Follow the external deletion page if you need support during processing.'
              );
            } catch {
              Alert.alert('Request Failed', 'We could not submit the deletion request right now. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper scrollable className="bg-black px-4 py-4">
      <View className="mb-6 rounded-[28px] border border-error/25 bg-surface-container-high px-5 py-5">
        <Text className="text-[10px] uppercase tracking-[3px] text-error">Account</Text>
        <Text className="mt-2 font-headline text-2xl font-bold text-on-surface">Delete Account</Text>
        <Text className="mt-4 text-sm leading-6 text-on-surface-variant">
          Google Play requires an in-app deletion path for apps that let users create accounts. This screen lets a signed-in user request deletion and immediately end their active session.
        </Text>
      </View>

      <View className="mb-4 rounded-[24px] border border-white/10 bg-surface-container-high px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">Current Account</Text>
        <Text className="mt-3 text-sm text-on-surface-variant">Name: {user?.name || 'Unknown'}</Text>
        <Text className="mt-2 text-sm text-on-surface-variant">Email: {user?.email || 'Unknown'}</Text>
        <Text className="mt-2 text-sm text-on-surface-variant">Phone: {user?.phone || 'Not provided'}</Text>
      </View>

      <View className="mb-4 rounded-[24px] border border-white/10 bg-surface-container-high px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">How This Works</Text>
        <Text className="mt-3 text-sm leading-6 text-on-surface-variant">
          The app records your deletion request on your user profile and signs you out. Your support and admin process can then remove the remaining account data under the current backend rules.
        </Text>
      </View>

      <View className="mb-4 rounded-[24px] border border-primary/20 bg-primary/10 px-5 py-5">
        <Text className="font-headline text-lg font-bold text-on-surface">External Deletion Page</Text>
        <Text className="mt-3 text-sm leading-6 text-on-surface-variant">{APP_CONFIG.support.accountDeletionUrl}</Text>
      </View>

      <Button
        title={isLoading ? 'Submitting...' : 'Request Account Deletion'}
        variant="danger"
        loading={isLoading}
        onPress={handleDeleteRequest}
        className="mb-4"
      />
      <Button
        title="Open External Deletion Page"
        variant="secondary"
        onPress={() => void Linking.openURL(APP_CONFIG.support.accountDeletionUrl)}
        className="mb-4"
      />
      <Button title="Back To Store" variant="secondary" onPress={() => navigation.goBack()} className="mb-16" />
    </ScreenWrapper>
  );
};
