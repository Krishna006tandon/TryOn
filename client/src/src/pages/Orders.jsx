import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import OrderTracking from '../components/OrderTracking';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get(`/user-details/${user.id}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [user, navigate, fetchOrders]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseTracking = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  if (selectedOrder) {
    return (
      <OrderTracking
        order={selectedOrder}
        onClose={handleCloseTracking}
        onOrderUpdate={fetchOrders}
      />
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="orders-empty">
            <p>No orders yet</p>
            <button onClick={() => navigate('/')}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className={`order-card ${order.status === 'cancelled' ? 'cancelled' : ''}`}
                onClick={() => handleOrderClick(order)}
              >
                <div className="order-images">
                  {order.productImages?.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt={`Product ${i + 1}`} />
                  ))}
                  {order.productImages?.length > 3 && (
                    <div className="more-images">+{order.productImages.length - 3}</div>
                  )}
                </div>
                <div className="order-details">
                  <div className="order-header">
                    <h3>
                      Order #{order.orderId?.toString().slice(-8) || `ORD-${idx + 1}`}
                    </h3>
                    <span className={`order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="order-date">
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                  <p className="order-total">Total: ₹{order.total?.toLocaleString('en-IN') || '0'}</p>
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      className="cancel-order-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Cancel order will be handled in OrderTracking
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

