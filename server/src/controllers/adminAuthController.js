import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is admin
    if (!user.isAdmin && user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is inactive. Please contact support.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    res.json({
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current admin user
export const getCurrentAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

