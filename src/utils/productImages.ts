export const isEmbeddedProductImage = (uri?: string | null) => {
  return typeof uri === 'string' && uri.startsWith('data:image/');
};
