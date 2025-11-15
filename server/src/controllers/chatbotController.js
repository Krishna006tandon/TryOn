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
    let systemPromptContent = `You are a helpful customer support assistant for an online clothing store called "TryOn Collective". 
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
        systemPromptContent += `\n\nUser Information:
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
        systemPromptContent += `\n\nOrder Details: ${JSON.stringify(orderDetails, null, 2)}`;
      }
    }

    // Check if message is about products
    if (message.toLowerCase().includes('product') || message.toLowerCase().includes('item')) {
      const products = await getProductInfo(message);
      if (products.length > 0) {
        systemPromptContent += `\n\nAvailable Products: ${JSON.stringify(products, null, 2)}`;
      }
    }

    // Prepare conversation history for Gemini API
    // Filter out any initial 'model' messages if the history doesn't start with 'user'
    // and ensure roles are 'user'/'model'
    const formattedHistory = [];
    let foundFirstUserMessage = false;
    for (const msg of conversationHistory) {
      const role = msg.role === 'user' ? 'user' : 'model';

      if (!foundFirstUserMessage) {
        if (role === 'user') {
          formattedHistory.push({
            role: 'user',
            parts: [{ text: msg.content }],
          });
          foundFirstUserMessage = true;
        }
        // If the first message encountered is 'model', skip it until a 'user' message is found.
        // This handles cases where the client might send a history that starts with a model message.
      } else {
        formattedHistory.push({
          role: role,
          parts: [{ text: msg.content }],
        });
      }
    }

    let messageForGemini = message;
    let historyForGemini = formattedHistory;

    if (formattedHistory.length === 0) {
      // This is the very first turn of the conversation.
      // The system prompt should be prepended to the current user message.
      messageForGemini = systemPromptContent + '\n\n' + message;
      historyForGemini = []; // No history yet for startChat
    } else {
      // Conversation has already started.
      // The system prompt should have been part of the first user message in the history.
      // We need to ensure it is.
      if (historyForGemini[0].role === 'user' && !historyForGemini[0].parts[0].text.includes(systemPromptContent)) {
        historyForGemini[0].parts[0].text = systemPromptContent + '\n\n' + historyForGemini[0].parts[0].text;
      }
      // The current message is just the user's input.
    }

    // Generate response using Gemini
    const model = geminiModels.chat;
    const chat = model.startChat({ history: historyForGemini });
    const result = await chat.sendMessage(messageForGemini);
    const response = await result.response;
    const botResponse = response.text();

    res.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chatbot:', error.message, error.stack);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

