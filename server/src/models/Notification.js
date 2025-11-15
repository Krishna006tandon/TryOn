import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'promotion', 'order_update'],
      default: 'info',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'specific_users', 'category_based'],
      default: 'all',
    },
    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    targetCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    link: {
      type: String,
    },
    image: {
      url: String,
      alt: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ targetAudience: 1, isActive: 1 });
notificationSchema.index({ scheduledAt: 1, expiresAt: 1 });
notificationSchema.index({ 'readBy.userId': 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;


