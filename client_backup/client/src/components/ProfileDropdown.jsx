import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import './ProfileDropdown.css';

const ProfileDropdown = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserDetails();
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/user-details/${user.id}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/user-details/${user.id}/wishlist`, {
        data: { productId },
      });
      fetchUserDetails();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleViewOrders = () => {
    navigate('/orders');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="profile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={dropdownRef}
            className="profile-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="profile-header">
              <div className="profile-tabs">
                <button
                  className={activeTab === 'profile' ? 'active' : ''}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={activeTab === 'wishlist' ? 'active' : ''}
                  onClick={() => {
                    setActiveTab('wishlist');
                    if (user) {
                      fetchUserDetails(); // Refresh when switching to wishlist tab
                    }
                  }}
                >
                  Wishlist
                </button>
                <button
                  className={activeTab === 'orders' ? 'active' : ''}
                  onClick={() => setActiveTab('orders')}
                >
                  Orders
                </button>
              </div>
              <button className="profile-close" onClick={onClose}>×</button>
            </div>

            <div className="profile-content">
              {loading ? (
                <div className="profile-loading">Loading...</div>
              ) : (
                <>
                  {activeTab === 'profile' && (
                    <div className="profile-info">
                      <h3>User Information</h3>
                      {userDetails && (
                        <>
                          <p><strong>Username:</strong> {userDetails.username}</p>
                          <p><strong>Email:</strong> {userDetails.email}</p>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === 'wishlist' && (
                    <div className="profile-wishlist">
                      <h3>My Wishlist</h3>
                      {userDetails?.wishlist?.length > 0 ? (
                        <div className="wishlist-items">
                          {userDetails.wishlist.map((item, idx) => (
                            <div key={idx} className="wishlist-item">
                              <img src={item.productImage} alt={item.productName} />
                              <div className="wishlist-item-info">
                                <p>{item.productName}</p>
                                <span>{item.price}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFromWishlist(item.productId)}
                                className="wishlist-remove"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-state">No items in wishlist</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="profile-orders">
                      <h3>My Orders</h3>
                      {userDetails?.orders?.length > 0 ? (
                        <div className="orders-list">
                          {userDetails.orders.slice(0, 5).map((order, idx) => (
                            <div key={idx} className="order-item">
                              <div className="order-images">
                                {order.productImages?.slice(0, 3).map((img, i) => (
                                  <img key={i} src={img} alt={`Product ${i + 1}`} />
                                ))}
                              </div>
                              <div className="order-info">
                                <p>Order #{order.orderId?.toString().slice(-8)}</p>
                                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                <span className={`order-status ${order.status}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                          <button className="view-all-orders" onClick={handleViewOrders}>
                            View All Orders
                          </button>
                        </div>
                      ) : (
                        <p className="empty-state">No orders yet</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;

