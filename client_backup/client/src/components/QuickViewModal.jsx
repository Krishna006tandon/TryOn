import { AnimatePresence, motion } from 'framer-motion';
import './QuickViewModal.css';

const QuickViewModal = ({ product, onClose = () => {}, onAddToCart = () => {} }) => {
  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="quickview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="quickview-modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            <button className="quickview-close" onClick={onClose} aria-label="Close quick view">
              ✕
            </button>
            <div className="quickview-grid">
              <img src={product.primary || product.image} alt={product.name || product.title} />
              <div className="quickview-details">
                <p className="quickview-label">{product.tag || 'Curated drop'}</p>
                <h3>{product.name || product.title}</h3>
                {product.subtitle && <p className="quickview-subtitle">{product.subtitle}</p>}
                <p className="quickview-price">{product.price || '$—'}</p>
                <p className="quickview-description">
                  Textured Italian knits, breathable layers, and sculptural tailoring crafted for
                  layered looks all season.
                </p>
                <div className="quickview-actions">
                  <button onClick={onAddToCart}>Add to cart</button>
                  <button className="ghost" onClick={onClose}>
                    Keep browsing
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;

