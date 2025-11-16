import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, items = [], total = 0, onClose = () => {}, onRemoveItem = () => {} }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const formattedTotal = `₹${total.toLocaleString('en-IN')}`;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      onClose();
      return;
    }

    if (items.length === 0) return;

    setCheckingOut(true);
    try {
      // Create order
      const orderData = {
        userId: user.id,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name || item.title,
          price: parseFloat(item.price?.replace(/[^0-9.]/g, '') || 0),
          quantity: 1,
          image: item.image || item.primary,
        })),
        subtotal: total,
        total: total,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        status: 'pending',
        shippingAddress: {
          // Default address - should be fetched from user profile
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
        },
      };

      const orderResponse = await api.post('/orders', orderData);
      const order = orderResponse.data;

      // Add order to user details
      const productImages = items.map((item) => item.image || item.primary);
      await api.post(`/user-details/${user.id}/orders`, {
        orderId: order._id,
        productImages,
        total: total,
      });

      // Clear cart
      await api.delete(`/user-details/${user.id}/cart/clear`);

      // Navigate to orders page
      navigate('/orders');
      onClose();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to complete checkout. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

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
              <button
                className="cart-checkout"
                disabled={!items.length || checkingOut}
                onClick={handleCheckout}
              >
                {checkingOut ? 'Processing...' : 'Checkout'}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

