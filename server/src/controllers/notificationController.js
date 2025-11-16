import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import User from '../models/User.js';
import DeliveryTracking from '../models/DeliveryTracking.js';

dotenv.config();

// Email transporter
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Twilio client
const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return null;
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const user = order.userId;
    if (!user || !user.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    const transporter = createEmailTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Order Confirmed!</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for your order. Your order has been confirmed and is being processed.</p>
          
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
          
          <h3>Items:</h3>
          <ul>
            ${order.items.map((item) => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
          </ul>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with TryOn Collective!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Order confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

// Send delivery update email
export const sendDeliveryUpdateEmail = async (req, res) => {
  try {
    const { trackingId } = req.body;

    const tracking = await DeliveryTracking.findById(trackingId)
      .populate({
        path: 'orderId',
        populate: { path: 'userId' },
      });

    if (!tracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    const order = tracking.orderId;
    const user = order.userId;

    if (!user || !user.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    const transporter = createEmailTransporter();

    const statusMessages = {
      picked_up: 'Your order has been picked up from our warehouse.',
      in_transit: 'Your order is on the way!',
      out_for_delivery: 'Your order is out for delivery and will arrive soon!',
      delivered: 'Your order has been delivered!',
      exception: 'There was an issue with your delivery. We will contact you soon.',
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Delivery Update - Order ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Delivery Update</h2>
          <p>Dear ${user.name},</p>
          <p>${statusMessages[tracking.status] || 'Your order status has been updated.'}</p>
          
          <h3>Tracking Information:</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${tracking.trackingNumber}</p>
          <p><strong>Status:</strong> ${tracking.status.replace('_', ' ').toUpperCase()}</p>
          ${tracking.currentLocation ? `<p><strong>Current Location:</strong> ${tracking.currentLocation.address || 'In transit'}</p>` : ''}
          ${tracking.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(tracking.estimatedDelivery).toLocaleDateString()}</p>` : ''}
          
          <p>Thank you for shopping with TryOn Collective!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Delivery update email sent successfully' });
  } catch (error) {
    console.error('Error sending delivery update email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

// Send SMS notification
export const sendSMS = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const client = getTwilioClient();
    if (!client) {
      return res.status(500).json({ error: 'SMS service not configured' });
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.json({
      message: 'SMS sent successfully',
      sid: result.sid,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
};

// Send order confirmation SMS
export const sendOrderConfirmationSMS = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const user = order.userId;
    if (!user || !user.phone) {
      return res.status(400).json({ error: 'User phone number not found' });
    }

    const client = getTwilioClient();
    if (!client) {
      return res.status(500).json({ error: 'SMS service not configured' });
    }

    const message = `Hi ${user.name}, your order ${order.orderNumber} has been confirmed! Total: $${order.total.toFixed(2)}. Track at: ${process.env.FRONTEND_URL}/tracking/${order.orderNumber}`;

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });

    res.json({
      message: 'Order confirmation SMS sent successfully',
      sid: result.sid,
    });
  } catch (error) {
    console.error('Error sending order confirmation SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
};

