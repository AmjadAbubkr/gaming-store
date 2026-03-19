/**
 * Strict typing for React Navigation.
 * Defining types here ensures we get autocomplete and compilation errors
 * if we try to navigate to a screen that doesn't exist or pass the wrong params.
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../types';

// The screens available when user is NOT logged in or is checking auth state
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// The screens available to Admins
export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageProducts: undefined;
  AddEditProduct: { productId?: string }; // if id is present, it's Edit mode
  AdminOrders: undefined;
};

// The screens internally in the Customer's Home tab stack
export type HomeStackParamList = {
  Categories: undefined;
  ProductList: { categoryId: string; categoryName: string };
  ProductDetail: { productId: string };
};

// The main Bottom Tabs for a regular customer
export type CustomerTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined; // Or Auth account settings
};

// The Root Navigator which decides which of the above to show
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  CustomerApp: NavigatorScreenParams<CustomerTabParamList>;
  AdminApp: NavigatorScreenParams<AdminStackParamList>;
};
