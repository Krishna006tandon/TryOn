import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;
    const query = { isActive: true };

    // Get all active category IDs
    const activeCategories = await Category.find({ isActive: true }).select('_id');
    const activeCategoryIds = activeCategories.map(cat => cat._id);
    
    // Only show products with active categories
    query.category = { $in: activeCategoryIds };

    if (category) {
      // Validate that the requested category is active
      const categoryDoc = await Category.findOne({ _id: category, isActive: true });
      if (categoryDoc) {
        query.category = category;
      } else {
        // Category doesn't exist or is inactive, return empty results
        return res.json({
          products: [],
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        });
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(query)
      .populate('category', 'name slug isActive')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Filter out products with inactive categories (double check)
    const filteredProducts = products.filter(p => p.category && p.category.isActive !== false);

    const total = await Product.countDocuments(query);

    res.json({
      products: filteredProducts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default router;

