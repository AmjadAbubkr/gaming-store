import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Dimensions, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as firestoreService from '../../../services/firebase/firestore';
import { Product } from '../../../types/product';
import { CustomerStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { ImageOptimized } from '../../../components/ui/ImageOptimized';
import { formatPrice } from '../../../utils/formatting';
import { FLOATING_CUSTOMER_TAB_BAR_CLEARANCE } from '../../../constants/layout';
import { useI18n } from '../../../localization/LocalizationProvider';
import { getProductImageUri } from '../../../utils/productImages';

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

type ProductCatalogScreenProps = {
  heroSource: ImageSourcePropType;
  heroGradient: [string, string, string];
  categoryTitleKey: string;
  categorySubtitleKey: string;
  emptyTitleKey: string;
  emptyBodyKey: string;
  categories: Product['category'][];
  priceColorClassName: string;
};

export const ProductCatalogScreen = ({
  heroSource,
  heroGradient,
  categoryTitleKey,
  categorySubtitleKey,
  emptyTitleKey,
  emptyBodyKey,
  categories,
  priceColorClassName,
}: ProductCatalogScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const catalog = await firestoreService.getProductsByCategories(categories, 12);
        if (isActive) {
          setProducts(catalog);
        }
      } catch {
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [categories]);

  return (
    <ScreenWrapper
      padding={false}
      scrollable={false}
      bottomPadding={FLOATING_CUSTOMER_TAB_BAR_CLEARANCE}
      className="bg-black"
    >
      <View className="pt-0">
        <ImageBackground
          source={heroSource}
          style={{ width: '100%', height: Math.max(height * 0.24, 190) }}
          resizeMode="cover"
          className="overflow-hidden bg-[#111111]"
        >
          <LinearGradient colors={heroGradient} className="absolute inset-0" />
        </ImageBackground>
      </View>

      <View className="border-b border-white/5 bg-surface-container-high/40 px-6 py-6">
        <Text className="text-3xl font-headline font-bold text-white">{t(categoryTitleKey)}</Text>
        <Text className="mt-1 text-xs uppercase tracking-widest text-[#adaaaa]">
          {t(categorySubtitleKey)}
        </Text>
      </View>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8 py-20">
          <View className="w-full rounded-[24px] border border-white/5 bg-surface-container-high/40 px-8 py-10">
            <Text className="text-center text-lg font-headline font-bold text-white">
              {t(emptyTitleKey)}
            </Text>
            <Text className="mt-3 text-center text-sm leading-6 text-[#adaaaa]">
              {t(emptyBodyKey)}
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-4 w-[48%]"
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <View className="mb-3 h-48 overflow-hidden rounded-xl border border-white/5 bg-surface-container-high">
                <ImageOptimized uri={getProductImageUri(item.images[0])} style={{ width: '100%', height: '100%' }} />
              </View>
              <Text className="mx-1 font-bold text-white opacity-90" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className={`mx-1 font-bold ${priceColorClassName}`}>{formatPrice(item.price)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenWrapper>
  );
};
