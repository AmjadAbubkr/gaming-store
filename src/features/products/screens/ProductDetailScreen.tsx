import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { ImageOptimized } from '../../../components/ui/ImageOptimized';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { formatPrice } from '../../../utils/formatting';
import { useProductsStore } from '../../../store/productsStore';
import { useCartStore } from '../../../store/cartStore';
import { Product } from '../../../types';
import { COLORS } from '../../../constants/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

const { width } = Dimensions.get('window');

export const ProductDetailScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const getProductById = useProductsStore(s => s.getProductById);
  const addItemToCart = useCartStore(s => s.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const data = await getProductById(productId);
      setProduct(data);
      setIsLoading(false);
    };
    loadProduct();
  }, [productId]);

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!product) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-6">
        <Text className="text-error font-headline text-lg uppercase mb-4">Product Not Found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/600x600.png?text=No+Image'];

  const handleAddToCart = () => {
    addItemToCart(product, 1);
    navigation.goBack(); // Return to shop after adding
  };

  return (
    <ScreenWrapper scrollable padding={false} className="pb-10">
      
      {/* Image Carousel Area */}
      <View className="relative bg-surface-container w-full aspect-square">
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
        >
          {images.map((url, index) => (
            <ImageOptimized 
              key={index} 
              uri={url} 
              style={{ width, height: width }}
              contentFit="contain" 
            />
          ))}
        </ScrollView>
        
        {/* Pagination Dots */}
        {images.length > 1 && (
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2">
            {images.map((_, i) => (
              <View 
                key={i} 
                className={`h-2 rounded-full mx-1 ${i === activeImageIndex ? 'w-6 bg-primary' : 'w-2 bg-on-surface-variant/50'}`} 
              />
            ))}
          </View>
        )}
      </View>

      {/* Product Info Area */}
      <View className="p-6">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="font-headline font-bold text-2xl text-on-surface flex-1 mr-4">
            {product.name}
          </Text>
          <Text className="font-headline font-bold text-xl text-primary">
            {formatPrice(product.price)}
          </Text>
        </View>

        {/* Badges */}
        <View className="flex-row space-x-3 mb-6">
          <View className={`px-3 py-1 rounded border ${product.condition === 'new' ? 'border-primary/50 bg-primary/10' : 'border-secondary/50 bg-secondary/10'}`}>
            <Text className={`font-label text-xs uppercase ${product.condition === 'new' ? 'text-primary' : 'text-secondary'}`}>
              Condition: {product.condition}
            </Text>
          </View>
          
          <View className={`px-3 py-1 rounded border ${isOutOfStock ? 'border-error/50 bg-error/10' : 'border-primary-dim/50 bg-primary-dim/10'}`}>
            <Text className={`font-label text-xs uppercase ${isOutOfStock ? 'text-error' : 'text-primary-dim'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock} Available`}
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <View className="mb-8">
          <Text className="font-headline text-sm text-primary mb-2 uppercase tracking-widest">
            Hardware Specs / Details
          </Text>
          <View className="h-[1px] w-full bg-outline-variant/30 mb-4" />
          <Text className="font-body text-base text-on-surface-variant leading-relaxed">
            {product.description || 'No description provided.'}
          </Text>
        </View>

      </View>

      {/* Fixed Bottom Action Bar Space (actual bar is placed relatively here) */}
      <View className="px-6 mb-6">
        <Button 
          title={isOutOfStock ? "SOLD OUT" : "ADD TO LOADOUT"}
          disabled={isOutOfStock}
          onPress={handleAddToCart}
          icon={<MaterialIcons name="add-shopping-cart" size={20} color={isOutOfStock ? COLORS.outline : COLORS.primary} />}
        />
      </View>
      
    </ScreenWrapper>
  );
};
