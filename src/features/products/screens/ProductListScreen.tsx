import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { ProductCard } from '../components/ProductCard';
import { useProductsStore } from '../../../store/productsStore';
import { useCartStore } from '../../../store/cartStore';
import { ErrorDisplay } from '../../../components/ui/ErrorDisplay';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { COLORS } from '../../../constants/theme';

type Props = {
  route: {
    params: {
      categoryId?: string;
    };
  };
  navigation: any;
};

export const ProductListScreen = ({ route, navigation }: Props) => {
  const categoryId = route.params?.categoryId ?? 'all';
  
  const { 
    productsList, 
    isLoading, 
    isLoadingMore, 
    error, 
    fetchProducts, 
    hasMore,
    activeCategory 
  } = useProductsStore();

  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    // Only fetch if we are switching categories, or list is empty
    if (categoryId !== activeCategory || productsList.length === 0) {
      fetchProducts(categoryId, true);
    }
  }, [categoryId]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && !isLoading) {
      fetchProducts(categoryId, false);
    }
  };

  const navigateToDetail = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleQuickAdd = (product: any) => {
    // We already passed the product type properly when defining the store
    addItemToCart(product, 1);
    // In a real app, maybe show a quick toast here
  };

  // Render logic based on state
  if (isLoading && productsList.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && productsList.length === 0) {
    return <ErrorDisplay fullScreen message={error} onRetry={() => fetchProducts(categoryId, true)} />;
  }

  return (
    <ScreenWrapper padding={false}>
      <FlatList
        data={productsList}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigateToDetail(item.id)} 
            onAddToCart={() => handleQuickAdd(item)}
            className="w-[48%]"
          />
        )}
        
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center p-8 mt-20">
            <Text className="font-headline font-bold text-on-surface-variant text-lg uppercase tracking-wider text-center">
              No signal detected
            </Text>
            <Text className="font-body text-sm text-outline text-center mt-2">
              We couldn't find any products in this category.
            </Text>
          </View>
        )}
        
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        
        ListFooterComponent={() => 
          isLoadingMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : null
        }
      />
    </ScreenWrapper>
  );
};
