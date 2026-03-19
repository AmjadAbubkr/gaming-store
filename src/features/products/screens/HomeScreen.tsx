import React, { useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  Dimensions, 
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
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/formatting';

const { height } = Dimensions.get('window');

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
      <View className="px-4 pt-4">
        <ImageBackground
          source={currentHero}
          style={{ width: '100%', height: height * 0.38 }}
          resizeMode="contain"
          imageStyle={{ marginTop: 14 }}
          className="overflow-hidden rounded-[30px] bg-[#111111]"
        >
          <View className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/35 px-3 py-2">
            <Text className="text-[10px] font-bold uppercase tracking-[3px] text-primary">
              Featured Drop
            </Text>
          </View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          <View className="absolute bottom-0 left-0 right-0 px-5 pb-5">
            <Text className="text-white text-3xl font-headline font-bold">
              Gear Up For
            </Text>
            <Text className="mt-1 text-[#9f9b9b] text-sm">
              A sharper storefront with premium consoles, curated titles, and a faster checkout path.
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Cart Summary Section (if cart is not empty) */}
      {cartItems.length > 0 && (
        <View className="mx-4 mt-[-26] rounded-[24px] border border-primary/15 bg-surface-container-high/70 px-6 py-5">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-[#adaaaa] text-[10px] uppercase tracking-widest font-bold">In Your Arsenal</Text>
              <Text className="text-white text-lg font-headline font-bold">{cartItems.length} Items</Text>
            </View>
            <Text className="text-primary text-xl font-headline font-bold">{formatPrice(totalPrice)}</Text>
          </View>
          
          <PremiumButton
            title="Complete Purchase"
            onPress={() => navigation.navigate('CartTab' as any)}
            className="h-12"
          />
        </View>
      )}

      {/* Products (Consoles) Section */}
      <View className="px-6 py-7">
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
              <Text className="text-primary font-bold">{formatPrice(item.price)}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Games Section */}
      <View className="px-6 py-6 pb-24">
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
              <Text className="text-secondary font-bold">{formatPrice(item.price)}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

    </ScreenWrapper>
  );
};
