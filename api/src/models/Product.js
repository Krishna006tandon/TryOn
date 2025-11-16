import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    description: {
      type: String,
      required: true,
    },
    descriptionHi: {
      type: String, // Hindi translation
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    categoryName: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    sizes: [String],
    colors: [String],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [String],
    // AI embedding for similarity search
    embedding: {
      type: [Number],
      index: true,
    },
    // Visual features extracted from images
    visualFeatures: {
      type: mongoose.Schema.Types.Mixed,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimization
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;

