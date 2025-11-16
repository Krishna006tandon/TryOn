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

const FeaturedProducts = ({
  products = [],
  onViewAll = () => {},
  onAddToCart = () => {},
  onQuickView = () => {},
  onProductClick = () => {},
}) => (
  <section className="featured-shell" id="featured">
    <div className="section-head">
      <h2>Featured Capsules</h2>
      <button onClick={onViewAll}>Shop full edit</button>
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
          onClick={() => onProductClick(product)}
        >
          <div className="product-media">
            <img src={product.primary} alt={product.name} className="primary" />
            <img src={product.alternate} alt={`${product.name} alternate`} className="alternate" />
            <span className="product-tag pill">{product.tag}</span>
            <div className="product-actions">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onQuickView(product);
                }}
              >
                Quick View
              </button>
              <button
                className="ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  onAddToCart(product);
                }}
              >
                Add to Cart
              </button>
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

