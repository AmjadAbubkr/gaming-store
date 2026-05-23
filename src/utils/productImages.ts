const FALLBACK_PRODUCT_IMAGE = 'https://via.placeholder.com/600x600.png?text=No+Image';

export const isEmbeddedProductImage = (uri?: string | null) => {
  return typeof uri === 'string' && uri.startsWith('data:image/');
};

export const isValidProductImageUri = (uri?: string | null): uri is string => {
  return typeof uri === 'string' && uri.trim().length > 0;
};

export const getProductImageUri = (uri?: string | null) => {
  return isValidProductImageUri(uri) ? uri : FALLBACK_PRODUCT_IMAGE;
};

export const normalizeProductImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.filter(isValidProductImageUri);
};
