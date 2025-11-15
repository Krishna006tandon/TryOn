import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;

    let dateFilter = {};
    let groupFormat = {};

    // Set date range based on period
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter.createdAt = { $gte: weekAgo };
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
    } else if (period === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      dateFilter.createdAt = { $gte: monthAgo };
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
    } else if (period === 'year') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      dateFilter.createdAt = { $gte: yearAgo };
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      };
    }

    // Override with custom date range if provided
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Only count non-cancelled, paid orders
    dateFilter.status = { $ne: 'cancelled' };
    dateFilter.paymentStatus = 'paid';

    // Monthly sales data
    const monthlySales = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          productName: { $first: '$items.name' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    ]);

    // Overall statistics
    const totalRevenue = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const totalOrders = await Order.countDocuments(dateFilter);
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalProducts = await Product.countDocuments({ isActive: true });

    res.json({
      monthlySales: monthlySales.map((item) => ({
        date: period === 'year'
          ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
          : `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        sales: item.totalSales,
        orders: item.orderCount,
      })),
      topProducts: topProducts.map((item) => ({
        productId: item._id,
        name: item.productName || item.product?.name || 'Unknown',
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue,
        image: item.product?.images?.[0]?.url || null,
      })),
      summary: {
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        totalOrders,
        totalUsers,
        totalProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get AI-powered insights (optional, requires Gemini API)
export const getAIInsights = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: 'AI insights not available. Gemini API key not configured.' });
    }

    // Get recent analytics data
    const analytics = await getSalesAnalyticsData();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the following e-commerce sales data and provide insights and recommendations:

Sales Data:
- Total Revenue: $${analytics.summary.totalRevenue}
- Total Orders: ${analytics.summary.totalOrders}
- Total Users: ${analytics.summary.totalUsers}
- Total Products: ${analytics.summary.totalProducts}

Top Products:
${analytics.topProducts.slice(0, 5).map((p, i) => `${i + 1}. ${p.name}: ${p.totalSold} sold, $${p.totalRevenue} revenue`).join('\n')}

Monthly Sales Trend:
${analytics.monthlySales.slice(-6).map((s) => `${s.date}: $${s.sales} (${s.orders} orders)`).join('\n')}

Provide:
1. Key insights about sales performance
2. Recommendations for improving sales
3. Product trends and opportunities
4. Marketing suggestions

Keep the response concise and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get analytics data
async function getSalesAnalyticsData() {
  const dateFilter = {
    status: { $ne: 'cancelled' },
    paymentStatus: 'paid',
    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
  };

  const monthlySales = await Order.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalSales: { $sum: '$total' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: dateFilter },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        productName: { $first: '$items.name' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
  ]);

  const totalRevenue = await Order.aggregate([
    { $match: dateFilter },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const totalOrders = await Order.countDocuments(dateFilter);
  const totalUsers = await User.countDocuments({ isAdmin: false });
  const totalProducts = await Product.countDocuments({ isActive: true });

  return {
    monthlySales: monthlySales.map((item) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      sales: item.totalSales,
      orders: item.orderCount,
    })),
    topProducts,
    summary: {
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalOrders,
      totalUsers,
      totalProducts,
    },
  }
}


