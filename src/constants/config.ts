/**
 * App-wide configuration constants.
 * 
 * IMPORTANT: Replace the WhatsApp number with the actual store phone number.
 * The phone number must include the country code (e.g., +235 for Chad).
 */

export const APP_CONFIG = {
  // App identity
  appName: 'Cyber-Nexus',
  appTagline: 'Level Up Your Gear',

  // WhatsApp integration — REPLACE with your actual store number
  // Format: country code + number, no spaces or dashes
  // Chad country code is +235
  whatsappNumber: (process.env.EXPO_PUBLIC_WHATSAPP_NUMBER || '+23565032926').replace(/[^\d]/g, ''),
  support: {
    privacyPolicyUrl: 'https://amjadabubkr.github.io/gaming-store/docs/privacy-policy.html',
    accountDeletionUrl: 'https://amjadabubkr.github.io/gaming-store/docs/account-deletion.html',
  },

  // Currency settings for Chad (Central African CFA franc)
  currency: 'FCFA',
  currencySymbol: 'FCFA',

  // Firestore collection names (centralized to avoid typos)
  collections: {
    users: 'users',
    products: 'products',
    orders: 'orders',
  },

  // Pagination limits for Firestore queries (keeps bandwidth low)
  pagination: {
    productsPerPage: 10,
    ordersPerPage: 20,
  },

  // Image upload constraints
  imageUpload: {
    maxWidth: 800,         // Max width in pixels (compress for low bandwidth)
    maxHeight: 800,        // Max height in pixels
    quality: 0.7,          // JPEG quality (0-1, lower = smaller file)
    maxImages: 5,          // Max images per product
  },
} as const;
