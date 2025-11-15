import HeroSlider from '../sections/HeroSlider.jsx';
import UtilityStrip from '../components/UtilityStrip.jsx';
import CategoryTiles from '../sections/CategoryTiles.jsx';
import FeaturedProducts from '../sections/FeaturedProducts.jsx';
import TrendingOutfits from '../sections/TrendingOutfits.jsx';
import PersonalizedOffers from '../components/PersonalizedOffers.jsx';

const Home = ({
  heroSlides = [],
  featuredProducts = [],
  trendingOutfits = [],
  isHydrated = false,
  scrollToSection = () => {},
  onAddToCart = () => {},
  onQuickView = () => {},
  onExploreCategory = () => {},
  onProductClick = () => {},
  onTrendingClick = () => {},
  userId,
}) => (
  <main>
    <HeroSlider
      slides={heroSlides}
      isHydrated={isHydrated}
      onPrimaryAction={() => scrollToSection('#featured')}
      onSecondaryAction={() => scrollToSection('#trending')}
    />
    <UtilityStrip />
    <CategoryTiles onExploreCategory={onExploreCategory} />
    <FeaturedProducts
      products={featuredProducts}
      onViewAll={() => scrollToSection('#trending')}
      onAddToCart={onAddToCart}
      onQuickView={onQuickView}
      onProductClick={onProductClick}
    />
    <TrendingOutfits items={trendingOutfits} onTrendClick={onTrendingClick} />
    {userId && (
      <PersonalizedOffers
        userId={userId}
        onProductClick={onProductClick}
      />
    )}
  </main>
);

export default Home;

