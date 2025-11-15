import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Get all products with pagination, search, and filters
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      minPrice,
      maxPrice,
      inStock,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock !== undefined) {
      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      } else {
        query.stock = { $lte: 0 };
      }
    }

    // Active filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      descriptionHi,
      category,
      categoryName,
      subcategory,
      price,
      originalPrice,
      discount,
      images,
      sizes,
      colors,
      stock,
      tags,
      isActive,
      isFeatured,
    } = req.body;

    // Validate category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const product = new Product({
      name,
      description,
      descriptionHi,
      category,
      categoryName: categoryName || categoryDoc.name,
      subcategory,
      price,
      originalPrice: originalPrice || price,
      discount: discount || 0,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      tags: tags || [],
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
    });

    await product.save();
    const savedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({ message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = req.body;

    // If category is being updated, validate it
    if (updateData.category) {
      const categoryDoc = await Category.findById(updateData.category);
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Category not found' });
      }
      if (!updateData.categoryName) {
        updateData.categoryName = categoryDoc.name;
      }
    }

    Object.assign(product, updateData);
    await product.save();

    const updatedProduct = await Product.findById(product._id).populate('category', 'name slug');
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product statistics
export const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ stock: { $lte: 0 } });
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });

    res.json({
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      featuredProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


