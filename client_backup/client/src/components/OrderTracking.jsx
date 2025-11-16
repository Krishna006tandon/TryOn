import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import './OrderTracking.css';

const OrderTracking = ({ order, onClose, onOrderUpdate }) => {
  const { user } = useAuth();
  const [trackingData, setTrackingData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelText, setCancelText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (order?.orderId) {
      fetchTrackingData();
    }
  }, [order]);

  const fetchTrackingData = async () => {
    try {
      // Fetch order details with tracking
      const response = await api.get(`/orders/${order.orderId}`);
      setTrackingData(response.data);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (cancelText.trim() !== 'I want to Cancel the Order') {
      alert('Please type exactly: "I want to Cancel the Order"');
      return;
    }

    try {
      await api.put(`/user-details/${user.id}/orders/${order.orderId}/cancel`);
      setShowCancelModal(false);
      setCancelText('');
      if (onOrderUpdate) {
        onOrderUpdate();
      }
      onClose();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const milestones = [
    {
      key: 'ordered',
      label: 'Ordered',
      date: order?.orderDate,
      completed: true,
    },
    {
      key: 'packed',
      label: 'Packed',
      date: trackingData?.deliveryTracking?.logs?.find(
        (log) => log.status === 'packed'
      )?.timestamp,
      completed: order?.status === 'packed' || 
                 order?.status === 'shipped' || 
                 order?.status === 'out_for_delivery' ||
                 order?.status === 'delivered',
    },
    {
      key: 'shipped',
      label: 'Shipped',
      date: trackingData?.deliveryTracking?.logs?.find(
        (log) => log.status === 'shipped'
      )?.timestamp,
      completed: order?.status === 'shipped' || 
                 order?.status === 'out_for_delivery' ||
                 order?.status === 'delivered',
    },
    {
      key: 'delivery',
      label: 'Out for Delivery',
      date: trackingData?.deliveryTracking?.logs?.find(
        (log) => log.status === 'out_for_delivery'
      )?.timestamp,
      completed: order?.status === 'out_for_delivery' ||
                 order?.status === 'delivered',
    },
  ];

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-loading">Loading order details...</div>
      </div>
    );
  }

  const firstProduct = order?.productImages?.[0] || '';
  const productName = trackingData?.items?.[0]?.name || 'Product';
  const productPrice = trackingData?.total || order?.total || 0;

  return (
    <div className="order-tracking-page">
      <div className="order-tracking-container">
        <button className="order-tracking-back" onClick={onClose}>
          ← Back to Orders
        </button>

        {/* Product Information */}
        <div className="order-product-info">
          <div className="product-details">
            <h2>{productName}</h2>
            <p className="product-color">Color: Black</p>
            <div className="product-price-info">
              <span className="product-price">₹{productPrice.toLocaleString('en-IN')}</span>
              <span className="product-offer">1 offer</span>
            </div>
            <p className="product-quantity">Quantity: 1</p>
          </div>
          <div className="product-image">
            <img src={firstProduct} alt={productName} />
          </div>
        </div>

        {/* Order Tracking Timeline */}
        <div className="order-timeline">
          {milestones.map((milestone, idx) => (
            <div key={milestone.key} className="timeline-item">
              <div className="timeline-indicator">
                <div
                  className={`timeline-circle ${milestone.completed ? 'completed' : 'pending'}`}
                >
                  {milestone.completed ? '✓' : ''}
                </div>
                {idx < milestones.length - 1 && (
                  <div
                    className={`timeline-line ${milestone.completed ? 'completed' : 'pending'}`}
                  />
                )}
              </div>
              <div className="timeline-content">
                <h3 className={milestone.completed ? 'completed' : 'pending'}>
                  {milestone.label}
                </h3>
                {milestone.date ? (
                  <p className="timeline-date">
                    {new Date(milestone.date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </p>
                ) : (
                  <p className="timeline-date">
                    Expected by {new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </p>
                )}
                {milestone.key === 'delivery' && !milestone.completed && (
                  <p className="timeline-note">Shipment yet to be delivered.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="order-actions">
                  {order?.status !== 'cancelled' && order?.status !== 'delivered' && (
                    <button
                      className="cancel-order-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCancelModal(true);
                      }}
                    >
                      Cancel
                    </button>
                  )}
          <button className="help-button">Need help?</button>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Order</h3>
            <p>To confirm cancellation, please type:</p>
            <p className="cancel-verification-text">"I want to Cancel the Order"</p>
            <input
              type="text"
              value={cancelText}
              onChange={(e) => setCancelText(e.target.value)}
              placeholder="Type the text above"
              className="cancel-input"
            />
            <div className="cancel-modal-actions">
              <button
                className="cancel-confirm-btn"
                onClick={handleCancelOrder}
                disabled={cancelText.trim() !== 'I want to Cancel the Order'}
              >
                Confirm Cancel
              </button>
              <button
                className="cancel-cancel-btn"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelText('');
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;

