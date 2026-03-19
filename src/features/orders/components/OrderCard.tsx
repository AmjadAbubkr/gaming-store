import React from 'react';
import { View, Text } from 'react-native';
import { Order } from '../../../types';
import { formatDate, formatPrice } from '../../../utils/formatting';
import { COLORS } from '../../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { CornerHighlight } from '../../../components/layout/CornerHighlight';

interface OrderCardProps {
  order: Order;
  isAdminView?: boolean;
}

export const OrderCard = ({ order, isAdminView = false }: OrderCardProps) => {
  const isPending = order.status === 'pending';

  return (
    <View className="glass-panel rounded-xl p-4 mb-4 relative overflow-hidden">
      <CornerHighlight color={isPending ? 'border-primary/50' : 'border-whatsapp-green/50'} />
      
      {/* Header: Date & Status */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-label text-xs uppercase text-on-surface-variant tracking-widest">
          {formatDate(order.createdAt)}
        </Text>
        
        <View className={`px-2 py-1 rounded flex-row items-center border ${
          isPending ? 'border-primary/50 bg-primary/10' : 'border-whatsapp-green/50 bg-whatsapp-green/10'
        }`}>
          <MaterialIcons 
            name={isPending ? 'pending-actions' : 'check-circle'} 
            size={12} 
            color={isPending ? COLORS.primary : COLORS.whatsappGreen} 
            className="mr-1"
          />
          <Text className={`font-label text-xs uppercase ml-1 ${
            isPending ? 'text-primary' : 'text-whatsapp-green'
          }`}>
            {isPending ? 'Awaiting Processing' : 'Confirmed'}
          </Text>
        </View>
      </View>

      {/* Admin specific info */}
      {isAdminView && (
        <View className="mb-3 p-2 bg-surface-container rounded border border-outline-variant/30">
          <Text className="font-headline text-sm font-bold text-on-surface">Client: {order.userName}</Text>
          <Text className="font-body text-xs text-primary">{order.userPhone}</Text>
        </View>
      )}

      {/* Item List Summary */}
      <View className="mb-3">
        {order.items.slice(0, 3).map((item, index) => (
          <View key={index} className="flex-row justify-between items-center mb-1">
            <Text className="font-body text-xs text-on-surface flex-1" numberOfLines={1}>
              {item.quantity}x {item.productName}
            </Text>
            <Text className="font-body text-xs text-outline ml-2">
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        ))}
        {order.items.length > 3 && (
          <Text className="font-body text-xs text-outline italic mt-1">
            + {order.items.length - 3} more items...
          </Text>
        )}
      </View>

      <View className="h-[1px] w-full bg-outline-variant/30 mb-3" />

      {/* Total Section */}
      <View className="flex-row justify-between items-end">
        <Text className="font-label text-xs uppercase text-outline">Total Value</Text>
        <Text className="font-headline font-bold text-lg text-primary tracking-wider">
          {formatPrice(order.total)}
        </Text>
      </View>
    </View>
  );
};
