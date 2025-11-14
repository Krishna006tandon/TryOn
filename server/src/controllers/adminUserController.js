import User from '../models/User.js';

// Get all users with pagination, search, and filters
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      isBlocked,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filters
    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === 'true';
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Exclude admin users from regular list (optional)
    // query.isAdmin = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, isActive, isBlocked, isAdmin } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (isActive !== undefined) user.isActive = isActive;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block/Unblock user
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: await User.findById(user._id).select('-password'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const activeUsers = await User.countDocuments({ isActive: true, isAdmin: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true, isAdmin: false });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
      isAdmin: false,
    });

    res.json({
      totalUsers,
      activeUsers,
      blockedUsers,
      newUsersThisMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

