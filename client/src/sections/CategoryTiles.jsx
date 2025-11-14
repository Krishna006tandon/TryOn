import { motion } from 'framer-motion';
import { fetchCategoryTiles } from '../data/content.js';
import './CategoryTiles.css';

const tiles = fetchCategoryTiles();

const hoverMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
};

const CategoryTiles = () => (
  <section className="category-shell">
    {tiles.map((tile) => (
      <motion.div
        key={tile.id}
        className="category-card"
        style={{ '--accent': tile.accent }}
        {...hoverMotion}
      >
        <img src={tile.image} alt={tile.label} />
        <div className="category-overlay" />
        <div className="category-content">
          <p>{tile.label}</p>
          <motion.button whileHover={{ scale: 1.05 }}>Explore</motion.button>
        </div>
      </motion.div>
    ))}
  </section>
);

export default CategoryTiles;

