import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { geminiModels } from '../config/gemini.js';

// Analyze user behavior and generate personalized offers
export const getPersonalizedOffers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's browsing history
    const browsingCategories = user.browsingHistory
      .map((item) => item.category)
      .filter(Boolean);

    // Get user's purchase history
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .limit(10);

    const purchasedCategories = orders.flatMap((order) =>
      order.items.map((item) => item.productId?.category).filter(Boolean)
    );

    // Analyze preferences
    const categoryFrequency = {};
    [...browsingCategories, ...purchasedCategories].forEach((cat) => {
      categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
    });

    const topCategories = Object.entries(categoryFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    // Calculate average spending
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgSpending = orders.length > 0 ? totalSpent / orders.length : 0;

    // Generate discount based on behavior
    let discountPercentage = 0;
    if (orders.length === 0) {
      discountPercentage = 15; // First-time customer
    } else if (orders.length >= 5) {
      discountPercentage = 20; // Loyal customer
    } else if (avgSpending > 500) {
      discountPercentage = 15; // High-value customer
    } else {
      discountPercentage = 10; // Regular customer
    }

    // Get recommended products
    const recommendedProducts = await Product.find({
      category: { $in: topCategories.length > 0 ? topCategories : ['men', 'women'] },
      isActive: true,
    })
      .limit(10)
      .select('name price images category discount originalPrice');

    // Use AI to generate personalized offer message
    const offerPrompt = `Generate a personalized offer message for a customer with:
- Top categories: ${topCategories.join(', ')}
- Total orders: ${orders.length}
- Average spending: $${avgSpending.toFixed(2)}
- Discount: ${discountPercentage}%

Create a friendly, engaging offer message (max 100 words).`;

    let offerMessage = `Special ${discountPercentage}% off on your favorite categories!`;
    try {
      const model = geminiModels.fast;
      const result = await model.generateContent(offerPrompt);
      const response = await result.response;
      offerMessage = response.text();
    } catch (error) {
      console.error('Error generating offer message:', error);
    }

    res.json({
      userId,
      discountPercentage,
      offerMessage,
      recommendedProducts,
      topCategories,
      stats: {
        totalOrders: orders.length,
        totalSpent,
        avgSpending,
      },
    });
  } catch (error) {
    console.error('Error getting personalized offers:', error);
    res.status(500).json({ error: 'Failed to get personalized offers' });
  }
};

// Track browsing behavior
export const trackBrowsing = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to browsing history (limit to last 50 items)
    user.browsingHistory.unshift({
      productId,
      viewedAt: new Date(),
      category: product.category,
    });

    if (user.browsingHistory.length > 50) {
      user.browsingHistory = user.browsingHistory.slice(0, 50);
    }

    await user.save();

    res.json({ message: 'Browsing tracked successfully' });
  } catch (error) {
    console.error('Error tracking browsing:', error);
    res.status(500).json({ error: 'Failed to track browsing' });
  }
};

