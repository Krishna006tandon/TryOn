import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      orderNumber: `ORD${Date.now()}${uuidv4().substring(0, 6).toUpperCase()}`,
    };

    // Convert userId to ObjectId if it's a string
    if (orderData.userId && typeof orderData.userId === 'string') {
      orderData.userId = new mongoose.Types.ObjectId(orderData.userId);
    }

    const order = new Order(orderData);
    await order.save();

    // Try to populate product details (only if productId is ObjectId)
    try {
      await order.populate('items.productId');
    } catch (populateError) {
      // Ignore populate errors if productId is not an ObjectId
      console.log('Could not populate productId (may be string)');
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId')
      .populate('deliveryTracking');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (for admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Update user details order status
    const UserDetails = (await import('../models/UserDetails.js')).default;
    const userDetails = await UserDetails.findOne({ userId: order.userId });
    if (userDetails) {
      const userOrder = userDetails.orders.find(
        (o) => o.orderId && o.orderId.toString() === order._id.toString()
      );
      if (userOrder) {
        userOrder.status = status;
        await userDetails.save();
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;

