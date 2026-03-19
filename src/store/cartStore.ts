/**
 * Shopping Cart state management using Zustand.
 * 
 * IMPORTANT: This store uses the 'persist' middleware to save the cart
 * to AsyncStorage. This means if the user closes the app or loses connection,
 * their cart is still there when they come back. Critical for low bandwidth areas.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderItem, Product } from '../types';

interface CartState {
  items: OrderItem[];
  total: number;
  itemCount: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product: Product, quantity: number = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.productId === product.id);

        let newItems;
        if (existingItem) {
          // Update quantity if already in cart
          newItems = items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item (snapshot current name and price)
          newItems = [
            ...items,
            {
              productId: product.id,
              productName: product.name,
              price: product.price,
              quantity,
              image: product.images[0], // Store first image for display
            },
          ];
        }

        // Calculate new totals
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = newItems.reduce((count, item) => count + item.quantity, 0);

        set({ items: newItems, total, itemCount });
      },

      removeItem: (productId: string) => {
        const { items } = get();
        const newItems = items.filter((item) => item.productId !== productId);

        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = newItems.reduce((count, item) => count + item.quantity, 0);

        set({ items: newItems, total, itemCount });
      },

      updateQuantity: (productId: string, quantity: number) => {
        const { items } = get();
        // Prevent negative or zero quantity (use removeItem instead)
        if (quantity < 1) return;

        const newItems = items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );

        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = newItems.reduce((count, item) => count + item.quantity, 0);

        set({ items: newItems, total, itemCount });
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },
    }),
    {
      name: 'gaming-store-cart', // Key used in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
