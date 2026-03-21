import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { AdminStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { OrderCard } from '../../orders/components/OrderCard';
import { Button } from '../../../components/ui/Button';
import { useOrdersStore } from '../../../store/ordersStore';
import { openWhatsApp } from '../../../services/whatsapp';
import { COLORS } from '../../../constants/theme';
import * as firestoreService from '../../../services/firebase/firestore';
import { useI18n } from '../../../localization/LocalizationProvider';

type AdminOrdersProps = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminOrders'>;
};

export const AdminOrdersScreen = ({ navigation }: AdminOrdersProps) => {
  const { orders, fetchAllOrders, isLoading, updateOrderStatusLocally } = useOrdersStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'sent_whatsapp'>('all');
  const { t, textAlign, isRTL } = useI18n();

  useEffect(() => {
    fetchAllOrders(); // Loads everything on mount
  }, []);

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    if (currentStatus !== 'pending') return; // Can only transition from pending

    Alert.alert(
      t('admin.updateTransmission'),
      t('admin.updateTransmissionBody'),
      [
        { text: t('cart.cancel'), style: 'cancel' },
        { 
          text: t('admin.confirm'), 
          onPress: async () => {
            try {
              await firestoreService.updateOrderStatus(orderId, 'sent_whatsapp');
              updateOrderStatusLocally(orderId, 'sent_whatsapp');
            } catch (err) {
              Alert.alert(t('cart.actionFailed'), t('admin.updateOrderFailed'));
            }
          } 
        }
      ]
    );
  };

  const contactCustomer = async (phone: string, name: string) => {
    if (!phone) {
      Alert.alert(t('admin.noNumber'), t('admin.noNumberBody'));
      return;
    }
    const message = `Hello ${name}, this is Cyber-Nexus store. Regarding your recent equipment order...`;
    try {
      await openWhatsApp(message, phone);
    } catch (e) {
      Alert.alert(t('cart.actionFailed'), t('admin.failedLaunchWhatsapp'));
    }
  };

  const filteredOrders = orders.filter(o => 
    activeFilter === 'all' ? true : o.status === activeFilter
  );

  return (
    <ScreenWrapper padding={false} className="bg-black">
      <View className="mx-4 mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-high px-5 py-5">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`${isRTL ? 'ml-4' : 'mr-4'} h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/25`}
          >
            <MaterialIcons name="arrow-back" size={22} color={COLORS.onSurface} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-primary" style={{ textAlign }}>{t('admin.studio')}</Text>
            <Text className="mt-2 font-headline text-2xl font-bold text-on-surface" style={{ textAlign }}>{t('admin.orderCenter')}</Text>
          </View>
        </View>

        <Text className="mb-4 text-sm leading-6 text-on-surface-variant" style={{ textAlign }}>
          {t('admin.orderCenterBody')}
        </Text>

        <View className="h-11 flex-row overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container">
          {[
            { id: 'all', label: t('admin.allLog') },
            { id: 'pending', label: t('admin.pending') },
            { id: 'sent_whatsapp', label: t('admin.resolved') }
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveFilter(tab.id as any)}
              className={`flex-1 justify-center items-center ${activeFilter === tab.id ? 'bg-primary/20 border-b-2 border-primary' : ''}`}
            >
              <Text className={`font-label uppercase text-[10px] tracking-widest ${activeFilter === tab.id ? 'text-primary' : 'text-outline'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchAllOrders} tintColor={COLORS.primary} />
        }
        renderItem={({ item }) => (
          <View className="mb-4">
            {/* We reuse the Customer OrderCard, but pass isAdminView to show customer name/phone */}
            <OrderCard order={item} isAdminView={true} />
            
            {/* Admin Action Bar underneath the card */}
            <View className="flex-row space-x-2 mt-[-8px] z-10 mx-2">
              <Button 
                title={t('admin.messageClient')} 
                variant="whatsapp"
                onPress={() => contactCustomer(item.userPhone || '', item.userName || '')}
                className="flex-1 py-3"
                icon={<FontAwesome name="whatsapp" size={16} color="black" />}
              />
              {item.status === 'pending' && (
                <Button 
                  title={t('admin.resolve')} 
                  variant="primary"
                  onPress={() => handleStatusChange(item.id, item.status)}
                  className="flex-1 py-3 bg-surface-container border border-primary text-primary"
                />
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
           <View className="items-center justify-center p-8 mt-10 flex-col">
             <MaterialIcons name="inbox" size={48} color={COLORS.outline} />
             <Text className="font-headline text-lg uppercase tracking-wider text-outline mt-4" style={{ textAlign }}>
               {t('admin.noOrdersFound')}
             </Text>
           </View>
        )}
      />

    </ScreenWrapper>
  );
};
