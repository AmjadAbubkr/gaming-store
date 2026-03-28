import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomerStackParamList, CustomerTabParamList, RootStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { PremiumButton } from '../../../components/ui/PremiumButton';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import * as firestoreService from '../../../services/firebase/firestore';
import { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/formatting';
import { CONSOLE_CATEGORIES, GAME_CATEGORIES } from '../../../utils/productCategories';
import { ImageOptimized } from '../../../components/ui/ImageOptimized';
import { useI18n } from '../../../localization/LocalizationProvider';

const { height } = Dimensions.get('window');

const HERO_BANNERS = [require('../../../../assets/home-hero.jpg')];

const getNextHeroIndex = (currentIndex: number) => {
  if (HERO_BANNERS.length <= 1) {
    return currentIndex;
  }

  return (currentIndex + 1) % HERO_BANNERS.length;
};

const HomeSectionSkeleton = () => (
  <View className="flex-row">
    {[0, 1].map((item) => (
      <View key={item} className="mr-4 w-40">
        <SkeletonBlock style={{ height: 160, borderRadius: 20, marginBottom: 10 }} />
        <SkeletonBlock style={{ height: 14, borderRadius: 999, marginBottom: 8, width: '85%' }} />
        <SkeletonBlock style={{ height: 12, borderRadius: 999, width: '45%' }} />
      </View>
    ))}
  </View>
);

export const HomeScreen = () => {
  const navigation = useNavigation<
    CompositeNavigationProp<
      MaterialTopTabNavigationProp<CustomerTabParamList>,
      NativeStackNavigationProp<CustomerStackParamList>
    >
  >();
  const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();
  const { t } = useI18n();
  const { items: cartItems, total: totalPrice } = useCartStore();
  const [heroIndex, setHeroIndex] = useState(() => Math.floor(Math.random() * HERO_BANNERS.length));
  const [featuredConsoles, setFeaturedConsoles] = useState<Product[]>([]);
  const [featuredGames, setFeaturedGames] = useState<Product[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  const firstName = useMemo(() => {
    const trimmedName = user?.name?.trim();
    return trimmedName ? trimmedName.split(/\s+/)[0] : 'Player';
  }, [user?.name]);

  useEffect(() => {
    let isActive = true;

    const loadCatalog = async () => {
      try {
        const [consoles, games] = await Promise.all([
          firestoreService.getProductsByCategories(CONSOLE_CATEGORIES, 6),
          firestoreService.getProductsByCategories(GAME_CATEGORIES, 6),
        ]);

        if (!isActive) {
          return;
        }

        setFeaturedConsoles(consoles.slice(0, 4));
        setFeaturedGames(games.slice(0, 4));
      } catch {
      } finally {
        if (isActive) {
          setIsCatalogLoading(false);
        }
      }
    };

    void loadCatalog();

    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setHeroIndex((currentIndex) => getNextHeroIndex(currentIndex));
    }, [])
  );

  const currentHero = HERO_BANNERS[heroIndex];

  return (
    <ScreenWrapper padding={false} scrollable className="flex-1 bg-black">
      <Animated.View key={`hero-${heroIndex}`} entering={FadeInDown.duration(260)} className="px-4 pt-4">
        <ImageBackground
          source={currentHero}
          style={{ width: '100%', height: height * 0.46, minHeight: 320 }}
          resizeMode="cover"
          className="overflow-hidden rounded-[32px] bg-[#0b0b0b]"
        >
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.04)',
              'rgba(0,0,0,0.08)',
              'rgba(0,0,0,0.64)',
              'rgba(0,0,0,0.97)',
            ]}
            className="absolute inset-0"
          />

          {user?.role === 'admin' ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                rootNavigation.navigate({
                  name: 'AdminApp',
                  params: { screen: 'AdminDashboard' },
                } as const)
              }
              className="absolute left-4 top-4 z-20 flex-row items-center rounded-2xl border border-primary/35 bg-black/55 px-4 py-3"
            >
              <MaterialIcons name="dashboard" size={18} color="#4f8cff" />
              <Text className="ml-2 text-[11px] font-bold uppercase tracking-[2px] text-primary">
                {t('home.dashboard')}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={logout}
            className="absolute right-4 top-4 z-20 flex-row items-center rounded-2xl border border-white/10 bg-black/55 px-3 py-3"
          >
            <MaterialIcons name="logout" size={18} color="#adaaaa" />
          </TouchableOpacity>

          <View className="absolute bottom-24 left-0 right-0 h-20 bg-white/5 opacity-25" />

          <View className="absolute bottom-0 left-0 right-0 px-5 pb-6">
            <Text className="text-[11px] uppercase tracking-[3px] text-[#b7b3b3]">
              {t('home.welcomeBackUser', { name: firstName })}
            </Text>
            <Text className="mt-2 max-w-[88%] text-sm leading-5 text-[#d1cccc]">
              {t('home.heroSubtitle')}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>

      {cartItems.length > 0 && (
        <Animated.View
          entering={FadeInDown.delay(70).duration(420)}
          className="mx-4 mt-4 rounded-[24px] border border-primary/15 bg-surface-container-high/70 px-6 py-5"
        >
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-[#adaaaa]">
                {t('home.cartSummary')}
              </Text>
              <Text className="text-lg font-headline font-bold text-white">
                {cartItems.length} {t('home.items')}
              </Text>
            </View>
            <Text className="text-xl font-headline font-bold text-primary">
              {formatPrice(totalPrice)}
            </Text>
          </View>

          <PremiumButton
            title={t('home.completePurchase')}
            onPress={() => navigation.navigate('CartTab')}
            className="h-12"
          />
        </Animated.View>
      )}

      <Animated.View entering={FadeInRight.delay(120).duration(420)} className="px-6 py-8">
        <View className="mb-4 flex-row items-end justify-between">
          <View>
            <Text className="text-2xl font-headline font-bold text-white">{t('home.modernConsoles')}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ConsolesTab')}>
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">{t('home.viewMore')}</Text>
          </TouchableOpacity>
        </View>

        {isCatalogLoading ? (
          <HomeSectionSkeleton />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={featuredConsoles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mr-4 w-40"
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              >
                <View className="mb-2 h-40 overflow-hidden rounded-[20px] border border-white/5 bg-surface-container">
                  <ImageOptimized uri={item.images[0]} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text className="font-bold text-white" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="font-bold text-primary">{formatPrice(item.price)}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="h-44 w-full items-center justify-center rounded-[20px] border border-white/5 bg-surface-container">
                <Text className="text-[#adaaaa]">{t('home.noConsoles')}</Text>
              </View>
            }
          />
        )}
      </Animated.View>

      <Animated.View entering={FadeInRight.delay(180).duration(420)} className="px-6 py-8">
        <View className="mb-4 flex-row items-end justify-between">
          <View>
            <Text className="text-2xl font-headline font-bold text-white">{t('home.trendingGames')}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('GamesTab')}>
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">{t('home.viewMore')}</Text>
          </TouchableOpacity>
        </View>

        {isCatalogLoading ? (
          <HomeSectionSkeleton />
        ) : (
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
                <View className="mb-2 h-40 overflow-hidden rounded-[20px] border border-white/5 bg-surface-container">
                  <ImageOptimized uri={item.images[0]} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text className="font-bold text-white" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="font-bold text-secondary">{formatPrice(item.price)}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="h-44 w-full items-center justify-center rounded-[20px] border border-white/5 bg-surface-container">
                <Text className="text-[#adaaaa]">{t('home.noGames')}</Text>
              </View>
            }
          />
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(220).duration(420)}
        className="mx-4 mt-2 mb-28 rounded-[24px] border border-white/10 bg-surface-container-high/70 px-6 py-5"
      >
        <Text className="text-[10px] font-bold uppercase tracking-widest text-[#adaaaa]">
          Account & Legal
        </Text>
        <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
          Review the privacy policy, open the public compliance page, or submit an account deletion request required for Play Store distribution.
        </Text>

        <View className="mt-4 flex-row">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PrivacyPolicy')}
            className="mr-3 flex-1 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-4"
          >
            <Text className="font-headline text-sm font-bold uppercase tracking-[2px] text-primary">
              Privacy Policy
            </Text>
            <Text className="mt-2 text-xs leading-5 text-on-surface-variant">
              View the in-app summary and the public URL for Google Play.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('DeleteAccount')}
            className="flex-1 rounded-2xl border border-error/25 bg-error/10 px-4 py-4"
          >
            <Text className="font-headline text-sm font-bold uppercase tracking-[2px] text-error">
              Delete Account
            </Text>
            <Text className="mt-2 text-xs leading-5 text-on-surface-variant">
              Submit an in-app deletion request and review the external deletion steps.
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
};
