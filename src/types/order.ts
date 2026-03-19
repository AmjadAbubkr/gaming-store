/**
 * Order type definitions for the Gaming Store app.
 * Maps directly to the Firestore 'orders' collection schema.
 * 
 * Orders flow:
 * 1. Customer adds items to cart
 * 2. Customer taps "Order via WhatsApp"
 * 3. Order is saved to Firestore with status 'pending'
 * 4. WhatsApp opens with formatted message
 * 5. Status updates to 'sent_whatsapp' after redirect
 */

// Order status lifecycle
export type OrderStatus = 'pending' | 'sent_whatsapp';

/**
 * A single item in an order.
 * We snapshot product name and price in case they change later.
 */
export interface OrderItem {
  productId: string;      // Reference to the product
  productName: string;    // Snapshot of product name at order time
  price: number;          // Snapshot of price at order time
  quantity: number;       // How many of this product
  image?: string;         // First image URL for display
}

/**
 * Represents an order document in Firestore.
 * Created when a customer checks out via WhatsApp.
 */
export interface Order {
  id: string;             // Auto-generated Firestore document ID
  userId: string;         // Reference to the user who placed the order
  userName?: string;      // User's name (for admin display)
  userPhone?: string;     // User's phone (for admin display)
  items: OrderItem[];     // Array of order items
  total: number;          // Total price of all items
  status: OrderStatus;    // Current order status
  createdAt: Date;        // When the order was placed
}
