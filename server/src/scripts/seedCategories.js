import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const categories = [
  { name: 'Casual', description: 'Casual wear for everyday comfort' },
  { name: 'Formal', description: 'Formal attire for professional occasions' },
  { name: 'Traditional', description: 'Traditional ethnic wear' },
  { name: 'Party', description: 'Party wear for special occasions' },
  { name: 'Work', description: 'Work wear for office and professional settings' },
  { name: 'Festive', description: 'Festive wear for celebrations' },
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create or update categories
    for (const cat of categories) {
      const slug = cat.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const existingCategory = await Category.findOne({ slug });

      if (existingCategory) {
        // Update existing category
        existingCategory.name = cat.name;
        existingCategory.description = cat.description;
        existingCategory.isActive = true;
        await existingCategory.save();
        console.log(`✅ Updated category: ${cat.name}`);
      } else {
        // Create new category
        const category = new Category({
          name: cat.name,
          slug,
          description: cat.description,
          isActive: true,
          displayOrder: categories.indexOf(cat),
        });
        await category.save();
        console.log(`✅ Created category: ${cat.name}`);
      }
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('✅ Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();

