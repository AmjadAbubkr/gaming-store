import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, CustomerTabParamList } from '../../../navigation/types';
import { useProductsStore } from '../../../store/productsStore';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Product } from '../../../types/product';

export const GamesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList & CustomerTabParamList>>();
  const { productsList, isLoading, fetchProducts } = useProductsStore();
  
  const games = productsList.filter((p: Product) => p.category === 'cds');

  useEffect(() => {
    fetchProducts('all', true);
  }, [fetchProducts]);

  if (isLoading && games.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenWrapper padding={false} scrollable={false} className="bg-black">
      <View className="px-6 py-6 border-b border-white/5 bg-surface-container-high/40">
        <Text className="text-white text-3xl font-headline font-bold">Games</Text>
        <Text className="text-[#adaaaa] text-xs uppercase tracking-widest mt-1">Hottest Titles</Text>
      </View>

      <FlatList
        data={games}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="m-2 flex-1"
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <View className="h-48 bg-surface-container-high rounded-xl overflow-hidden mb-3 border border-white/5">
              <ImageBackground source={{ uri: item.images[0] }} className="flex-1" />
            </View>
            <Text className="text-white font-bold opacity-90 mx-1" numberOfLines={1}>{item.name}</Text>
            <Text className="text-secondary font-bold mx-1">${item.price}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-[#adaaaa]">No games currently available.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};
