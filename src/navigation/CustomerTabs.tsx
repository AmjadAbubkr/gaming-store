import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomerTabParamList, HomeStackParamList } from './types';
import { useCartStore } from '../store/cartStore';
import { COLORS, FONTS } from '../constants/theme';

// Screens
import { HomeScreen } from '../features/products/screens/HomeScreen';
import { ProductDetailScreen } from '../features/products/screens/ProductDetailScreen';
import { ConsolesScreen } from '../features/products/screens/ConsolesScreen';
import { GamesScreen } from '../features/products/screens/GamesScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <HomeStack.Screen 
      name="Home" 
      component={HomeScreen} 
    />
    <HomeStack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen} 
      options={{ 
        headerShown: true,
        title: 'Item Details',
        headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
        headerTintColor: COLORS.onSurface,
        headerTitleStyle: { fontFamily: FONTS.headline },
        headerShadowVisible: false,
      }} 
    />
  </HomeStack.Navigator>
);

export const CustomerTabs = () => {
  const itemCount = useCartStore(state => state.itemCount);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceContainerHighest,
          borderTopColor: COLORS.outlineVariant,
          height: 72 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
          paddingHorizontal: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarLabelStyle: {
          fontFamily: FONTS.label,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="ConsolesTab" 
        component={ConsolesScreen} 
        options={{
          tabBarLabel: 'Consoles',
          tabBarIcon: ({ color }) => <MaterialIcons name="videogame-asset" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="GamesTab" 
        component={GamesScreen} 
        options={{
          tabBarLabel: 'Games',
          tabBarIcon: ({ color }) => <MaterialIcons name="sports-esports" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{
          tabBarLabel: 'Cart',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
          headerTintColor: COLORS.onSurface,
          headerTitleStyle: { fontFamily: FONTS.headline },
          headerTitle: 'Your Cart',
          tabBarIcon: ({ color }) => <MaterialIcons name="shopping-cart" size={24} color={color} />,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: COLORS.secondary, color: COLORS.onSurface, fontFamily: FONTS.label, fontSize: 10 }
        }} 
      />
    </Tab.Navigator>
  );
};
