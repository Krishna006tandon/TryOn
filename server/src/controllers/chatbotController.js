import { geminiModels } from '../config/gemini.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import DeliveryTracking from '../models/DeliveryTracking.js';

// Build context from user data
const buildUserContext = async (userId) => {
  try {
    const user = await User.findById(userId).populate('purchaseHistory.orderId');
    if (!user) return null;

    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.productId');

    const context = {
      userName: user.name,
      email: user.email,
      recentOrders: recentOrders.map((order) => ({
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        createdAt: order.createdAt,
      })),
      totalOrders: recentOrders.length,
    };

    return context;
  } catch (error) {
    console.error('Error building user context:', error);
    return null;
  }
};

// Fetch order details
const getOrderDetails = async (orderNumber) => {
  try {
    const order = await Order.findOne({ orderNumber })
      .populate('items.productId')
      .populate('deliveryTracking');

    if (!order) return null;

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      items: order.items,
      shippingAddress: order.shippingAddress,
      estimatedDelivery: order.deliveryTracking?.estimatedDelivery,
      trackingNumber: order.deliveryTracking?.trackingNumber,
      currentLocation: order.deliveryTracking?.currentLocation,
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
};

// Fetch product information
const getProductInfo = async (query) => {
  try {
    const products = await Product.find({
      $text: { $search: query },
      isActive: true,
    })
      .limit(5)
      .select('name description price images category stock');

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Chatbot endpoint
export const chatWithBot = async (req, res) => {
  try {
    const { message, userId, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build system prompt with context
    let systemPrompt = `You are a helpful customer support assistant for an online clothing store called "TryOn Collective". 
You can help customers with:
1. Order status and tracking
2. Product information and availability
3. Returns and refunds
4. General inquiries

Be friendly, concise, and helpful. If you need specific information, ask the user for their order number or product name.`;

    // Add user context if available
    if (userId) {
      const userContext = await buildUserContext(userId);
      if (userContext) {
        systemPrompt += `\n\nUser Information:
- Name: ${userContext.userName}
- Email: ${userContext.email}
- Recent Orders: ${JSON.stringify(userContext.recentOrders, null, 2)}`;
      }
    }

    // Check if message contains order number
    const orderNumberMatch = message.match(/order[#\s]*([A-Z0-9]+)/i);
    if (orderNumberMatch) {
      const orderNumber = orderNumberMatch[1];
      const orderDetails = await getOrderDetails(orderNumber);
      if (orderDetails) {
        systemPrompt += `\n\nOrder Details: ${JSON.stringify(orderDetails, null, 2)}`;
      }
    }

    // Check if message is about products
    if (message.toLowerCase().includes('product') || message.toLowerCase().includes('item')) {
      const products = await getProductInfo(message);
      if (products.length > 0) {
        systemPrompt += `\n\nAvailable Products: ${JSON.stringify(products, null, 2)}`;
      }
    }

    // Build conversation history
    const conversationContext = conversationHistory
      .slice(-5) // Last 5 messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationContext}\n\nUser: ${message}\nAssistant:`;

    // Generate response using Gemini
    const model = geminiModels.chat;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const botResponse = response.text();

    res.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chatbot:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};

