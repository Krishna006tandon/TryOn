import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from server root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MongoDB connection error: MONGODB_URI is not defined in .env file');
      console.error('Please create a .env file in the server directory with:');
      console.error('MONGODB_URI=mongodb+srv://tryon:tryon@tryon.efzkupn.mongodb.net/');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

