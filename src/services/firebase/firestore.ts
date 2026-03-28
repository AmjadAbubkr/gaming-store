/**
 * Firestore database service.
 * 
 * This is the main data layer for the app. It handles all CRUD operations
 * for products and orders against Cloud Firestore.
 * 
 * WHY Firestore:
 * - Real-time sync (useful for stock updates)
 * - Offline persistence (works when internet is spotty — important for Chad)
 * - Simple to query with compound indexes
 * 
 * PAGINATION:
 * All list queries use cursor-based pagination to keep bandwidth low.
 * Instead of loading all products at once, we load 10 at a time.
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from './config';
import { Product, ProductFormData, Order, OrderItem, OrderStatus } from '../../types';
import { APP_CONFIG } from '../../constants/config';
import { withTimeout } from '../../utils/withTimeout';

// ============================================================
// PRODUCTS
// ============================================================

/**
 * Fetch products with optional category filter and pagination.
 * Returns products and the last document (for loading more).
 * 
 * @param category - Optional category filter ('playstation', 'xbox', etc.)
 * @param lastDoc - Last document from previous page (for pagination)
 */
export const getProducts = async (
  category?: string,
  lastDoc?: DocumentSnapshot
): Promise<{ products: Product[]; lastDocument: DocumentSnapshot | null }> => {
  const productsRef = collection(db, APP_CONFIG.collections.products);

  // Build the query dynamically based on filters
  const constraints: any[] = [
    orderBy('createdAt', 'desc'),                           // Newest first
    limit(APP_CONFIG.pagination.productsPerPage),            // Limit for bandwidth
  ];

  // Add category filter if specified
  if (category && category !== 'all') {
    constraints.unshift(where('category', '==', category));
  }

  // Add pagination cursor if loading more
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  let snapshot;

  try {
    const q = query(productsRef, ...constraints);
    snapshot = await withTimeout(getDocs(q), 12000, 'Loading products timed out.');
  } catch (error) {
    const firebaseError = error as FirebaseError;

    if (firebaseError.code !== 'failed-precondition' || !category || category === 'all') {
      throw error;
    }

    // Fallback for projects missing the composite index for category + createdAt.
    const fallbackConstraints: any[] = [
      where('category', '==', category),
      limit(APP_CONFIG.pagination.productsPerPage),
    ];

    snapshot = await withTimeout(getDocs(query(productsRef, ...fallbackConstraints)), 12000, 'Loading products timed out.');
  }

  // Convert Firestore documents to our Product type
  const products: Product[] = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Product[];

  // Return the last document for pagination
  const lastDocument = snapshot.docs.length > 0
    ? snapshot.docs[snapshot.docs.length - 1]
    : null;

  return { products, lastDocument };
};

export const getProductsByCategories = async (
  categories: string[],
  limitAmount: number = APP_CONFIG.pagination.productsPerPage
): Promise<Product[]> => {
  // Firestore IN clause only supports up to 10 items per query
  if (categories.length === 0 || categories.length > 10) return [];

  const productsRef = collection(db, APP_CONFIG.collections.products);
  const constraints: any[] = [
    where('category', 'in', categories),
    orderBy('createdAt', 'desc'),
    limit(limitAmount),
  ];

  try {
    const q = query(productsRef, ...constraints);
    const snapshot = await withTimeout(getDocs(q), 12000, 'Loading products timed out.');

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    })) as Product[];
  } catch (error) {
    const firebaseError = error as FirebaseError;
    
    if (firebaseError.code !== 'failed-precondition') {
      throw error;
    }

    // Fallback if the composite index (category + createdAt) doesn't exist yet
    const fallbackConstraints: any[] = [
      where('category', 'in', categories),
      limit(limitAmount),
    ];

    const snapshot = await withTimeout(getDocs(query(productsRef, ...fallbackConstraints)), 12000, 'Loading products timed out.');
    
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    })) as Product[];
  }
};

/**
 * Fetch a single product by its ID.
 * Used in the Product Detail screen.
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  const docRef = doc(db, APP_CONFIG.collections.products, productId);
  const docSnap = await withTimeout(getDoc(docRef), 12000, 'Loading product details timed out.');

  if (!docSnap.exists()) return null;

  return {
    ...docSnap.data(),
    id: docSnap.id,
    createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
  } as Product;
};

/**
 * Add a new product (admin only).
 * Returns the created product with its auto-generated ID.
 */
export const addProduct = async (data: ProductFormData): Promise<Product> => {
  const docRef = await withTimeout(addDoc(collection(db, APP_CONFIG.collections.products), {
    ...data,
    createdAt: serverTimestamp(),  // Server-side timestamp for consistency
  }), 15000, 'Saving product timed out.');

  return {
    ...data,
    id: docRef.id,
    createdAt: new Date(),
  };
};

/**
 * Update an existing product (admin only).
 * Only updates the fields provided in the data object.
 */
export const updateProduct = async (
  productId: string,
  data: Partial<ProductFormData>
): Promise<void> => {
  const docRef = doc(db, APP_CONFIG.collections.products, productId);
  await withTimeout(updateDoc(docRef, data), 15000, 'Updating product timed out.');
};

/**
 * Delete a product (admin only).
 * WARNING: This permanently removes the product from Firestore.
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const docRef = doc(db, APP_CONFIG.collections.products, productId);
  await withTimeout(deleteDoc(docRef), 15000, 'Deleting product timed out.');
};

// ============================================================
// ORDERS
// ============================================================

/**
 * Create a new order.
 * Called when a customer taps "Order via WhatsApp".
 * The order is saved BEFORE the WhatsApp redirect so we don't lose it.
 */
export const createOrder = async (
  userId: string,
  items: OrderItem[],
  total: number,
  userName?: string,
  userPhone?: string
): Promise<Order> => {
  const orderData = {
    userId,
    userName: userName || '',
    userPhone: userPhone || '',
    items,
    total,
    status: 'pending' as OrderStatus,
    createdAt: serverTimestamp(),
  };

  const docRef = await withTimeout(addDoc(collection(db, APP_CONFIG.collections.orders), orderData), 15000, 'Creating order timed out.');

  return {
    ...orderData,
    id: docRef.id,
    createdAt: new Date(),
  };
};

/**
 * Get orders for a specific user (customer view).
 * Shows order history sorted by newest first.
 */
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  let snapshot;

  try {
    const q = query(
      collection(db, APP_CONFIG.collections.orders),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(APP_CONFIG.pagination.ordersPerPage)
    );

    snapshot = await withTimeout(getDocs(q), 12000, 'Loading orders timed out.');
  } catch (error) {
    const firebaseError = error as FirebaseError;

    if (firebaseError.code !== 'failed-precondition') {
      throw error;
    }

    snapshot = await withTimeout(getDocs(
      query(
        collection(db, APP_CONFIG.collections.orders),
        where('userId', '==', userId),
        limit(APP_CONFIG.pagination.ordersPerPage)
      )
    ), 12000, 'Loading orders timed out.');
  }

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Order[];
};

/**
 * Get ALL orders (admin view).
 * Admin can see all orders from all customers.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(
    collection(db, APP_CONFIG.collections.orders),
    orderBy('createdAt', 'desc'),
    limit(50) // Admin can see more orders at once
  );

  const snapshot = await withTimeout(getDocs(q), 12000, 'Loading orders timed out.');

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Order[];
};

/**
 * Update an order's status (admin only).
 * Status flow: 'pending' → 'sent_whatsapp'
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const docRef = doc(db, APP_CONFIG.collections.orders, orderId);
  await withTimeout(updateDoc(docRef, { status }), 15000, 'Updating order status timed out.');
};
