/**
 * Product type definitions for the Gaming Store app.
 * Maps directly to the Firestore 'products' collection schema.
 */

// Active categories are consoles and games; legacy values remain for Firestore compatibility.
export type ProductCategory =
  | 'consoles'
  | 'games'
  | 'playstation'
  | 'xbox'
  | 'cds'
  | 'accessories';

// Whether a product is new or used (important for a gaming store)
export type ProductCondition = 'new' | 'used';

/**
 * Represents a product document in Firestore.
 * Each product belongs to one category and can have multiple images.
 */
export interface Product {
  id: string;                     // Auto-generated Firestore document ID
  name: string;                   // Product display name
  description: string;            // Detailed description text
  price: number;                  // Price in local currency (XAF/FCFA for Chad)
  category: ProductCategory;      // One of the 4 categories
  condition: ProductCondition;    // 'new' or 'used'
  images: string[];               // Array of Firebase Storage download URLs
  stock: number;                  // Available quantity (0 = out of stock)
  createdAt: Date;                // When the product was added
}

/**
 * Data required to add or update a product (admin use).
 * The 'id' and 'createdAt' are handled server-side.
 */
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  images: string[];
  stock: number;
}

/**
 * Category metadata for display in the UI.
 * Each category has a label, icon, and gradient colors.
 */
export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  icon: string;           // Material icon name
  gradient: [string, string]; // [startColor, endColor] for the card background
}
