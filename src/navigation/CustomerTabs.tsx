import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomerTabParamList, HomeStackParamList } from './types';
import { useCartStore } from '../store/cartStore';
import { COLORS, FONTS } from '../constants/theme';

// Screens
import { CategoriesScreen } from '../features/products/screens/CategoriesScreen';
import { ProductListScreen } from '../features/products/screens/ProductListScreen';
import { ProductDetailScreen } from '../features/products/screens/ProductDetailScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { OrderHistoryScreen } from '../features/orders/screens/OrderHistoryScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
      headerTintColor: COLORS.onSurface,
      headerTitleStyle: { fontFamily: FONTS.headline },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <HomeStack.Screen 
      name="Categories" 
      component={CategoriesScreen} 
      options={{ title: 'Hardware Database' }} 
    />
    <HomeStack.Screen 
      name="ProductList" 
      component={ProductListScreen} 
      options={({ route }) => ({ title: route.params.categoryName })} 
    />
    <HomeStack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen} 
      options={{ title: 'Item Details' }} 
    />
  </HomeStack.Navigator>
);

export const CustomerTabs = () => {
  const itemCount = useCartStore(state => state.itemCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceContainerHighest,
          borderTopColor: COLORS.outlineVariant,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarLabelStyle: {
          fontFamily: FONTS.label,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{
          tabBarLabel: 'Catalog',
          tabBarIcon: ({ color }) => <MaterialIcons name="inventory" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{
          tabBarLabel: 'Loadout',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
          headerTintColor: COLORS.onSurface,
          headerTitleStyle: { fontFamily: FONTS.headline },
          headerTitle: 'Active Loadout',
          tabBarIcon: ({ color }) => <MaterialIcons name="shopping-cart" size={24} color={color} />,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: COLORS.secondary, color: COLORS.onSurface, fontFamily: FONTS.label, fontSize: 10 }
        }} 
      />
      <Tab.Screen 
        name="OrdersTab" 
        component={OrderHistoryScreen} 
        options={{
          tabBarLabel: 'Logs',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
          headerTintColor: COLORS.onSurface,
          headerTitleStyle: { fontFamily: FONTS.headline },
          headerTitle: 'Transmission Logs',
          tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
};
