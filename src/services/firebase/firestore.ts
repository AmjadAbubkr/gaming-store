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
  QueryConstraint,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { getFirebaseServices } from './config';
import { Product, ProductFormData, Order, OrderItem, OrderStatus } from '../../types';
import { APP_CONFIG } from '../../constants/config';
import { withTimeout } from '../../utils/withTimeout';
import { normalizeProductImages } from '../../utils/productImages';

const normalizeProductCategory = (category: unknown): Product['category'] => {
  switch (category) {
    case 'playstation':
    case 'xbox':
    case 'consoles':
      return 'consoles';
    case 'cds':
    case 'games':
      return 'games';
    case 'accessories':
      return 'accessories';
    default:
      return 'games';
  }
};

const toDate = (value: unknown) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return new Date();
};

const mapProduct = (snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): Product => {
  const data = snapshot.data() ?? {};

  return {
    id: snapshot.id,
    name: typeof data.name === 'string' ? data.name : '',
    description: typeof data.description === 'string' ? data.description : '',
    price: typeof data.price === 'number' ? data.price : 0,
    stock: typeof data.stock === 'number' ? data.stock : 0,
    condition: data.condition === 'used' ? 'used' : 'new',
    category: normalizeProductCategory(data.category),
    images: normalizeProductImages(data.images),
    createdAt: toDate(data.createdAt),
  };
};

const mapOrder = (snapshot: QueryDocumentSnapshot<DocumentData>): Order => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    userId: typeof data.userId === 'string' ? data.userId : '',
    userName: typeof data.userName === 'string' ? data.userName : '',
    userPhone: typeof data.userPhone === 'string' ? data.userPhone : '',
    items: Array.isArray(data.items) ? (data.items as OrderItem[]) : [],
    total: typeof data.total === 'number' ? data.total : 0,
    status: data.status === 'sent_whatsapp' ? 'sent_whatsapp' : 'pending',
    createdAt: toDate(data.createdAt),
  };
};

const getDocsWithIndexFallback = async (
  collectionRef: ReturnType<typeof collection>,
  constraints: QueryConstraint[],
  timeoutMessage: string,
  fallbackConstraints?: QueryConstraint[]
) => {
  try {
    return await withTimeout(getDocs(query(collectionRef, ...constraints)), 12000, timeoutMessage);
  } catch (error) {
    const firebaseError = error as FirebaseError;

    if (firebaseError.code !== 'failed-precondition' || !fallbackConstraints) {
      throw error;
    }

    return withTimeout(getDocs(query(collectionRef, ...fallbackConstraints)), 12000, timeoutMessage);
  }
};

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
  const { db } = getFirebaseServices();
  const productsRef = collection(db, APP_CONFIG.collections.products);

  const constraints: QueryConstraint[] = [
    orderBy('createdAt', 'desc'),
    limit(APP_CONFIG.pagination.productsPerPage),
  ];

  if (category && category !== 'all') {
    constraints.unshift(where('category', '==', category));
  }

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const fallbackConstraints =
    category && category !== 'all'
      ? [where('category', '==', category), limit(APP_CONFIG.pagination.productsPerPage)]
      : undefined;
  const snapshot = await getDocsWithIndexFallback(
    productsRef,
    constraints,
    'Loading products timed out.',
    fallbackConstraints
  );
  const products = snapshot.docs.map(mapProduct);

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
  if (categories.length === 0 || categories.length > 10) return [];

  const { db } = getFirebaseServices();
  const productsRef = collection(db, APP_CONFIG.collections.products);
  const constraints: QueryConstraint[] = [
    where('category', 'in', categories),
    orderBy('createdAt', 'desc'),
    limit(limitAmount),
  ];
  const fallbackConstraints: QueryConstraint[] = [where('category', 'in', categories), limit(limitAmount)];
  const snapshot = await getDocsWithIndexFallback(
    productsRef,
    constraints,
    'Loading products timed out.',
    fallbackConstraints
  );

  return snapshot.docs.map(mapProduct);
};

/**
 * Fetch a single product by its ID.
 * Used in the Product Detail screen.
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  const { db } = getFirebaseServices();
  const docRef = doc(db, APP_CONFIG.collections.products, productId);
  const docSnap = await withTimeout(getDoc(docRef), 12000, 'Loading product details timed out.');

  if (!docSnap.exists()) return null;

  return mapProduct(docSnap);
};

/**
 * Add a new product (admin only).
 * Returns the created product with its auto-generated ID.
 */
export const addProduct = async (data: ProductFormData): Promise<Product> => {
  const { db } = getFirebaseServices();
  const docRef = await withTimeout(addDoc(collection(db, APP_CONFIG.collections.products), {
    ...data,
    createdAt: serverTimestamp(),  // Server-side timestamp for consistency
  }), 15000, 'Saving product timed out.');

  return {
    ...data,
    id: docRef.id,
    createdAt: new Date(),
    images: normalizeProductImages(data.images),
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
  const { db } = getFirebaseServices();
  const docRef = doc(db, APP_CONFIG.collections.products, productId);
  await withTimeout(updateDoc(docRef, data), 15000, 'Updating product timed out.');
};

/**
 * Delete a product (admin only).
 * WARNING: This permanently removes the product from Firestore.
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const { db } = getFirebaseServices();
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
  const { db } = getFirebaseServices();
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
  const { db } = getFirebaseServices();
  const ordersRef = collection(db, APP_CONFIG.collections.orders);
  const snapshot = await getDocsWithIndexFallback(
    ordersRef,
    [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(APP_CONFIG.pagination.ordersPerPage),
    ],
    'Loading orders timed out.',
    [where('userId', '==', userId), limit(APP_CONFIG.pagination.ordersPerPage)]
  );

  return snapshot.docs.map(mapOrder);
};

/**
 * Get ALL orders (admin view).
 * Admin can see all orders from all customers.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const { db } = getFirebaseServices();
  const q = query(
    collection(db, APP_CONFIG.collections.orders),
    orderBy('createdAt', 'desc'),
    limit(50) // Admin can see more orders at once
  );

  const snapshot = await withTimeout(getDocs(q), 12000, 'Loading orders timed out.');

  return snapshot.docs.map(mapOrder);
};

/**
 * Update an order's status (admin only).
 * Status flow: 'pending' → 'sent_whatsapp'
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const { db } = getFirebaseServices();
  const docRef = doc(db, APP_CONFIG.collections.orders, orderId);
  await withTimeout(updateDoc(docRef, { status }), 15000, 'Updating order status timed out.');
};
