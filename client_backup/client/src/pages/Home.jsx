import HeroSlider from '../sections/HeroSlider.jsx';
import UtilityStrip from '../components/UtilityStrip.jsx';
import CategoryTiles from '../sections/CategoryTiles.jsx';
import CategorySection from '../sections/CategorySection.jsx';
import PersonalizedOffers from '../components/PersonalizedOffers.jsx';

const Home = ({
  heroSlides = [],
  isHydrated = false,
  scrollToSection = () => {},
  onExploreCategory = () => {},
  onProductClick = () => {},
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
    <CategorySection onCategoryClick={onExploreCategory} />
    {userId && (
      <PersonalizedOffers
        userId={userId}
        onProductClick={onProductClick}
      />
    )}
  </main>
);

export default Home;

