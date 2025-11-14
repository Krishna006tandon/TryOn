import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    browsingHistory: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        viewedAt: { type: Date, default: Date.now },
        category: String,
      },
    ],
    purchaseHistory: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        purchasedAt: { type: Date, default: Date.now },
      },
    ],
    preferences: {
      categories: [String],
      priceRange: {
        min: Number,
        max: Number,
      },
      sizes: [String],
      colors: [String],
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimization
userSchema.index({ email: 1 });
userSchema.index({ 'browsingHistory.productId': 1 });
userSchema.index({ 'purchaseHistory.orderId': 1 });

const User = mongoose.model('User', userSchema);

export default User;

