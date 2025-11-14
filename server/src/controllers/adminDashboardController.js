import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// Get dashboard overview data
export const getDashboardOverview = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments({ isActive: true });

    // Revenue calculations
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Recent orders (last 10)
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber userId items total status paymentStatus createdAt');

    // Trending products (top 5 by sales)
    const trendingProducts = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
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
      { $limit: 5 },
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

    // Sales trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: 'cancelled' },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          sales: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // New users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
      isAdmin: false,
    });

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      stock: { $gt: 0, $lte: 10 },
      isActive: true,
    });

    res.json({
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        newUsersThisMonth,
        lowStockProducts,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.userId?.name || 'Unknown',
          email: order.userId?.email || 'Unknown',
        },
        items: order.items.length,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      })),
      trendingProducts: trendingProducts.map((item) => ({
        productId: item._id,
        name: item.productName || item.product?.name || 'Unknown',
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue,
        image: item.product?.images?.[0]?.url || null,
      })),
      salesTrend: salesTrend.map((item) => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        sales: item.sales,
        orders: item.orders,
      })),
      orderStatusBreakdown: orderStatusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

