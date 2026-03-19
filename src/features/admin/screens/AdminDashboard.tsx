import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { CornerHighlight } from '../../../components/layout/CornerHighlight';
import { useAuthStore } from '../../../store/authStore';
import { useProductsStore } from '../../../store/productsStore';
import { useOrdersStore } from '../../../store/ordersStore';
import { Button } from '../../../components/ui/Button';
import { COLORS } from '../../../constants/theme';
import { formatPrice } from '../../../utils/formatting';

type AdminDashboardProps = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminDashboard'>;
};

export const AdminDashboard = ({ navigation }: AdminDashboardProps) => {
  const { user, logout } = useAuthStore();
  const { productsList, fetchProducts } = useProductsStore();
  const { orders, fetchAllOrders, isLoading } = useOrdersStore();

  const loadDashboardData = () => {
    fetchProducts('all', true); // Refresh all products
    fetchAllOrders();           // Get latest orders
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute some quick stats
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = productsList.filter(p => p.stock > 0 && p.stock <= 3);
  const outOfStockProducts = productsList.filter(p => p.stock <= 0);

  return (
    <ScreenWrapper scrollable padding={false} className="px-4 py-4">
      {/* Header Info */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="font-label text-xs uppercase text-primary tracking-widest">
            Mainframe Access: Granted
          </Text>
          <Text className="font-headline font-bold text-2xl text-on-surface uppercase mt-1">
            Admin HQ
          </Text>
        </View>
        <TouchableOpacity 
          onPress={logout}
          className="p-2 rounded-full bg-error-container/30 border border-error/50 shadow-sm"
        >
          <MaterialIcons name="logout" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View className="flex-row justify-between flex-wrap mb-6">
        <View className="w-[48%] glass-panel rounded-xl p-4 mb-4 border-l-4 border-l-whatsapp-green relative">
          <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2">
            Pending Transmissions
          </Text>
          <Text className="font-headline font-bold text-3xl text-whatsapp-green">
            {pendingOrders.length}
          </Text>
          <MaterialIcons name="notifications-active" size={24} color={COLORS.whatsappGreen} className="absolute right-4 top-4 opacity-50" />
        </View>

        <View className="w-[48%] glass-panel rounded-xl p-4 mb-4 border-l-4 border-l-primary relative">
          <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2">
            Total Revenue
          </Text>
          <Text className="font-headline font-bold text-lg text-primary mt-1" numberOfLines={1}>
            {formatPrice(totalRevenue)}
          </Text>
          <MaterialIcons name="account-balance-wallet" size={24} color={COLORS.primary} className="absolute right-4 top-4 opacity-30" />
        </View>

        <View className="w-[48%] glass-panel rounded-xl p-4 border-l-4 border-l-error relative">
          <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2">
            Out of Stock
          </Text>
          <Text className="font-headline font-bold text-3xl text-error">
            {outOfStockProducts.length}
          </Text>
          <MaterialIcons name="warning" size={24} color={COLORS.error} className="absolute right-4 top-4 opacity-50" />
        </View>

        <View className="w-[48%] glass-panel rounded-xl p-4 border-l-4 border-l-secondary relative">
          <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2">
            Low Stock Alerts
          </Text>
          <Text className="font-headline font-bold text-3xl text-secondary">
            {lowStockProducts.length}
          </Text>
          <MaterialIcons name="sim-card-alert" size={24} color={COLORS.secondary} className="absolute right-4 top-4 opacity-50" />
        </View>
      </View>

      {/* Control Panel Actions */}
      <Text className="font-headline text-lg uppercase text-on-surface mb-3 tracking-widest">
        Control Panel
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AdminOrders')}
        className="glass-panel p-5 rounded-xl flex-row items-center justify-between mb-4 shadow-cyan-glow"
      >
        <CornerHighlight stroke={1} size={8} />
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-4 border border-primary/50">
            <MaterialIcons name="local-shipping" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text className="font-headline font-bold text-on-surface uppercase tracking-wider text-base">
              Manage Orders
            </Text>
            <Text className="font-body text-xs text-on-surface-variant mt-1">
              Process {pendingOrders.length} pending requests
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ManageProducts')}
        className="glass-panel p-5 rounded-xl flex-row items-center justify-between mb-8"
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-secondary/20 items-center justify-center mr-4 border border-secondary/50">
            <MaterialIcons name="inventory" size={24} color={COLORS.secondary} />
          </View>
          <View>
            <Text className="font-headline font-bold text-on-surface uppercase tracking-wider text-base">
              Inventory System
            </Text>
            <Text className="font-body text-xs text-on-surface-variant mt-1">
              {productsList.length} items in catalog
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.secondary} />
      </TouchableOpacity>

      <Button
        title="REFRESH DATA"
        variant="secondary"
        onPress={loadDashboardData}
        loading={isLoading}
        icon={<MaterialIcons name="refresh" size={20} color={COLORS.secondary} />}
      />
      
      <View className="h-10" />
    </ScreenWrapper>
  );
};
