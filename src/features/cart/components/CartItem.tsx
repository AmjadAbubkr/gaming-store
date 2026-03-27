import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { OrderItem } from '../../../types';
import { MaterialIcons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatting';
import { COLORS } from '../../../constants/theme';
import { ImageOptimized } from '../../../components/ui/ImageOptimized';

interface CartItemProps {
  item: OrderItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }: CartItemProps) => {
  return (
    <View className="relative overflow-hidden rounded-[24px] border border-white/10 bg-surface-container-high/80 p-4">
      <TouchableOpacity 
        onPress={onRemove}
        className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/25 p-1.5"
      >
        <MaterialIcons name="close" size={16} color={COLORS.outline} />
      </TouchableOpacity>
      
      <View className="flex-row items-center">
        <View className="mr-4 h-20 w-20 overflow-hidden rounded-2xl bg-surface-container-low p-1">
          {item.image ? (
            <ImageOptimized uri={item.image} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          ) : (
            <View className="h-full w-full items-center justify-center bg-surface-container">
              <MaterialIcons name="image" size={24} color={COLORS.outline} />
            </View>
          )}
        </View>

        <View className="flex-1 pr-3">
          <Text className="mb-1 font-headline text-base font-bold text-on-surface" numberOfLines={1}>
            {item.productName}
          </Text>
          <Text className="mb-4 font-headline text-sm text-primary">
            {formatPrice(item.price)}
          </Text>

          <View className="h-10 w-28 flex-row items-center overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container">
            <TouchableOpacity 
              onPress={onDecrease}
              className="flex-1 h-full items-center justify-center"
            >
              <MaterialIcons name="remove" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            
            <Text className="w-8 text-center font-body text-sm font-bold text-on-surface">
              {item.quantity}
            </Text>
            
            <TouchableOpacity 
              onPress={onIncrease}
              className="flex-1 h-full items-center justify-center bg-primary/10"
            >
              <MaterialIcons name="add" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-end self-stretch justify-center pb-1">
          <Text className="font-label text-[10px] uppercase text-outline">Line Total</Text>
          <Text className="font-headline text-base font-bold text-on-surface">
            {formatPrice(item.price * item.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
};
