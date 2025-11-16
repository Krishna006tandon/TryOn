import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
          ref: 'Product',
        },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
        image: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    rewardPointsUsed: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'cod', 'wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryTracking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryTracking',
    },
    invoiceUrl: {
      type: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;

