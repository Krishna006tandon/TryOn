import { motion, AnimatePresence } from 'framer-motion';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, items = [], total = 0, onClose = () => {}, onRemoveItem = () => {} }) => {
  const formattedTotal = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <header className="cart-header">
              <h3>Cart</h3>
              <button onClick={onClose} aria-label="Close cart">
                ✕
              </button>
            </header>
            <div className="cart-body">
              {items.length === 0 ? (
                <p className="cart-empty">No items yet. Explore the edits above.</p>
              ) : (
                items.map((item) => (
                  <div className="cart-item" key={item._instanceId}>
                    <img src={item.primary || item.image} alt={item.name} />
                    <div>
                      <p>{item.name || item.title}</p>
                      <span>{item.price || item.tag}</span>
                    </div>
                    <button
                      className="cart-remove"
                      onClick={() => onRemoveItem(item._instanceId)}
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            <footer className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>{formattedTotal}</strong>
              </div>
              <button className="cart-checkout" disabled={!items.length}>
                Checkout
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

