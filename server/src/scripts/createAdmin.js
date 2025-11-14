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
      
      // Hash password if provided
      if (adminPassword) {
        const salt = await bcrypt.genSalt(10);
        existingAdmin.password = await bcrypt.hash(adminPassword, salt);
      }
      
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      // Create new admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
        isBlocked: false,
        isActive: true,
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

