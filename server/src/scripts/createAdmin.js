import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Admin details
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tryon.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Update existing admin
      existingAdmin.isAdmin = true;
      existingAdmin.isBlocked = false;
      existingAdmin.isActive = true;
      existingAdmin.role = 'admin';
      existingAdmin.verified = true;
      
      // Set password (will be hashed by pre-save hook)
      // Use set() to ensure mongoose detects the change
      if (adminPassword) {
        existingAdmin.set('password', adminPassword);
      }
      
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`✅ isAdmin: ${existingAdmin.isAdmin}`);
      console.log(`✅ isActive: ${existingAdmin.isActive}`);
      console.log(`✅ isBlocked: ${existingAdmin.isBlocked}`);
    } else {
      // Create new admin (password will be hashed by pre-save hook)
      const admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Will be hashed by pre-save hook
        role: 'admin',
        isAdmin: true,
        isBlocked: false,
        isActive: true,
        verified: true,
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();


