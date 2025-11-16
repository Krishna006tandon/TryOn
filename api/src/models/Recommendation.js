import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    recommendedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        similarityScore: Number,
        reason: String,
      },
    ],
    type: {
      type: String,
      enum: ['similarity', 'category', 'collaborative', 'personalized'],
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
recommendationSchema.index({ userId: 1, productId: 1 });
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;

