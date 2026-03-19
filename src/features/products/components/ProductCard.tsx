import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Product } from '../../../types';
import { ImageOptimized } from '../../../components/ui/ImageOptimized';
import { CornerHighlight } from '../../../components/layout/CornerHighlight';
import { formatPrice, truncate } from '../../../utils/formatting';
import { COLORS } from '../../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart?: () => void; // Optional: Quick add from list
  className?: string; // Standard tailwind width control
}

export const ProductCard = ({ product, onPress, onAddToCart, className = 'w-[48%]' }: ProductCardProps) => {
  const isOutOfStock = product.stock <= 0;
  // Get main image or fallback
  const mainImage = product.images?.[0] || 'https://via.placeholder.com/300x300.png?text=No+Image';

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      className={`glass-panel rounded-xl overflow-hidden mb-4 relative ${className}`}
      style={{
        shadowColor: COLORS.primary,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <CornerHighlight stroke={1} size={8} className="opacity-50" />
      
      {/* Condition & Stock Badges */}
      <View className="absolute top-2 left-2 z-10 flex-row">
        <View className={`px-2 py-1 rounded ${product.condition === 'new' ? 'bg-primary/80' : 'bg-secondary/80'}`}>
          <Text className="font-label text-[10px] uppercase font-bold text-black">
            {product.condition}
          </Text>
        </View>
        {isOutOfStock && (
          <View className="px-2 py-1 rounded bg-error/80 ml-1">
            <Text className="font-label text-[10px] uppercase font-bold text-black">Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Image Container */}
      <View className="w-full aspect-square bg-surface-container-low p-2">
        <ImageOptimized 
          uri={mainImage} 
          className="w-full h-full rounded flex-1"
          contentFit="contain"
        />
      </View>

      {/* Details Area */}
      <View className="p-3">
        <Text className="font-headline font-bold text-sm text-on-surface mb-1" numberOfLines={1}>
          {product.name}
        </Text>
        
        <Text className="font-body text-xs text-on-surface-variant mb-2 h-8" numberOfLines={2}>
          {truncate(product.description, 60)}
        </Text>
        
        <View className="flex-row items-end justify-between mt-auto">
          <Text className="font-headline font-bold text-primary text-sm">
            {formatPrice(product.price)}
          </Text>
          
          {onAddToCart && !isOutOfStock && (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation(); // prevent triggering the card's onPress
                onAddToCart();
              }}
              className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center border border-primary/50"
            >
              <MaterialIcons name="add-shopping-cart" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
