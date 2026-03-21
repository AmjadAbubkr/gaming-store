import React, { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useOrdersStore } from '../../../store/ordersStore';
import { useAuthStore } from '../../../store/authStore';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { OrderCard } from '../components/OrderCard';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../../../components/ui/ErrorDisplay';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CustomerTabParamList } from '../../../navigation/types';

type OrderHistoryProps = {
  navigation: BottomTabNavigationProp<CustomerTabParamList, 'HomeTab'>;
};

export const OrderHistoryScreen = ({ navigation }: OrderHistoryProps) => {
  const { user, isGuest } = useAuthStore();
  const { orders, isLoading, error, fetchCustomerOrders } = useOrdersStore();

  const loadData = () => {
    if (user && !isGuest) {
      fetchCustomerOrders(user.id);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Guest View
  if (isGuest || !user) {
    return (
      <ScreenWrapper className="justify-center items-center px-6">
        <View className="w-24 h-24 rounded-full bg-surface-container items-center justify-center mb-6">
          <MaterialIcons name="lock" size={48} color={COLORS.outline} />
        </View>
        <Text className="font-headline font-bold text-xl text-on-surface uppercase mb-2 text-center tracking-wider">
          Authentication Required
        </Text>
        <Text className="font-body text-on-surface-variant text-center mb-8">
          You must be logged in to view your order history and track shipments.
        </Text>
        <Button 
          title="LOGIN OR REGISTER" 
          onPress={() => {
            // Because they clicked "Guest" before, we need to temporarily logout so AuthStack shows
            useAuthStore.getState().logout();
          }} 
          className="w-full"
        />
      </ScreenWrapper>
    );
  }

  // Handle Initial Loading state
  if (isLoading && orders.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  // Handle Error state
  if (error && orders.length === 0) {
    return <ErrorDisplay fullScreen message={error} onRetry={loadData} />;
  }

  return (
    <ScreenWrapper padding={false}>
      <View className="px-4 py-4 border-b border-surface-container-high bg-surface-container-low flex-row items-center">
        <MaterialIcons name="receipt-long" size={24} color={COLORS.primary} className="mr-3" />
        <Text className="font-headline font-bold text-lg text-on-surface uppercase tracking-wider ml-2">
          Transmission Log
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={loadData} 
            tintColor={COLORS.primary} 
            colors={[COLORS.primary]} 
          />
        }
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center p-8 mt-20">
            <MaterialIcons name="history" size={64} color={COLORS.outlineVariant} className="mb-4" />
            <Text className="font-headline font-bold text-on-surface-variant text-lg uppercase tracking-wider text-center">
              No previous transmissions
            </Text>
            <Text className="font-body text-sm text-outline text-center mt-2">
              You haven't placed any orders yet. Check out the store to start gearing up!
            </Text>
            <Button 
              title="BROWSE GEAR" 
              variant="secondary"
              className="mt-8"
              onPress={() => navigation.navigate('HomeTab')}
            />
          </View>
        )}
      />
    </ScreenWrapper>
  );
};
