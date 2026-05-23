import { ProductCategory } from '../types/product';

export const CONSOLE_CATEGORIES: ProductCategory[] = ['consoles'];
export const GAME_CATEGORIES: ProductCategory[] = ['games'];
export const ACCESSORY_CATEGORIES: ProductCategory[] = ['accessories'];

export const isConsoleCategory = (category: ProductCategory) => CONSOLE_CATEGORIES.includes(category);
export const isGameCategory = (category: ProductCategory) => GAME_CATEGORIES.includes(category);
export const isAccessoryCategory = (category: ProductCategory) => ACCESSORY_CATEGORIES.includes(category);
