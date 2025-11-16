import { useState, useRef, useEffect } from 'react';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import VisualSearch from './VisualSearch.jsx';
import VoiceSearch from './VoiceSearch.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';
import TryOnLogo from '../images/TryOn.png';

import { useState } from 'react';
import Drawer from './Drawer.jsx';
import './Navbar.css';

const navLinks = [
  { label: 'Categories', href: '#categories' },
  { label: 'Trending', href: '#trending' },
];

const searchSuggestions = [
  'Kurta',
  'Lehenga',
  'Tuxedo',
  'Saree',
  'Jeans',
  'Dress',
  'Shirt',
  'Sherwani',
  'Anarkali',
  'T Shirt',
];

const Navbar = ({ onShopClick = () => {}, cartCount = 0, onCartClick = () => {} }) => {
  const { user, logout } = useAuth(); // Use useAuth hook
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchActionsRef = useRef(null);

  // Check if we're on search results page
  const isSearchPage = location.pathname.startsWith('/search') || location.pathname.startsWith('/category');

  const handleNavClick = (event, href) => {
    event.preventDefault();
    // Navigate to home page first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchActionsRef.current &&
        !searchActionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    // Navigate to search results page
    navigate(`/search/${encodeURIComponent(suggestion)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search/${encodeURIComponent(searchValue.trim())}`);
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = searchSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <header className="nav-shell">
      {isSearchPage ? (
        <button className="back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <button className="logo" onClick={onShopClick}>
          <img 
            src={TryOnLogo} 
            alt="TryOn Logo" 
            className="logo-image"
          />
          tryon collective
        </button>
      )}

  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="nav-shell">
      <button className="hamburger" onClick={openDrawer} aria-label="Open menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button className="logo" onClick={onShopClick}>
        tryon collective
      </button>
      <LayoutGroup>
        <nav>
          {navLinks.map((link) => (
            <motion.a
              href={link.href}
              key={link.href}
              whileHover={{ opacity: 1 }}
              className="nav-link"
              onClick={(event) => handleNavClick(event, link.href)}
            >
              {link.label}
              <motion.span className="nav-underline" layoutId="nav-underline" />
            </motion.a>
          ))}
        </nav>
      </LayoutGroup>
      <div className="nav-actions">
        <form className="search" ref={searchRef} onSubmit={handleSearchSubmit}>
          <input
            placeholder="Search curated looks"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={handleSearchFocus}
          />
          <AnimatePresence>
            {showSuggestions && (
              <>
                {filteredSuggestions.length > 0 && (
                  <motion.div
                    ref={suggestionsRef}
                    className="search-suggestions"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        className="search-suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {suggestion}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                <motion.div
                  ref={searchActionsRef}
                  className="search-actions"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <VisualSearch />
                  <VoiceSearch />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LanguageSwitcher />
          {user ? ( // Conditionally render Profile icon and Logout button

        <div className="search">
          <input placeholder="Search curated looks" />
        </div>
        <div className="visual-search">
          <VisualSearch />
        </div>
        <div className="voice-search">
          <VoiceSearch />
        </div>
        <div className="language-switcher">
          <LanguageSwitcher />
        </div>
        <div className="nav-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? ( // Conditionally render Profile link and Logout button
            <>
              <button
                className="profile-icon-btn"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-label="Profile"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <button onClick={logout} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors">
              Login
            </Link>
          )}
        </div>
        {user && (
          <ProfileDropdown
            isOpen={showProfileDropdown}
            onClose={() => setShowProfileDropdown(false)}
          />
        )}
        <motion.button className="nav-cart" whileTap={{ scale: 0.9 }} onClick={onCartClick}>
          Cart
          <motion.span
            className="cart-badge"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {cartCount}
          </motion.span>
        </motion.button>
      </div>
      <Drawer open={drawerOpen} onClose={closeDrawer}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(e, link.href); closeDrawer(); }} style={{ color: '#fff', textDecoration: 'none' }}>{link.label}</a>
          ))}
        </nav>

        <div style={{ marginTop: 20 }}>
          {user ? (
            <>
              <Link to="/profile" onClick={closeDrawer} style={{ display: 'block', color: '#fff', marginBottom: 8 }}>Profile</Link>
              <button onClick={() => { logout(); closeDrawer(); }} style={{ display: 'block', color: '#fff' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={closeDrawer} style={{ display: 'block', color: '#fff' }}>Login</Link>
          )}
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;

