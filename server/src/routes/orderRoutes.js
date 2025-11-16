import express from 'express';
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

    const order = new Order(orderData);
    await order.save();

    // Populate product details
    await order.populate('items.productId');

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
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

export default router;

