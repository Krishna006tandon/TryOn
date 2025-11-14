import RewardPoint from '../models/RewardPoint.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// Get user's reward points
export const getRewardPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    let rewardPoints = await RewardPoint.findOne({ userId });

    if (!rewardPoints) {
      rewardPoints = new RewardPoint({ userId, points: 0 });
      await rewardPoints.save();
    }

    // Calculate available points (excluding expired)
    const now = new Date();
    const availablePoints = rewardPoints.transactions
      .filter((t) => !t.expiresAt || t.expiresAt > now)
      .filter((t) => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0)
      - rewardPoints.transactions
          .filter((t) => t.type === 'redeemed')
          .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      userId,
      totalPoints: rewardPoints.points,
      availablePoints: Math.max(0, availablePoints),
      totalEarned: rewardPoints.totalEarned,
      totalRedeemed: rewardPoints.totalRedeemed,
      transactions: rewardPoints.transactions.slice(-10).reverse(),
    });
  } catch (error) {
    console.error('Error getting reward points:', error);
    res.status(500).json({ error: 'Failed to get reward points' });
  }
};

// Earn points on purchase
export const earnPoints = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Order not paid yet' });
    }

    // Calculate points (1 point per $1 spent, minimum 10 points)
    const pointsEarned = Math.max(10, Math.floor(order.total));

    let rewardPoints = await RewardPoint.findOne({ userId: order.userId._id });

    if (!rewardPoints) {
      rewardPoints = new RewardPoint({
        userId: order.userId._id,
        points: 0,
        totalEarned: 0,
        totalRedeemed: 0,
      });
    }

    // Add transaction
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Points expire in 1 year

    rewardPoints.transactions.push({
      type: 'earned',
      amount: pointsEarned,
      orderId,
      description: `Earned ${pointsEarned} points for order ${order.orderNumber}`,
      expiresAt,
    });

    rewardPoints.points += pointsEarned;
    rewardPoints.totalEarned += pointsEarned;

    await rewardPoints.save();

    res.json({
      message: `Earned ${pointsEarned} reward points`,
      pointsEarned,
      totalPoints: rewardPoints.points,
    });
  } catch (error) {
    console.error('Error earning points:', error);
    res.status(500).json({ error: 'Failed to earn points' });
  }
};

// Redeem points
export const redeemPoints = async (req, res) => {
  try {
    const { userId, pointsToRedeem } = req.body;

    if (!userId || !pointsToRedeem || pointsToRedeem <= 0) {
      return res.status(400).json({ error: 'Invalid redemption request' });
    }

    let rewardPoints = await RewardPoint.findOne({ userId });

    if (!rewardPoints) {
      return res.status(404).json({ error: 'No reward points found' });
    }

    // Calculate available points
    const now = new Date();
    const availablePoints = rewardPoints.transactions
      .filter((t) => !t.expiresAt || t.expiresAt > now)
      .filter((t) => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0)
      - rewardPoints.transactions
          .filter((t) => t.type === 'redeemed')
          .reduce((sum, t) => sum + t.amount, 0);

    if (pointsToRedeem > availablePoints) {
      return res.status(400).json({
        error: 'Insufficient points',
        availablePoints,
        requested: pointsToRedeem,
      });
    }

    // Add redemption transaction
    rewardPoints.transactions.push({
      type: 'redeemed',
      amount: pointsToRedeem,
      description: `Redeemed ${pointsToRedeem} points`,
    });

    rewardPoints.points = Math.max(0, rewardPoints.points - pointsToRedeem);
    rewardPoints.totalRedeemed += pointsToRedeem;

    await rewardPoints.save();

    // Calculate discount (100 points = $1)
    const discountAmount = pointsToRedeem / 100;

    res.json({
      message: `Redeemed ${pointsToRedeem} points`,
      pointsRedeemed: pointsToRedeem,
      discountAmount,
      remainingPoints: Math.max(0, availablePoints - pointsToRedeem),
    });
  } catch (error) {
    console.error('Error redeeming points:', error);
    res.status(500).json({ error: 'Failed to redeem points' });
  }
};

// Get points history
export const getPointsHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const rewardPoints = await RewardPoint.findOne({ userId });

    if (!rewardPoints) {
      return res.json({ transactions: [] });
    }

    const transactions = rewardPoints.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json({ transactions });
  } catch (error) {
    console.error('Error getting points history:', error);
    res.status(500).json({ error: 'Failed to get points history' });
  }
};

