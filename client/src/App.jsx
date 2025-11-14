import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSlider from './sections/HeroSlider.jsx';
import UtilityStrip from './components/UtilityStrip.jsx';
import CategoryTiles from './sections/CategoryTiles.jsx';
import FeaturedProducts from './sections/FeaturedProducts.jsx';
import TrendingOutfits from './sections/TrendingOutfits.jsx';
import CTASection from './sections/CTASection.jsx';
import Footer from './components/Footer.jsx';
import { fetchHeroSlides, fetchFeaturedProducts, fetchTrendingOutfits } from './data/content.js';

function App() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingOutfits, setTrendingOutfits] = useState([]);

  useEffect(() => {
    setHeroSlides(fetchHeroSlides());
    setFeaturedProducts(fetchFeaturedProducts());
    setTrendingOutfits(fetchTrendingOutfits());
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSlider slides={heroSlides} />
        <UtilityStrip />
        <CategoryTiles />
        <FeaturedProducts products={featuredProducts} />
        <TrendingOutfits items={trendingOutfits} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

export default App;

