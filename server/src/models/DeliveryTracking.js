import mongoose from 'mongoose';

const deliveryTrackingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    courierName: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
      city: String,
      state: String,
    },
    status: {
      type: String,
      enum: ['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception'],
      default: 'picked_up',
      index: true,
    },
    logs: [
      {
        status: String,
        location: {
          latitude: Number,
          longitude: Number,
          address: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    deliveryAgent: {
      name: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
deliveryTrackingSchema.index({ orderId: 1 });
deliveryTrackingSchema.index({ trackingNumber: 1 });
deliveryTrackingSchema.index({ status: 1 });

const DeliveryTracking = mongoose.model('DeliveryTracking', deliveryTrackingSchema);

export default DeliveryTracking;

