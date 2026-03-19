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

type AdminOrdersProps = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminOrders'>;
};

export const AdminOrdersScreen = ({ navigation }: AdminOrdersProps) => {
  const { orders, fetchAllOrders, isLoading, updateOrderStatusLocally } = useOrdersStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'sent_whatsapp'>('all');

  useEffect(() => {
    fetchAllOrders(); // Loads everything on mount
  }, []);

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    if (currentStatus !== 'pending') return; // Can only transition from pending

    Alert.alert(
      'Update Transmission Status',
      'Confirm this order has been processed via WhatsApp?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            try {
              await firestoreService.updateOrderStatus(orderId, 'sent_whatsapp');
              updateOrderStatusLocally(orderId, 'sent_whatsapp');
            } catch (err) {
              Alert.alert('Error', 'Failed to update order status');
            }
          } 
        }
      ]
    );
  };

  const contactCustomer = async (phone: string, name: string) => {
    if (!phone) {
      Alert.alert('No Number', 'Customer did not provide a phone number.');
      return;
    }
    const message = `Hello ${name}, this is Cyber-Nexus store. Regarding your recent equipment order...`;
    try {
      await openWhatsApp(message, phone);
    } catch (e) {
      Alert.alert('Failed to launch WhatsApp');
    }
  };

  const filteredOrders = orders.filter(o => 
    activeFilter === 'all' ? true : o.status === activeFilter
  );

  return (
    <ScreenWrapper padding={false}>
      
      {/* Header */}
      <View className="px-4 py-4 bg-surface-container-highest border-b border-surface-container-high/50">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-xl text-on-surface uppercase tracking-wider flex-1">
            Incoming Transmissions
          </Text>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row border border-outline-variant/30 rounded-lg overflow-hidden h-10 bg-surface-container">
          {[
            { id: 'all', label: 'All Log' },
            { id: 'pending', label: 'Pending' },
            { id: 'sent_whatsapp', label: 'Resolved' }
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
        contentContainerStyle={{ padding: 16 }}
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
                title="MESSAGE CLIENT" 
                variant="whatsapp"
                onPress={() => contactCustomer(item.userPhone || '', item.userName || '')}
                className="flex-1 py-3"
                icon={<FontAwesome name="whatsapp" size={16} color="black" />}
              />
              {item.status === 'pending' && (
                <Button 
                  title="RESOLVE" 
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
             <Text className="font-headline text-lg uppercase tracking-wider text-outline mt-4">
               No Transmissions Found
             </Text>
           </View>
        )}
      />

    </ScreenWrapper>
  );
};
