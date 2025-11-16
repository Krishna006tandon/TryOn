import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const { isActive, parentCategory } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (parentCategory !== undefined) {
      query.parentCategory = parentCategory === 'null' ? null : parentCategory;
    }

    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentCategory', 'name slug');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, parentCategory, isActive, displayOrder } = req.body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Validate parent category if provided
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
    }

    const category = new Category({
      name,
      slug,
      description,
      image,
      parentCategory: parentCategory || null,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    await category.save();
    const savedCategory = await Category.findById(category._id).populate('parentCategory', 'name slug');

    res.status(201).json({ message: 'Category created successfully', category: savedCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, image, parentCategory, isActive, displayOrder } = req.body;

    // If name is being updated, regenerate slug
    if (name && name !== category.name) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if new slug already exists
      const existingCategory = await Category.findOne({ slug, _id: { $ne: category._id } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }

      category.name = name;
      category.slug = slug;
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    // Validate parent category if being updated
    if (parentCategory !== undefined) {
      if (parentCategory && parentCategory !== 'null') {
        const parent = await Category.findById(parentCategory);
        if (!parent) {
          return res.status(400).json({ message: 'Parent category not found' });
        }
        // Prevent circular reference
        if (parentCategory === category._id.toString()) {
          return res.status(400).json({ message: 'Category cannot be its own parent' });
        }
      }
      category.parentCategory = parentCategory === 'null' ? null : parentCategory;
    }

    await category.save();
    const updatedCategory = await Category.findById(category._id).populate('parentCategory', 'name slug');

    res.json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${productCount} product(s) are associated with this category.`,
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parentCategory: category._id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${subcategoryCount} subcategory(ies) exist under this category.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


