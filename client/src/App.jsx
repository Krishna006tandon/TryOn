import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import QuickViewModal from './components/QuickViewModal.jsx';
import AuraBackground from './components/AuraBackground.jsx';
import Chatbot from './components/Chatbot.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import Products from './pages/admin/Products.jsx';
import Categories from './pages/admin/Categories.jsx';
import Orders from './pages/admin/Orders.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import Notifications from './pages/admin/Notifications.jsx';
import Coupons from './pages/admin/Coupons.jsx';
import { fetchHeroSlides, fetchFeaturedProducts, fetchTrendingOutfits } from './data/content.js';
import './i18n/config.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function App() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingOutfits, setTrendingOutfits] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [userId] = useState(() => {
    // In a real app, get from auth context/localStorage
    return localStorage.getItem('userId') || 'demo-user-123';
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const endpoints = ['hero', 'featured', 'trending'];
        const [hero, featured, trending] = await Promise.all(
          endpoints.map(async (endpoint) => {
            const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
            if (!response.ok) {
              throw new Error(`Failed to load ${endpoint}`);
            }
            return response.json();
          }),
        );

        if (active) {
          setHeroSlides(hero);
          setFeaturedProducts(featured);
          setTrendingOutfits(trending);
        }
      } catch (error) {
        console.warn('Falling back to local seed content', error);
        if (active) {
          setHeroSlides(fetchHeroSlides());
          setFeaturedProducts(fetchFeaturedProducts());
          setTrendingOutfits(fetchTrendingOutfits());
        }
      } finally {
        if (active) {
          setIsHydrated(true);
        }
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  const scrollToSection = useCallback((selector) => {
    if (typeof document === 'undefined') return;
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => [...prev, product]);
    setIsCartOpen(true);
  }, []);

  const handleQuickView = useCallback((product) => {
    setQuickViewProduct(product);
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item, idx) => `${item.id}-${idx}` !== id));
  }, []);

  const cartItemsWithIds = useMemo(
    () => cartItems.map((item, idx) => ({ ...item, _instanceId: `${item.id}-${idx}` })),
    [cartItems],
  );

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const numeric = Number(item.price?.replace(/[^0-9.]/g, '') || 0);
      return sum + (Number.isFinite(numeric) ? numeric : 0);
    }, 0);
  }, [cartItems]);

  const allProducts = useMemo(() => {
    const normalizedFeatured = featuredProducts.map((product) => ({
      ...product,
      name: product.name,
      title: product.name,
      description:
        product.description ||
        'Precision-cut tailoring with performance stretch and seasonless texture.',
    }));

    const normalizedTrending = trendingOutfits.map((item, idx) => ({
      ...item,
      name: item.title,
      id: item.id,
      price: item.price || `$${230 + idx * 10}`,
      primary: item.image,
      alternate: item.image,
      description: 'Curated look from the latest edit, styled with layered essentials.',
    }));

    return [...normalizedFeatured, ...normalizedTrending];
  }, [featuredProducts, trendingOutfits]);

  const categoryExplore = useCallback(
    (categoryId) => {
      if (categoryId === 'kids') {
        scrollToSection('#trending');
        return;
      }
      scrollToSection('#featured');
    },
    [scrollToSection],
  );

  const handleProductNavigate = useCallback(
    (product) => {
      navigate(`/product/${product.id}`);
    },
    [navigate],
  );

  const goToFeatured = useCallback(() => {
    navigate('/');
    setTimeout(() => {
      scrollToSection('#featured');
    }, 150);
  }, [navigate, scrollToSection]);

  return (
    <AuthProvider>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="coupons" element={<Coupons />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <AuraBackground />
              <Navbar
                onShopClick={() => scrollToSection('#featured')}
                cartCount={cartItems.length}
                onCartClick={() => setIsCartOpen((prev) => !prev)}
              />
              <Home
                heroSlides={heroSlides}
                featuredProducts={featuredProducts}
                trendingOutfits={trendingOutfits}
                isHydrated={isHydrated}
                scrollToSection={scrollToSection}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onExploreCategory={categoryExplore}
                onProductClick={handleProductNavigate}
                onTrendingClick={handleProductNavigate}
                userId={userId}
              />
              <Footer />
              <Chatbot userId={userId} />
              <CartDrawer
                isOpen={isCartOpen}
                items={cartItemsWithIds}
                total={cartTotal}
                onClose={() => setIsCartOpen(false)}
                onRemoveItem={handleRemoveFromCart}
              />
              <QuickViewModal
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onAddToCart={() => {
                  if (quickViewProduct) {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }
                }}
              />
            </>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <>
              <AuraBackground />
              <Navbar
                onShopClick={() => scrollToSection('#featured')}
                cartCount={cartItems.length}
                onCartClick={() => setIsCartOpen((prev) => !prev)}
              />
              <ProductDetails
                products={allProducts}
                onAddToCart={handleAddToCart}
                onExploreMore={goToFeatured}
              />
              <Footer />
              <CartDrawer
                isOpen={isCartOpen}
                items={cartItemsWithIds}
                total={cartTotal}
                onClose={() => setIsCartOpen(false)}
                onRemoveItem={handleRemoveFromCart}
              />
            </>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;