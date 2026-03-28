import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import * as firestoreService from '../../../services/firebase/firestore';
import { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/formatting';
import { LinearGradient } from 'expo-linear-gradient';
import { ACCESSORY_CATEGORIES } from '../../../utils/productCategories';
import { ImageOptimized } from '../../../components/ui/ImageOptimized';
import { useI18n } from '../../../localization/LocalizationProvider';

const { height } = Dimensions.get('window');

const ProductGridSkeleton = () => (
  <View className="flex-row flex-wrap px-4 pt-4">
    {[0, 1, 2, 3].map((item) => (
      <View key={item} className="m-2 w-[46%]">
        <SkeletonBlock style={{ height: 192, borderRadius: 16, marginBottom: 12 }} />
        <SkeletonBlock style={{ height: 14, borderRadius: 999, marginBottom: 8, width: '82%' }} />
        <SkeletonBlock style={{ height: 12, borderRadius: 999, width: '48%' }} />
      </View>
    ))}
  </View>
);

export const AccessoriesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const { t } = useI18n();
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadAccessories = async () => {
      try {
        const products = await firestoreService.getProductsByCategories(ACCESSORY_CATEGORIES, 12);
        if (isActive) {
          setAccessories(products);
        }
      } catch {
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadAccessories();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <ScreenWrapper padding={false} scrollable={false} className="bg-black">
      <View className="pt-0">
        <ImageBackground
          source={require('../../../../assets/accessories-hero.jpg')}
          style={{ width: '100%', height: Math.max(height * 0.24, 190) }}
          resizeMode="cover"
          className="overflow-hidden bg-[#111111]"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.86)']}
            className="absolute inset-0"
          />
        </ImageBackground>
      </View>

      <View className="border-b border-white/5 bg-surface-container-high/40 px-6 py-6">
        <Text className="text-3xl font-headline font-bold text-white">{t('catalog.accessory')}</Text>
        <Text className="mt-1 text-xs uppercase tracking-widest text-[#adaaaa]">
          {t('catalog.accessorySubtitle')}
        </Text>
      </View>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : accessories.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8 py-20">
          <View className="w-full rounded-[24px] border border-white/5 bg-surface-container-high/40 px-8 py-10">
            <Text className="text-center text-lg font-headline font-bold text-white">
              {t('catalog.noAccessory')}
            </Text>
            <Text className="mt-3 text-center text-sm leading-6 text-[#adaaaa]">
              {t('catalog.noAccessoryBody')}
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={accessories}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, flexGrow: accessories.length === 0 ? 1 : undefined }}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-4 w-[48%]"
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <View className="mb-3 h-48 overflow-hidden rounded-xl border border-white/5 bg-surface-container-high">
                <ImageOptimized uri={item.images[0]} style={{ width: '100%', height: '100%' }} />
              </View>
              <Text className="mx-1 font-bold text-white opacity-90" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="mx-1 font-bold text-primary">{formatPrice(item.price)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenWrapper>
  );
};
