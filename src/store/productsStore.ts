/**
 * Products state management using Zustand.
 * 
 * Handles fetching, caching, and filtering products from Firestore.
 * Caching in memory prevents unnecessary reads from Firestore, saving bandwidth.
 */

import { create } from 'zustand';
import { Product } from '../types';
import * as firestoreService from '../services/firebase/firestore';
import { DocumentSnapshot } from 'firebase/firestore';

interface ProductsState {
  // We store products in a map for O(1) lookups by ID,
  // and an array for ordered display
  productsMap: Record<string, Product>;
  productsList: Product[];
  
  // Pagination and loading state
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  lastDocument: DocumentSnapshot | null;
  hasMore: boolean;
  lastFetchedAt: number | null;
  
  // Current active filter
  activeCategory: string;

  // Actions
  fetchProducts: (category?: string, reset?: boolean) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  setCategory: (category: string) => void;
  
  // Admin Actions (optimistic updates)
  addProductLocally: (product: Product) => void;
  updateProductLocally: (product: Product) => void;
  removeProductLocally: (id: string) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  productsMap: {},
  productsList: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  lastDocument: null,
  hasMore: true,
  lastFetchedAt: null,
  activeCategory: 'all',

  fetchProducts: async (category = 'all', reset = false) => {
    const { lastDocument, isLoading, isLoadingMore, productsMap, productsList, activeCategory, lastFetchedAt } = get();
    
    // Prevent overlapping fetches
    if (isLoading || (isLoadingMore && !reset)) return;

    const cacheIsFresh = lastFetchedAt !== null && Date.now() - lastFetchedAt < 60_000;
    if (reset && category === activeCategory && productsList.length > 0 && cacheIsFresh) {
      return;
    }

    if (reset) {
      set({ isLoading: true, error: null, lastDocument: null, hasMore: true, activeCategory: category });
    } else {
      set({ isLoadingMore: true, error: null });
    }

    try {
      const cursor = reset ? undefined : (lastDocument as DocumentSnapshot | undefined);
      const { products, lastDocument: newLastDocument } = await firestoreService.getProducts(category, cursor);

      // Create a new map to merge with existing
      const newMap = { ...(reset ? {} : productsMap) };
      products.forEach(p => {
        newMap[p.id] = p;
      });

      set((state) => ({
        productsMap: newMap,
        // If reset, use new products. Else, append new products to existing list
        productsList: reset ? products : [...state.productsList, ...products],
        lastDocument: newLastDocument,
        hasMore: products.length > 0 && newLastDocument !== null,
        lastFetchedAt: Date.now(),
        isLoading: false,
        isLoadingMore: false,
      }));
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      set({ 
        error: 'Failed to load products. Check connection.',
        isLoading: false, 
        isLoadingMore: false 
      });
    }
  },

  getProductById: async (id: string) => {
    const { productsMap } = get();
    
    // Check cache first (saves bandwidth)
    if (productsMap[id]) return productsMap[id];

    // If not in cache, fetch from Firestore
    try {
      const product = await firestoreService.getProductById(id);
      if (product) {
        // Cache it for future
        set(state => ({
          productsMap: { ...state.productsMap, [id]: product }
        }));
      }
      return product;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      return null;
    }
  },

  setCategory: (category: string) => {
    const { activeCategory, fetchProducts } = get();
    if (category !== activeCategory) {
      fetchProducts(category, true);
    }
  },

  // --- Admin Optimistic Updates ---
  // These update the local store immediately after a successful Firestore mutation

  addProductLocally: (product: Product) => {
    set((state) => ({
      productsMap: { ...state.productsMap, [product.id]: product },
      // Add to top of list
      productsList: [product, ...state.productsList],
    }));
  },

  updateProductLocally: (product: Product) => {
    set((state) => ({
      productsMap: { ...state.productsMap, [product.id]: product },
      // Replace in list
      productsList: state.productsList.map(p => p.id === product.id ? product : p),
    }));
  },

  removeProductLocally: (id: string) => {
    set((state) => {
      const newMap = { ...state.productsMap };
      delete newMap[id];
      
      return {
        productsMap: newMap,
        productsList: state.productsList.filter(p => p.id !== id),
      };
    });
  },
}));
