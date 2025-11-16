import mongoose from 'mongoose';

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    orders: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
        productImages: [String], // Array of product image paths
        orderDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
          default: 'pending',
        },
        total: Number,
      },
    ],
    wishlist: [
      {
        productId: String,
        productImage: String,
        productName: String,
        price: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    cart: [
      {
        productId: String,
        productImage: String,
        productName: String,
        price: String,
        quantity: {
          type: Number,
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
userDetailsSchema.index({ 'orders.orderId': 1 });

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

export default UserDetails;

