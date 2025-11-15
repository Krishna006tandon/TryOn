import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify admin authentication
export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user is admin (you can add an isAdmin field to User model)
    // For now, we'll check if user has admin role or is the first user
    // You should add an isAdmin field to your User schema
    if (!user.isAdmin && user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


