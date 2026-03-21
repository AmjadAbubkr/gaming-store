import { CategoryInfo } from '../types/product';
import { COLORS } from './theme';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'consoles',
    label: 'Consoles',
    icon: 'sports_esports',
    gradient: [COLORS.primary, COLORS.primaryContainer],
  },
  {
    id: 'games',
    label: 'Games',
    icon: 'stadia-controller',
    gradient: [COLORS.secondary, COLORS.secondaryContainer],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    icon: 'sports-esports',
    gradient: [COLORS.tertiary, COLORS.primary],
  },
];

export const ALL_CATEGORIES_FILTER = {
  id: 'all' as const,
  label: 'All',
};
