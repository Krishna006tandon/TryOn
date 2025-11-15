import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

// Import all components that were previously in App.jsx's Routes
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import CartDrawer from './CartDrawer.jsx';
import QuickViewModal from './QuickViewModal.jsx';
import AuraBackground from './AuraBackground.jsx';
import Chatbot from './Chatbot.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Home from '../pages/Home.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import SearchResults from '../pages/SearchResults.jsx';
import AdminLayout from '../pages/admin/AdminLayout.jsx';
import AdminLogin from '../pages/admin/Login.jsx'; // Renamed to avoid conflict
import Dashboard from '../pages/admin/Dashboard.jsx';
import Users from '../pages/admin/Users.jsx';
import Products from '../pages/admin/Products.jsx';
import Categories from '../pages/admin/Categories.jsx';
import Orders from '../pages/admin/Orders.jsx';
import Analytics from '../pages/admin/Analytics.jsx';
import Notifications from '../pages/admin/Notifications.jsx';
import Coupons from '../pages/admin/Coupons.jsx';
import Signup from '../pages/Signup.jsx';
import OtpVerify from '../pages/OtpVerify.jsx';
import UserLogin from '../pages/Login.jsx'; // Renamed to avoid conflict
import Profile from '../pages/Profile.jsx'; // Import Profile component

import { fetchHeroSlides } from '../data/content.js';
import '../i18n/config.js'; // Import i18n configuration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const AuthWrapper = () => {
    const { user, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [heroSlides, setHeroSlides] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    useEffect(() => {
        // Only show modal if not loading, no user, and on the home page
        if (!loading && !user && location.pathname === '/') {
            setShowAuthModal(true);
        } else {
            setShowAuthModal(false);
        }
    }, [loading, user, location.pathname]);

    useEffect(() => {
        let active = true;

        const loadContent = async () => {
            // Use local content directly to ensure images and text are correct
            if (active) {
                setHeroSlides(fetchHeroSlides());
                setIsHydrated(true);
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
        return [];
    }, []);

    const categoryExplore = useCallback(
        (categoryId) => {
            // Navigate to category page
            navigate(`/category/${categoryId}`);
        },
        [navigate],
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
        <>
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
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
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<OtpVerify />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                    path="/search/:query"
                    element={
                        <>
                            <AuraBackground />
                            <Navbar
                                onShopClick={() => navigate('/')}
                                cartCount={cartItems.length}
                                onCartClick={() => setIsCartOpen((prev) => !prev)}
                            />
                            <SearchResults
                                onAddToCart={handleAddToCart}
                                onProductClick={handleProductNavigate}
                            />
                            <Footer />
                            <Chatbot userId={user?.id} />
                            <ThemeToggle />
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
                <Route
                    path="/category/:category"
                    element={
                        <>
                            <AuraBackground />
                            <Navbar
                                onShopClick={() => navigate('/')}
                                cartCount={cartItems.length}
                                onCartClick={() => setIsCartOpen((prev) => !prev)}
                            />
                            <SearchResults
                                onAddToCart={handleAddToCart}
                                onProductClick={handleProductNavigate}
                            />
                            <Footer />
                            <Chatbot userId={user?.id} />
                            <ThemeToggle />
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
                                isHydrated={isHydrated}
                                scrollToSection={scrollToSection}
                                onExploreCategory={categoryExplore}
                                onProductClick={handleProductNavigate}
                                userId={user?.id} // Use user?.id
                            />
                            <Footer />
                            <Chatbot userId={user?.id} />
                            <ThemeToggle />
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
                            <Chatbot userId={user?.id} />
                            <ThemeToggle />
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
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
};

export default AuthWrapper;
