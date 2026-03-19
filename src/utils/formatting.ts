/**
 * Utility functions for formatting and common operations.
 */

/**
 * Format a date to a human-readable string.
 * Example: "Mar 19, 2026"
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date with time.
 * Example: "Mar 19, 2026 at 9:06 AM"
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Truncate a string to a max length and add ellipsis.
 * Useful for product descriptions in card views.
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
};

/**
 * Validate email format.
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number format (basic).
 * Accepts numbers with optional + prefix and spaces/dashes.
 */
export const isValidPhone = (phone: string): boolean => {
  const regex = /^\+?[\d\s-]{8,15}$/;
  return regex.test(phone);
};
