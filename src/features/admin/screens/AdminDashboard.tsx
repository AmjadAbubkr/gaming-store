import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminStackParamList, RootStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { useAuthStore } from '../../../store/authStore';
import { useProductsStore } from '../../../store/productsStore';
import { useOrdersStore } from '../../../store/ordersStore';
import { Button } from '../../../components/ui/Button';
import { COLORS } from '../../../constants/theme';
import { formatPrice } from '../../../utils/formatting';
import { useI18n } from '../../../localization/LocalizationProvider';

type AdminDashboardProps = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminDashboard'>;
};

export const AdminDashboard = ({ navigation }: AdminDashboardProps) => {
  const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { logout } = useAuthStore();
  const { t } = useI18n();
  const { productsList, fetchProducts } = useProductsStore();
  const { orders, fetchAllOrders, isLoading, error } = useOrdersStore();

  const loadDashboardData = async () => {
    await Promise.allSettled([fetchProducts('all', true), fetchAllOrders()]);
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const outOfStockProducts = productsList.filter((product) => product.stock <= 0);

  return (
    <ScreenWrapper scrollable padding={false} className="bg-black px-4 py-4">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-xs uppercase tracking-[3px] text-primary">{t('admin.adminAccess')}</Text>
          <Text className="mt-2 font-headline text-3xl font-bold text-white">{t('admin.controlRoom')}</Text>
          <Text className="mt-2 max-w-[280px] text-sm leading-6 text-on-surface-variant">
            {t('admin.adminSubtitle')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            rootNavigation.navigate({
              name: 'CustomerApp',
              params: { screen: 'Tabs', params: { screen: 'HomeTab' } },
            } as const)
          }
          className="rounded-full border border-primary/40 bg-primary/10 p-3"
        >
          <MaterialIcons name="storefront" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View className="mb-6 flex-row justify-end">
        <TouchableOpacity
          onPress={logout}
          className="rounded-full border border-error/40 bg-error/10 p-3"
        >
          <MaterialIcons name="logout" size={22} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View className="mb-5 rounded-2xl border border-error/30 bg-error/10 px-4 py-4">
          <Text className="text-sm font-bold text-error">Orders could not be loaded right now.</Text>
          <Text className="mt-1 text-sm leading-5 text-on-surface-variant">
            The dashboard is still available. Try refresh after confirming your account has admin access in Firestore.
          </Text>
        </View>
      ) : null}

      <View className="mb-6 flex-row flex-wrap justify-between">
        <View className="mb-4 w-[48%] rounded-2xl border border-white/10 bg-surface-container-high px-4 py-5">
          <Text className="text-[10px] uppercase tracking-[3px] text-outline">{t('admin.pendingOrders')}</Text>
          <Text className="mt-3 font-headline text-3xl font-bold text-primary">{pendingOrders.length}</Text>
        </View>

        <View className="mb-4 w-[48%] rounded-2xl border border-white/10 bg-surface-container-high px-4 py-5">
          <Text className="text-[10px] uppercase tracking-[3px] text-outline">{t('admin.revenue')}</Text>
          <Text className="mt-3 font-headline text-xl font-bold text-secondary">{formatPrice(totalRevenue)}</Text>
        </View>

        <View className="mb-4 w-[48%] rounded-2xl border border-white/10 bg-surface-container-high px-4 py-5">
          <Text className="text-[10px] uppercase tracking-[3px] text-outline">{t('admin.catalogSize')}</Text>
          <Text className="mt-3 font-headline text-3xl font-bold text-white">{productsList.length}</Text>
        </View>

        <View className="mb-4 w-[48%] rounded-2xl border border-white/10 bg-surface-container-high px-4 py-5">
          <Text className="text-[10px] uppercase tracking-[3px] text-outline">{t('admin.outOfStock')}</Text>
          <Text className="mt-3 font-headline text-3xl font-bold text-error">{outOfStockProducts.length}</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ManageProducts')}
        className="mb-4 rounded-2xl border border-white/10 bg-surface-container-high px-5 py-5"
      >
        <Text className="font-headline text-xl font-bold text-white">{t('admin.inventorySystem')}</Text>
        <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
          {t('admin.inventoryBody')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AdminOrders')}
        className="mb-8 rounded-2xl border border-white/10 bg-surface-container-high px-5 py-5"
      >
        <Text className="font-headline text-xl font-bold text-white">{t('admin.orderCenter')}</Text>
        <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
          {t('admin.orderCenterBody')}
        </Text>
      </TouchableOpacity>

      <Button
        title={t('admin.refreshData')}
        variant="secondary"
        onPress={() => void loadDashboardData()}
        loading={isLoading}
        icon={<MaterialIcons name="refresh" size={20} color={COLORS.secondary} />}
      />

      <View className="h-10" />
    </ScreenWrapper>
  );
};
