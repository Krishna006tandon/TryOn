import Order from '../models/Order.js';
import DeliveryTracking from '../models/DeliveryTracking.js';
import { v4 as uuidv4 } from 'uuid';

// Create delivery tracking
export const createDeliveryTracking = async (req, res) => {
  try {
    const { orderId, courierName, trackingNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const tracking = new DeliveryTracking({
      orderId,
      courierName: courierName || 'Standard Courier',
      trackingNumber: trackingNumber || `TRK${uuidv4().substring(0, 8).toUpperCase()}`,
      status: 'picked_up',
      logs: [
        {
          status: 'picked_up',
          location: {
            address: 'Warehouse',
            city: 'Mumbai',
            state: 'Maharashtra',
          },
          description: 'Order picked up from warehouse',
        },
      ],
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    });

    await tracking.save();

    // Update order with tracking reference
    order.deliveryTracking = tracking._id;
    order.status = 'shipped';
    await order.save();

    res.json({
      tracking,
      message: 'Delivery tracking created successfully',
    });
  } catch (error) {
    console.error('Error creating delivery tracking:', error);
    res.status(500).json({ error: 'Failed to create delivery tracking' });
  }
};

// Get delivery tracking by order ID
export const getDeliveryTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    const tracking = await DeliveryTracking.findOne({ orderId })
      .populate('orderId')
      .sort({ 'logs.timestamp': -1 });

    if (!tracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    res.json(tracking);
  } catch (error) {
    console.error('Error getting delivery tracking:', error);
    res.status(500).json({ error: 'Failed to get delivery tracking' });
  }
};

// Get delivery tracking by tracking number
export const getTrackingByNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const tracking = await DeliveryTracking.findOne({ trackingNumber })
      .populate('orderId')
      .sort({ 'logs.timestamp': -1 });

    if (!tracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    res.json(tracking);
  } catch (error) {
    console.error('Error getting tracking:', error);
    res.status(500).json({ error: 'Failed to get tracking' });
  }
};

// Update delivery status (for admin/courier)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { status, location, description } = req.body;

    const tracking = await DeliveryTracking.findById(trackingId);
    if (!tracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    // Add new log entry
    tracking.logs.push({
      status: status || tracking.status,
      location: location || tracking.currentLocation,
      description: description || `Status updated to ${status}`,
      timestamp: new Date(),
    });

    // Update current status and location
    if (status) {
      tracking.status = status;
    }
    if (location) {
      tracking.currentLocation = location;
    }

    // Update delivery date if delivered
    if (status === 'delivered') {
      tracking.actualDelivery = new Date();
      // Update order status
      const order = await Order.findById(tracking.orderId);
      if (order) {
        order.status = 'delivered';
        await order.save();
      }
    }

    await tracking.save();

    res.json({
      tracking,
      message: 'Delivery status updated successfully',
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

// Get all active deliveries
export const getActiveDeliveries = async (req, res) => {
  try {
    const { userId } = req.query;

    const query = {
      status: { $in: ['picked_up', 'in_transit', 'out_for_delivery'] },
    };

    if (userId) {
      const orders = await Order.find({ userId }).select('_id');
      query.orderId = { $in: orders.map((o) => o._id) };
    }

    const deliveries = await DeliveryTracking.find(query)
      .populate('orderId')
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (error) {
    console.error('Error getting active deliveries:', error);
    res.status(500).json({ error: 'Failed to get active deliveries' });
  }
};

