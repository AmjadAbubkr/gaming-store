import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomerStackParamList, CustomerTabParamList } from './types';
import { useCartStore } from '../store/cartStore';
import { COLORS, FONTS } from '../constants/theme';
import { useI18n } from '../localization/LocalizationProvider';

import { HomeScreen } from '../features/products/screens/HomeScreen';
import { ProductDetailScreen } from '../features/products/screens/ProductDetailScreen';
import { ConsolesScreen } from '../features/products/screens/ConsolesScreen';
import { AccessoriesScreen } from '../features/products/screens/AccessoriesScreen';
import { GamesScreen } from '../features/products/screens/GamesScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';

const Tab = createMaterialTopTabNavigator<CustomerTabParamList>();
const CustomerStack = createNativeStackNavigator<CustomerStackParamList>();

const TAB_ICONS: Record<keyof CustomerTabParamList, keyof typeof MaterialIcons.glyphMap> = {
  HomeTab: 'home-filled',
  ConsolesTab: 'layers',
  AccessoriesTab: 'sports-esports',
  GamesTab: 'grid-view',
  CartTab: 'credit-card',
};

const TAB_LABELS: Record<keyof CustomerTabParamList, string> = {
  HomeTab: 'Home',
  ConsolesTab: 'Console',
  AccessoriesTab: 'Accessory',
  GamesTab: 'Game',
  CartTab: 'Cart',
};

const CustomerTabBar = ({ state, descriptors, navigation }: MaterialTopTabBarProps) => {
  const itemCount = useCartStore((store) => store.itemCount);
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const tabWidth = barWidth > 0 ? barWidth / state.routes.length : 0;

  useEffect(() => {
    if (tabWidth === 0) {
      return;
    }

    Animated.spring(indicatorX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      tension: 120,
      friction: 14,
    }).start();
  }, [indicatorX, state.index, tabWidth]);

  const indicatorWidth = useMemo(() => Math.max(tabWidth - 18, 48), [tabWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: Math.max(insets.bottom, 14),
      }}
    >
      <View
        onLayout={handleLayout}
        style={{
          height: 72,
          borderRadius: 22,
          backgroundColor: '#101014',
          paddingHorizontal: 8,
          paddingVertical: 8,
          elevation: 18,
          shadowColor: '#000000',
          shadowOpacity: 0.35,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 12 },
          overflow: 'hidden',
        }}
      >
        {tabWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 6,
              left: 9,
              width: indicatorWidth,
              height: 4,
              borderRadius: 999,
              backgroundColor: COLORS.primary,
              transform: [{ translateX: indicatorX }],
            }}
          />
        ) : null}

        <View style={{ flex: 1, flexDirection: 'row' }}>
          {state.routes.map((route, index) => {
            const routeName = route.name as keyof CustomerTabParamList;
            const focused = state.index === index;
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const color = focused ? COLORS.primary : COLORS.onSurfaceVariant;
            const badgeValue = routeName === 'CartTab' && itemCount > 0 ? itemCount : null;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 4,
                }}
              >
                <View style={{ position: 'relative', marginBottom: 4 }}>
                  <MaterialIcons name={TAB_ICONS[routeName]} size={22} color={color} />
                  {badgeValue ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -12,
                        minWidth: 16,
                        height: 16,
                        borderRadius: 999,
                        backgroundColor: COLORS.secondary,
                        paddingHorizontal: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.onSurface,
                          fontFamily: FONTS.label,
                          fontSize: 10,
                          lineHeight: 10,
                        }}
                      >
                        {badgeValue}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text
                  style={{
                    color,
                    fontFamily: FONTS.label,
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {{
                    HomeTab: t('nav.home'),
                    ConsolesTab: t('nav.console'),
                    AccessoriesTab: t('nav.accessory'),
                    GamesTab: t('nav.game'),
                    CartTab: t('nav.cart'),
                  }[routeName]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export const CustomerTabs = () => {
  return (
    <CustomerStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <CustomerStack.Screen name="Tabs">
        {() => (
          <Tab.Navigator
            tabBar={(props) => <CustomerTabBar {...props} />}
            tabBarPosition="bottom"
            screenOptions={{
              swipeEnabled: true,
              lazy: true,
              animationEnabled: true,
              sceneStyle: {
                backgroundColor: COLORS.background,
              },
            }}
          >
            <Tab.Screen name="HomeTab" component={HomeScreen} />
            <Tab.Screen name="ConsolesTab" component={ConsolesScreen} />
            <Tab.Screen name="AccessoriesTab" component={AccessoriesScreen} />
            <Tab.Screen name="GamesTab" component={GamesScreen} />
            <Tab.Screen name="CartTab" component={CartScreen} />
          </Tab.Navigator>
        )}
      </CustomerStack.Screen>
      <CustomerStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          title: 'Item Details',
          headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
          headerTintColor: COLORS.onSurface,
          headerTitleStyle: { fontFamily: FONTS.headline },
          headerShadowVisible: false,
          animation: 'fade_from_bottom',
        }}
      />
    </CustomerStack.Navigator>
  );
};
