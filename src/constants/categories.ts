/**
 * Category definitions for the gaming store.
 * These are the 4 main product categories required by the spec.
 */
import { CategoryInfo } from '../types/product';
import { COLORS } from './theme';

/**
 * All available product categories with their display metadata.
 * Used in the CategoriesScreen and filter chips.
 */
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'playstation',
    label: 'PlayStation',
    icon: 'sports_esports',      // Gaming controller icon
    gradient: [COLORS.primary, COLORS.primaryContainer],
  },
  {
    id: 'xbox',
    label: 'Xbox',
    icon: 'gamepad',             // Gamepad icon
    gradient: [COLORS.secondary, COLORS.secondaryContainer],
  },
  {
    id: 'cds',
    label: 'CDs & Games',
    icon: 'album',               // Disc icon
    gradient: [COLORS.tertiary, '#006164'],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    icon: 'headphones',          // Headphones icon
    gradient: [COLORS.primaryDim, COLORS.secondary],
  },
];

/**
 * Filter option for "All" categories (used in the category filter bar).
 */
export const ALL_CATEGORIES_FILTER = {
  id: 'all' as const,
  label: 'All',
};
