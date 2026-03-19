import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  Dimensions, 
  ScrollView, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { PremiumButton } from '../../../components/ui/PremiumButton';
import { useCartStore } from '../../../store/cartStore';
import { useProductsStore } from '../../../store/productsStore';
import { COLORS, FONTS } from '../../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../../../types/product';

const { height, width } = Dimensions.get('window');

// List of randomly picked heroes
const HERO_IMAGES = [
  require('../../../../assets/hero1.png'),
  require('../../../../assets/hero2.png'),
  require('../../../../assets/hero3.png'),
  require('../../../../assets/hero4.png'),
];

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { items: cartItems, total: totalPrice } = useCartStore();
  const { productsList, isLoading, fetchProducts } = useProductsStore();
  
  // Pick a hero on component mount
  const heroIndex = useMemo(() => Math.floor(Math.random() * HERO_IMAGES.length), []);
  const currentHero = HERO_IMAGES[heroIndex];

  useEffect(() => {
    fetchProducts('all', true);
  }, [fetchProducts]);

  // Sections
  // Consoles are playstation or xbox
  const featuredProducts = productsList.filter((p: Product) => 
    p.category === 'playstation' || p.category === 'xbox'
  ).slice(0, 4);
  
  // Games are cds
  const featuredGames = productsList.filter((p: Product) => 
    p.category === 'cds'
  ).slice(0, 4);

  return (
    <ScreenWrapper padding={false} scrollable={true} className="flex-1 bg-black">
      
      {/* 35% Top Section Hero */}
      <ImageBackground
        source={currentHero}
        style={{ width: '100%', height: height * 0.35 }}
        resizeMode="cover"
      >
        {/* Gloss Gradient at the bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
          className="absolute bottom-0 left-0 right-0 h-24"
        />
      </ImageBackground>

      {/* Cart Summary Section (if cart is not empty) */}
      {cartItems.length > 0 && (
        <View className="px-6 py-4 bg-surface-container-high/40 mx-4 mt-[-20] rounded-xl border border-white/5 backdrop-blur-md">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-[#adaaaa] text-[10px] uppercase tracking-widest font-bold">In Your Arsenal</Text>
              <Text className="text-white text-lg font-headline font-bold">{cartItems.length} Items</Text>
            </View>
            <Text className="text-primary text-xl font-headline font-bold">${totalPrice.toFixed(2)}</Text>
          </View>
          
          <PremiumButton
            title="Complete Purchase"
            onPress={() => navigation.navigate('CartTab' as any)}
            className="h-12"
          />
        </View>
      )}

      {/* Products (Consoles) Section */}
      <View className="px-6 py-6">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-white text-2xl font-headline font-bold">Modern Consoles</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ConsolesTab' as any)}>
            <Text className="text-primary font-bold text-xs uppercase tracking-wider">View More</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={featuredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="mr-4 w-40"
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <View className="h-40 bg-surface-container rounded-lg overflow-hidden mb-2 border border-white/5">
                 <ImageBackground source={{ uri: item.images[0] }} className="flex-1" />
              </View>
              <Text className="text-white font-bold" numberOfLines={1}>{item.name}</Text>
              <Text className="text-primary font-bold">${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Games Section */}
      <View className="px-6 py-6 pb-20">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-white text-2xl font-headline font-bold">Trending Games</Text>
          <TouchableOpacity onPress={() => navigation.navigate('GamesTab' as any)}>
            <Text className="text-primary font-bold text-xs uppercase tracking-wider">View More</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={featuredGames}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="mr-4 w-40"
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <View className="h-40 bg-surface-container rounded-lg overflow-hidden mb-2 border border-white/5">
                 <ImageBackground source={{ uri: item.images[0] }} className="flex-1" />
              </View>
              <Text className="text-white font-bold" numberOfLines={1}>{item.name}</Text>
              <Text className="text-secondary font-bold">${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

    </ScreenWrapper>
  );
};
