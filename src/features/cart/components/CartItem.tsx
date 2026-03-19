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
    <View className="flex-row items-center p-4 bg-surface-container/50 border-b border-outline-variant/30 relative">
      <TouchableOpacity 
        onPress={onRemove}
        className="absolute top-2 right-2 p-1 z-10 rounded-full"
      >
        <MaterialIcons name="close" size={16} color={COLORS.outline} />
      </TouchableOpacity>
      
      {/* Thumbnail */}
      <View className="w-16 h-16 bg-surface-container-low rounded p-1 mr-4">
        {item.image ? (
          <ImageOptimized uri={item.image} style={{ width: '100%', height: '100%' }} contentFit="contain" />
        ) : (
          <View className="w-full h-full bg-surface-container items-center justify-center">
            <MaterialIcons name="image" size={24} color={COLORS.outline} />
          </View>
        )}
      </View>

      {/* Info & Quantity controls */}
      <View className="flex-1">
        <Text className="font-headline font-bold text-sm text-on-surface mb-1" numberOfLines={1}>
          {item.productName}
        </Text>
        <Text className="font-headline text-xs text-primary mb-3">
          {formatPrice(item.price)}
        </Text>

        <View className="flex-row items-center w-24 h-8 bg-surface-container rounded-lg border border-outline-variant/30 overflow-hidden">
          <TouchableOpacity 
            onPress={onDecrease}
            className="flex-1 h-full items-center justify-center"
          >
            <MaterialIcons name="remove" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          
          <Text className="font-body text-xs font-bold w-6 text-center text-on-surface">
            {item.quantity}
          </Text>
          
          <TouchableOpacity 
            onPress={onIncrease}
            className="flex-1 h-full items-center justify-center bg-primary/10"
          >
            <MaterialIcons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Line Total */}
      <View className="items-end ml-2 justify-end self-stretch pb-1">
        <Text className="font-label text-[10px] text-outline uppercase">Line Total</Text>
        <Text className="font-headline font-bold text-sm text-on-surface">
          {formatPrice(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
};
