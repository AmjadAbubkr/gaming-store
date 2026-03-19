import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';
import { COLORS, FONTS } from '../constants/theme';

const Stack = createNativeStackNavigator<AdminStackParamList>();

// Placeholders for admin screens
import { View, Text } from 'react-native';
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
    <Text style={{ color: COLORS.secondary, fontFamily: FONTS.headline }}>Admin: {name}</Text>
  </View>
);

/**
 * Stack navigator for users with 'admin' role.
 */
export const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
        headerTintColor: COLORS.onSurface,
        headerTitleStyle: { fontFamily: FONTS.headline },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen 
        name="AdminDashboard" 
        component={() => <PlaceholderScreen name="Dashboard" />} 
        options={{ title: 'Admin Dashboard' }} 
      />
      <Stack.Screen 
        name="ManageProducts" 
        component={() => <PlaceholderScreen name="Manage Products" />} 
        options={{ title: 'Manage Products' }} 
      />
      <Stack.Screen 
        name="AddEditProduct" 
        component={() => <PlaceholderScreen name="Add/Edit Product" />} 
        options={({ route }) => ({
          title: route.params?.productId ? 'Edit Product' : 'Add Product'
        })} 
      />
      <Stack.Screen 
        name="AdminOrders" 
        component={() => <PlaceholderScreen name="All Orders" />} 
        options={{ title: 'Store Orders' }} 
      />
    </Stack.Navigator>
  );
};
