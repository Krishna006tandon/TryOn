import { LayoutGroup, motion } from 'framer-motion';
import './Navbar.css';

const navLinks = [
  { label: 'Hero', href: '#hero' },
  { label: 'Categories', href: '#categories' },
  { label: 'Featured', href: '#featured' },
  { label: 'Trending', href: '#trending' },
  { label: 'Capsule', href: '#capsule' },
];

const Navbar = ({ onShopClick = () => {}, cartCount = 0, onCartClick = () => {} }) => {
  const handleNavClick = (event, href) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="nav-shell">
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

