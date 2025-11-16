import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/user-details/${user.id}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseTracking = () => {
    setSelectedOrder(null);
  };

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Confirmation!\nDo you really want to cancel this order?");
    if (!confirmCancel) return;

    try {
      await api.put(`/cancel-order/${orderId}`); // Your API endpoint
      alert("Order cancelled!");

      // Update local list showing cancelled status
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (error) {
      console.error("Cancel order error:", error);
      alert("Error cancelling order. Please try again.");
    }
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

                  <p className="order-total">
                    Total: ₹{order.total?.toLocaleString('en-IN') || '0'}
                  </p>

                  {/* COD Text */}
                  <p className="purchase-mode">Purchase: Cash on Delivery</p>

                  {/* Cancel Button - THE FIX IS HERE */}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      className="cancel-order-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents card tracking view from opening
                        handleCancelOrder(order.orderId);
                      }}
                    >
                      Cancel Order
                    </button>
                  )}

                  {/* Show "Order cancelled!" text */}
                  {order.status === 'cancelled' && (
                    <p className="cancelled-text">Order cancelled!</p>
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