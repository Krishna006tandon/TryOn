import { LayoutGroup, motion } from 'framer-motion';
import './Navbar.css';

const navLinks = ['Women', 'Men', 'Kids', 'Editorial', 'Collections'];

const Navbar = () => {
  return (
    <header className="nav-shell">
      <div className="logo">tryon collective</div>
      <LayoutGroup>
        <nav>
          {navLinks.map((link) => (
            <motion.a
              href="#"
              key={link}
              whileHover={{ opacity: 1 }}
              className="nav-link"
            >
              {link}
              <motion.span className="nav-underline" layoutId="nav-underline" />
            </motion.a>
          ))}
        </nav>
      </LayoutGroup>
      <div className="nav-actions">
        <div className="search">
          <input placeholder="Search curated looks" />
        </div>
        <motion.button className="nav-cart" whileTap={{ scale: 0.9 }}>
          Cart
          <motion.span
            className="cart-badge"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            2
          </motion.span>
        </motion.button>
      </div>
    </header>
  );
};

export default Navbar;

