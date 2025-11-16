import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import api from '../utils/api';

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
import UserOrders from '../pages/Orders.jsx'; // Import User Orders component

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

    // Load cart from database when user logs in
    const fetchCartFromDatabase = useCallback(async () => {
        if (!user) return;
        try {
            const response = await api.get(`/user-details/${user.id}`);
            if (response.data?.cart) {
                // Convert cart items from database format to component format
                const cartItemsFromDB = response.data.cart.map(item => ({
                    id: item.productId,
                    name: item.productName,
                    price: item.price,
                    image: item.productImage,
                    primary: item.productImage,
                    quantity: item.quantity || 1,
                }));
                setCartItems(cartItemsFromDB);
            }
        } catch (error) {
            console.error('Error fetching cart from database:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCartFromDatabase();
        } else {
            setCartItems([]);
        }
    }, [user, fetchCartFromDatabase]);

    useEffect(() => {
        // Don't show modal if:
        // 1. Still loading
        // 2. User is already logged in
        // 3. Not on home page
        // 4. On admin routes
        // 5. On login/signup routes
        const isAdminRoute = location.pathname.startsWith('/admin');
        const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-otp';
        
        if (!loading && !user && location.pathname === '/' && !isAdminRoute && !isAuthRoute) {
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

    const handleAddToCart = useCallback(async (product) => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Update local state immediately for better UX
        setCartItems((prev) => {
            // Check if product already exists in cart
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev; // Don't add duplicates
            }
            return [...prev, product];
        });
        setIsCartOpen(true);

        // Save to database
        try {
            await api.post(`/user-details/${user.id}/cart`, {
                productId: product.id,
                productImage: product.image || product.primary,
                productName: product.name || product.title,
                price: product.price,
                quantity: 1,
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Revert local state on error
            setCartItems((prev) => prev.filter(item => item.id !== product.id));
            alert('Failed to add item to cart. Please try again.');
        }
    }, [user, navigate]);

    const handleQuickView = useCallback((product) => {
        setQuickViewProduct(product);
    }, []);

    const cartItemsWithIds = useMemo(
        () => cartItems.map((item, idx) => ({ ...item, _instanceId: `${item.id}-${idx}` })),
        [cartItems],
    );

    const handleRemoveFromCart = useCallback(async (id) => {
        if (!user) return;
        
        // Extract productId from the id (format: "productId-index")
        const productId = id.split('-').slice(0, -1).join('-');
        
        // Update local state immediately
        setCartItems((prev) => prev.filter((item, idx) => `${item.id}-${idx}` !== id));

        // Remove from database
        try {
            await api.delete(`/user-details/${user.id}/cart`, {
                data: { productId },
            });
        } catch (error) {
            console.error('Error removing from cart:', error);
            // Reload cart from database on error
            if (user) {
                const response = await api.get(`/user-details/${user.id}`);
                if (response.data?.cart) {
                    const cartItemsFromDB = response.data.cart.map(item => ({
                        id: item.productId,
                        name: item.productName,
                        price: item.price,
                        image: item.productImage,
                        primary: item.productImage,
                        quantity: item.quantity || 1,
                    }));
                    setCartItems(cartItemsFromDB);
                }
            }
            alert('Failed to remove item from cart. Please try again.');
        }
    }, [user]);

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
                    path="/orders"
                    element={
                        <>
                            <AuraBackground />
                            <Navbar
                                onShopClick={() => navigate('/')}
                                cartCount={cartItems.length}
                                onCartClick={() => setIsCartOpen((prev) => !prev)}
                            />
                            <UserOrders />
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
