import { LayoutGroup, motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import VisualSearch from './VisualSearch.jsx';
import VoiceSearch from './VoiceSearch.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useState } from 'react';
import Drawer from './Drawer.jsx';
import './Navbar.css';

const navLinks = [
  { label: 'Hero', href: '#hero' },
  { label: 'Categories', href: '#categories' },
  { label: 'Featured', href: '#featured' },
  { label: 'Trending', href: '#trending' },
  { label: 'Capsule', href: '#capsule' },
];

const Navbar = ({ onShopClick = () => {}, cartCount = 0, onCartClick = () => {} }) => {
  const { user, logout } = useAuth(); // Use useAuth hook
  const handleNavClick = (event, href) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

