import { useState, useRef, useEffect } from 'react';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import VisualSearch from './VisualSearch.jsx';
import VoiceSearch from './VoiceSearch.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import TryOnLogo from '../images/TryOn_Dark.png';
import './Navbar.css';

const navLinks = [
  { label: 'Categories', href: '#categories' },
  { label: 'Trending', href: '#trending' },
];

const searchSuggestions = [
  'T Shirt',
  'Kurta',
  'Lehenga',
  'Tuxedo',
  'Saree',
  'Jeans',
  'Dress',
  'Shirt',
  'Sherwani',
  'Anarkali',
];

const Navbar = ({ onShopClick = () => {}, cartCount = 0, onCartClick = () => {} }) => {
  const { user, logout } = useAuth(); // Use useAuth hook
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchActionsRef = useRef(null);

  const handleNavClick = (event, href) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      <button className="logo" onClick={onShopClick}>
        <img src={TryOnLogo} alt="TryOn Logo" className="logo-image" />
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
          {user ? ( // Conditionally render Profile link and Logout button
            <>
              <Link to="/profile" className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors">
                Profile
              </Link>
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
    </header>
  );
};

export default Navbar;

