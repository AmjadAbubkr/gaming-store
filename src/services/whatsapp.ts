/**
 * WhatsApp integration service.
 * 
 * This is the core checkout mechanism for the app.
 * Instead of in-app payments, orders are completed via WhatsApp.
 * 
 * FLOW:
 * 1. User builds cart with products
 * 2. User taps "Order via WhatsApp"
 * 3. Order is saved to Firestore first (so we don't lose it)
 * 4. A formatted message is generated with order details
 * 5. WhatsApp opens with the pre-filled message
 * 6. User sends the message to the store
 * 
 * WHY WhatsApp:
 * - Most popular messaging app in Chad
 * - No need for payment gateway integration
 * - Store owner can negotiate and confirm orders personally
 * - Works well on low bandwidth
 */

import * as Linking from 'expo-linking';
import { OrderItem } from '../types';
import { APP_CONFIG } from '../constants/config';

/**
 * Generate a formatted WhatsApp message from the order details.
 * 
 * The message looks like:
 * ---
 * Hello, I want to order:
 * 
 * 1. DualSense Edge Controller x2 — 39,998 FCFA
 * 2. Cyberpunk 2077 x1 — 5,000 FCFA
 * 
 * Total: 44,998 FCFA
 * 
 * My name: Ahmed
 * My phone: +235 XX XX XX XX
 * ---
 */
export const generateOrderMessage = (
  items: OrderItem[],
  total: number,
  userName: string,
  userPhone: string
): string => {
  // Build the items list
  const itemsList = items
    .map((item, index) => {
      const lineTotal = item.price * item.quantity;
      return `${index + 1}. ${item.productName} x${item.quantity} — ${formatPrice(lineTotal)}`;
    })
    .join('\n');

  // Compose the full message
  const message = `Hello, I want to order:

${itemsList}

Total: ${formatPrice(total)}

My name: ${userName}
My phone: ${userPhone}`;

  return message;
};

/**
 * Open WhatsApp with a pre-filled message.
 * Uses the wa.me deep link format which works on all platforms.
 * 
 * @param message - The pre-filled message text
 * @param phoneNumber - Optional override phone number (defaults to store number)
 */
export const openWhatsApp = async (
  message: string,
  phoneNumber?: string
): Promise<boolean> => {
  const phone = phoneNumber || APP_CONFIG.whatsappNumber;
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  try {
    // Check if the URL can be opened (WhatsApp is installed)
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      throw new Error('WhatsApp is not installed on this device.');
    }

    await Linking.openURL(url);
    return true;
  } catch (error: any) {
    console.error('Failed to open WhatsApp:', error);
    throw new Error(
      'Could not open WhatsApp. Please make sure WhatsApp is installed.'
    );
  }
};

/**
 * Format a price number to a readable string with currency.
 * Uses locale-appropriate formatting for the FCFA currency.
 * 
 * Example: 39998 → "39,998 FCFA"
 */
export const formatPrice = (price: number): string => {
  const formatted = price.toLocaleString('fr-FR'); // French locale for Chad
  return `${formatted} ${APP_CONFIG.currencySymbol}`;
};
