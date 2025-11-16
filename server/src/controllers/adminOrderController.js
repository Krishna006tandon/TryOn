import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import DeliveryTracking from '../models/DeliveryTracking.js';

// Get all orders grouped by users
export const getOrdersByUsers = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name description price')
      .sort({ createdAt: -1 });

    // Group orders by user
    const usersMap = new Map();
    
    for (const order of orders) {
      if (!order.userId) continue;
      
      const userId = order.userId._id.toString();
      
      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          userId: order.userId._id,
          userName: order.userId.name,
          userEmail: order.userId.email,
          userPhone: order.userId.phone,
          orders: [],
        });
      }
      
      // Get delivery tracking for each product in the order
      const orderWithTracking = {
        orderId: order._id,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        total: order.total,
        status: order.status,
        items: await Promise.all(
          order.items.map(async (item) => {
            const productId = item.productId?._id || item.productId;
            const tracking = await DeliveryTracking.findOne({
              userId: order.userId._id,
              orderId: order._id,
              productId: productId,
            });
            
            return {
              productId: productId,
              name: item.name || item.productId?.name || 'Unknown Product',
              description: item.productId?.description || '',
              price: item.price,
              quantity: item.quantity,
              status: tracking?.status || 'ordered',
              trackingId: tracking?._id,
            };
          })
        ),
      };
      
      usersMap.get(userId).orders.push(orderWithTracking);
    }
    
    const usersWithOrders = Array.from(usersMap.values());
    
    res.json({ users: usersWithOrders });
  } catch (error) {
    console.error('Error fetching orders by users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders with pagination, search, and filters
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      paymentStatus,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Search filter (by order number or user email)
    if (search) {
      query.$or = [{ orderNumber: { $regex: search, $options: 'i' } }];
    }

    // Status filters
    if (status) {
      query.status = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: skip + orders.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone address')
      .populate('items.productId', 'name images price')
      .populate('couponId', 'code discountType discountValue');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product delivery status (Pack, Ship, Deliver)
export const updateProductDeliveryStatus = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { status } = req.body;

    const validStatuses = ['packed', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: packed, shipped, or delivered' });
    }

    // Get order to find userId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find or create delivery tracking for this product
    let tracking = await DeliveryTracking.findOne({
      userId: order.userId,
      orderId: order._id,
      productId: productId,
    });

    if (!tracking) {
      // Create new tracking entry
      tracking = new DeliveryTracking({
        userId: order.userId,
        orderId: order._id,
        productId: productId,
        status: 'ordered',
        logs: [
          {
            status: 'ordered',
            description: 'Order placed',
            timestamp: new Date(),
          },
        ],
      });
    }

    // Update status
    tracking.status = status;
    tracking.logs.push({
      status: status,
      description: `Product ${status}`,
      timestamp: new Date(),
    });

    // Set delivery date if delivered
    if (status === 'delivered') {
      tracking.actualDelivery = new Date();
    }

    await tracking.save();

    res.json({
      message: `Product status updated to ${status}`,
      tracking,
    });
  } catch (error) {
    console.error('Error updating product delivery status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (notes) order.notes = notes;

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name images');

    res.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name images');

    res.json({ message: 'Payment status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const totalOrders = await Order.countDocuments(dateFilter);
    const pendingOrders = await Order.countDocuments({ ...dateFilter, status: 'pending' });
    const shippedOrders = await Order.countDocuments({ ...dateFilter, status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ ...dateFilter, status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ ...dateFilter, status: 'cancelled' });

    // Calculate total revenue
    const revenueData = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
