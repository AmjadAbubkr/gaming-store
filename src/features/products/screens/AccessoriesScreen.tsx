import { ACCESSORY_CATEGORIES } from '../../../utils/productCategories';
import { ProductCatalogScreen } from '../components/ProductCatalogScreen';

export const AccessoriesScreen = () => {
  return (
    <ProductCatalogScreen
      heroSource={require('../../../../assets/hero-gallery-4.jpg')}
      heroGradient={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.86)']}
      categoryTitleKey="catalog.accessory"
      categorySubtitleKey="catalog.accessorySubtitle"
      emptyTitleKey="catalog.noAccessory"
      emptyBodyKey="catalog.noAccessoryBody"
      categories={ACCESSORY_CATEGORIES}
      priceColorClassName="text-primary"
    />
  );
};
