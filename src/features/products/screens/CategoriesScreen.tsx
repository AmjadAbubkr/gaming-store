import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { CornerHighlight } from '../../../components/layout/CornerHighlight';
import { CATEGORIES } from '../../../constants/categories';
import { useAuthStore } from '../../../store/authStore';
import { useProductsStore } from '../../../store/productsStore';
type CategoriesScreenProps = {
  navigation: any;
};

export const CategoriesScreen = ({ navigation }: CategoriesScreenProps) => {
  const { user, isGuest } = useAuthStore();
  const { fetchProducts, isLoading } = useProductsStore();

  // Pre-fetch 'all' products in background when home mounts to speed up browsing
  useEffect(() => {
    fetchProducts('all', true);
  }, []);

  const navigateToCategory = (categoryId: string, categoryName: string) => {
    navigation.navigate('Home');
  };

  return (
    <ScreenWrapper scrollable padding={false} className="px-4">
      
      {/* Welcome Banner */}
      <View className="my-6 glass-panel p-4 rounded-xl flex-row items-center justify-between shadow-cyan-glow">
        <CornerHighlight />
        <View>
          <Text className="font-body text-xs text-on-surface-variant uppercase tracking-widest">
            Welcome back,
          </Text>
          <Text className="font-headline font-bold text-xl text-primary mt-1">
            {isGuest ? 'GUEST PLAYER' : user?.name.toUpperCase()}
          </Text>
        </View>
        <MaterialIcons name="sports-esports" size={36} color="#8ff5ff" style={{ opacity: 0.8 }} />
      </View>

      {/* Grid of Categories */}
      <Text className="font-headline font-bold text-lg text-on-surface mb-4 uppercase tracking-wider">
        Select Hardware
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.8}
            onPress={() => navigateToCategory(category.id, category.label)}
            className="w-[48%] aspect-square glass-panel rounded-xl mb-4 items-center justify-center relative overflow-hidden"
            style={{ 
              backgroundColor: `${category.gradient[0]}15`, // extremely sheer background tint
              borderColor: `${category.gradient[1]}40` 
            }}
          >
            {/* The cyber corner accents colored to match the category */}
            <CornerHighlight color="border-surface" size={10} stroke={2} className="opacity-50" />
            
            <View 
              className="w-16 h-16 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${category.gradient[0]}30` }}
            >
              <MaterialIcons name={category.icon as any} size={32} color={category.gradient[1]} />
            </View>
            
            <Text 
              className="font-headline font-bold uppercase tracking-widest text-center"
              style={{ color: category.gradient[1], fontSize: 13 }}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Access to All Products */}
      <TouchableOpacity
        onPress={() => navigateToCategory('all', 'All Gear')}
        className="w-full glass-panel rounded-xl p-4 mt-2 flex-row items-center justify-between border-primary/30"
      >
        <View className="flex-row items-center">
          <MaterialIcons name="grid-view" size={24} color="#8ff5ff" />
          <Text className="font-headline font-bold text-on-surface ml-3 uppercase tracking-wider">
            View All Catalog
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#8ff5ff" />
      </TouchableOpacity>

      <View className="h-10" /> 
    </ScreenWrapper>
  );
};
