/**
 * User type definitions for the Gaming Store app.
 * Maps directly to the Firestore 'users' collection schema.
 */

// The two roles a user can have in the system
export type UserRole = 'admin' | 'customer';

/**
 * Represents a user document in Firestore.
 * - Customers can browse, add to cart, and order via WhatsApp.
 * - Admins can manage products, view orders, and update stock.
 */
export interface User {
  id: string;              // Firebase Auth UID
  name: string;            // Display name
  email: string;           // Email used for authentication
  phone: string;           // Phone number (used in WhatsApp orders)
  role: UserRole;          // Either 'admin' or 'customer'
  fcmToken?: string;       // Firebase Cloud Messaging token for push notifications
  createdAt: Date;         // Account creation timestamp
}

/**
 * Data required to register a new user.
 * The 'id' and 'createdAt' are generated server-side.
 */
export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Data required to login a user.
 */
export interface LoginData {
  email: string;
  password: string;
}
