import { CONSOLE_CATEGORIES } from '../../../utils/productCategories';
import { ProductCatalogScreen } from '../components/ProductCatalogScreen';

export const ConsolesScreen = () => {
  return (
    <ProductCatalogScreen
      heroSource={require('../../../../assets/consoles-hero.png')}
      heroGradient={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.82)']}
      categoryTitleKey="catalog.console"
      categorySubtitleKey="catalog.consoleSubtitle"
      emptyTitleKey="catalog.noConsole"
      emptyBodyKey="catalog.noConsoleBody"
      categories={CONSOLE_CATEGORIES}
      priceColorClassName="text-primary"
    />
  );
};
