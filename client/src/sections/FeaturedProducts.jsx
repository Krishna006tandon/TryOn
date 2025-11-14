import { motion } from 'framer-motion';
import './FeaturedProducts.css';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const FeaturedProducts = ({ products = [] }) => (
  <section className="featured-shell">
    <div className="section-head">
      <h2>Featured Capsules</h2>
      <button>Shop full edit</button>
    </div>
    <div className="featured-grid">
      {products.map((product, idx) => (
        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={idx}
          className="product-card"
          key={product.id}
        >
          <div className="product-media">
            <img src={product.primary} alt={product.name} className="primary" />
            <img src={product.alternate} alt={`${product.name} alternate`} className="alternate" />
            <span className="product-tag pill">{product.tag}</span>
            <div className="product-actions">
              <button>Quick View</button>
              <button className="ghost">Add to Cart</button>
            </div>
          </div>
          <div className="product-meta">
            <p>{product.name}</p>
            <span>{product.price}</span>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

export default FeaturedProducts;

