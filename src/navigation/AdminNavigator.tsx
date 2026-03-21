import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';
import { COLORS, FONTS } from '../constants/theme';
import { AdminDashboard } from '../features/admin/screens/AdminDashboard';
import { ManageProductsScreen } from '../features/admin/screens/ManageProductsScreen';
import { AddEditProductScreen } from '../features/admin/screens/AddEditProductScreen';
import { AdminOrdersScreen } from '../features/admin/screens/AdminOrdersScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.surfaceContainerHighest },
        headerTintColor: COLORS.onSurface,
        headerTitleStyle: { fontFamily: FONTS.headline },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
      <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
    </Stack.Navigator>
  );
};
