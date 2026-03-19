/**
 * Orders state management using Zustand.
 * 
 * Handles fetching order history for customers and all orders for admins.
 */

import { create } from 'zustand';
import { Order, OrderItem, OrderStatus } from '../types';
import * as firestoreService from '../services/firebase/firestore';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCustomerOrders: (userId: string) => Promise<void>;
  fetchAllOrders: () => Promise<void>; // Admin only
  createOrder: (userId: string, items: OrderItem[], total: number, userName?: string, phone?: string) => Promise<Order>;
  updateOrderStatusLocally: (orderId: string, status: OrderStatus) => void; // Admin only
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchCustomerOrders: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await firestoreService.getOrdersByUser(userId);
      set({ orders, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      set({ error: 'Failed to load order history.', isLoading: false });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await firestoreService.getAllOrders();
      set({ orders, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch all orders:', error);
      set({ error: 'Failed to load orders.', isLoading: false });
    }
  },

  createOrder: async (userId, items, total, userName, phone) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await firestoreService.createOrder(userId, items, total, userName, phone);
      // Optimistically add to top of local list
      set((state) => ({ 
        orders: [newOrder, ...state.orders],
        isLoading: false 
      }));
      return newOrder;
    } catch (error: any) {
      console.error('Failed to create order:', error);
      set({ error: 'Failed to place order.', isLoading: false });
      throw error;
    }
  },

  updateOrderStatusLocally: (orderId: string, status: OrderStatus) => {
    set((state) => ({
      orders: state.orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  },
}));
