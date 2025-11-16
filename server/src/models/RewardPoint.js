import mongoose from 'mongoose';

const rewardPointSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ['earned', 'redeemed', 'expired'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
        description: String,
        expiresAt: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalEarned: {
      type: Number,
      default: 0,
    },
    totalRedeemed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
rewardPointSchema.index({ userId: 1 });
rewardPointSchema.index({ 'transactions.expiresAt': 1 });

const RewardPoint = mongoose.model('RewardPoint', rewardPointSchema);

export default RewardPoint;

