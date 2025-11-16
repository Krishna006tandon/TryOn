import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShoppingCart, ChevronDown, ChevronRight, Package, Truck, CheckCircle } from 'lucide-react';

const OrdersPage = () => {
  const [usersWithOrders, setUsersWithOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    fetchOrdersByUsers();
  }, []);

  const fetchOrdersByUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders/by-users');
      setUsersWithOrders(response.data.users || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleStatusUpdate = async (orderId, productId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/products/${productId}/status`, { status });
      // Refresh data
      fetchOrdersByUsers();
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ordered':
        return 'bg-gray-500/20 text-gray-500';
      case 'packed':
        return 'bg-blue-500/20 text-blue-500';
      case 'shipped':
        return 'bg-indigo-500/20 text-indigo-500';
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-500';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted-foreground/20 text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'packed':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manage Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {usersWithOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4" />
              <h3 className="mt-4 text-lg font-medium">No orders found</h3>
              <p className="mt-1 text-sm">New orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {usersWithOrders.map((user) => (
                <div key={user.userId} className="border rounded-lg overflow-hidden">
                  {/* User Header */}
                  <div
                    className="p-4 bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => toggleUser(user.userId.toString())}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedUsers.has(user.userId.toString()) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <div>
                          <h3 className="font-semibold text-foreground">{user.userName}</h3>
                          <p className="text-sm text-muted-foreground">{user.userEmail}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {user.orders.length} order(s)
                      </span>
                    </div>
                  </div>

                  {/* Orders List */}
                  <AnimatePresence>
                    {expandedUsers.has(user.userId.toString()) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          {user.orders.map((order) => (
                            <div key={order.orderId} className="border rounded-lg overflow-hidden">
                              {/* Order Header */}
                              <div
                                className="p-3 bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => toggleOrder(order.orderId.toString())}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {expandedOrders.has(order.orderId.toString()) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <div>
                                      <p className="font-medium text-foreground">
                                        Order #{order.orderNumber}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(order.orderDate).toLocaleDateString()} • Total: ₹
                                        {order.total.toLocaleString('en-IN')}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                              </div>

                              {/* Products List */}
                              <AnimatePresence>
                                {expandedOrders.has(order.orderId.toString()) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 space-y-4 border-t">
                                      {order.items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="p-4 border rounded-lg bg-muted/30"
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                              <h4 className="font-semibold text-foreground mb-1">
                                                {item.name}
                                              </h4>
                                              {item.description && (
                                                <p className="text-sm text-muted-foreground mb-2">
                                                  {item.description}
                                                </p>
                                              )}
                                              <div className="flex items-center gap-4 text-sm">
                                                <span className="text-foreground">
                                                  Price: ₹{item.price.toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-muted-foreground">
                                                  Qty: {item.quantity}
                                                </span>
                                              </div>
                                            </div>
                                            <span
                                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeClass(
                                                item.status
                                              )}`}
                                            >
                                              {getStatusIcon(item.status)}
                                              {item.status}
                                            </span>
                                          </div>

                                          {/* Status Buttons */}
                                          <div className="flex gap-2 mt-3">
                                            {item.status === 'ordered' && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                  handleStatusUpdate(
                                                    order.orderId,
                                                    item.productId,
                                                    'packed'
                                                  )
                                                }
                                                className="flex items-center gap-2"
                                              >
                                                <Package className="h-4 w-4" />
                                                Pack
                                              </Button>
                                            )}
                                            {item.status === 'packed' && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                  handleStatusUpdate(
                                                    order.orderId,
                                                    item.productId,
                                                    'shipped'
                                                  )
                                                }
                                                className="flex items-center gap-2"
                                              >
                                                <Truck className="h-4 w-4" />
                                                Ship
                                              </Button>
                                            )}
                                            {item.status === 'shipped' && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                  handleStatusUpdate(
                                                    order.orderId,
                                                    item.productId,
                                                    'delivered'
                                                  )
                                                }
                                                className="flex items-center gap-2"
                                              >
                                                <CheckCircle className="h-4 w-4" />
                                                Deliver
                                              </Button>
                                            )}
                                            {item.status === 'delivered' && (
                                              <span className="text-sm text-emerald-500 font-medium">
                                                ✓ Delivered
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrdersPage;
