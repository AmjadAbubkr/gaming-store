import { GAME_CATEGORIES } from '../../../utils/productCategories';
import { ProductCatalogScreen } from '../components/ProductCatalogScreen';

export const GamesScreen = () => {
  return (
    <ProductCatalogScreen
      heroSource={require('../../../../assets/games-hero.png')}
      heroGradient={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.82)']}
      categoryTitleKey="catalog.game"
      categorySubtitleKey="catalog.gameSubtitle"
      emptyTitleKey="catalog.noGame"
      emptyBodyKey="catalog.noGameBody"
      categories={GAME_CATEGORIES}
      priceColorClassName="text-secondary"
    />
  );
};
