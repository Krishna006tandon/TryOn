import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const { isActive, type, targetAudience } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (type) {
      query.type = type;
    }
    if (targetAudience) {
      query.targetAudience = targetAudience;
    }

    const notifications = await Notification.find(query)
      .populate('targetUsers', 'name email')
      .populate('targetCategories', 'name slug')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('targetUsers', 'name email')
      .populate('targetCategories', 'name slug')
      .populate('createdBy', 'name email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new notification
export const createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      targetAudience,
      targetUsers,
      targetCategories,
      link,
      image,
      scheduledAt,
      expiresAt,
      isActive,
    } = req.body;

    // Validate target users if specified
    if (targetAudience === 'specific_users' && targetUsers && targetUsers.length > 0) {
      const users = await User.find({ _id: { $in: targetUsers } });
      if (users.length !== targetUsers.length) {
        return res.status(400).json({ message: 'Some target users not found' });
      }
    }

    // Validate target categories if specified
    if (targetAudience === 'category_based' && targetCategories && targetCategories.length > 0) {
      const categories = await Category.find({ _id: { $in: targetCategories } });
      if (categories.length !== targetCategories.length) {
        return res.status(400).json({ message: 'Some target categories not found' });
      }
    }

    const notification = new Notification({
      title,
      message,
      type: type || 'info',
      targetAudience: targetAudience || 'all',
      targetUsers: targetUsers || [],
      targetCategories: targetCategories || [],
      link,
      image,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.userId,
    });

    await notification.save();

    const savedNotification = await Notification.findById(notification._id)
      .populate('targetUsers', 'name email')
      .populate('targetCategories', 'name slug')
      .populate('createdBy', 'name email');

    res.status(201).json({ message: 'Notification created successfully', notification: savedNotification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update notification
export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updateData = req.body;

    // Validate target users if being updated
    if (updateData.targetUsers && updateData.targetUsers.length > 0) {
      const users = await User.find({ _id: { $in: updateData.targetUsers } });
      if (users.length !== updateData.targetUsers.length) {
        return res.status(400).json({ message: 'Some target users not found' });
      }
    }

    // Validate target categories if being updated
    if (updateData.targetCategories && updateData.targetCategories.length > 0) {
      const categories = await Category.find({ _id: { $in: updateData.targetCategories } });
      if (categories.length !== updateData.targetCategories.length) {
        return res.status(400).json({ message: 'Some target categories not found' });
      }
    }

    Object.assign(notification, updateData);
    await notification.save();

    const updatedNotification = await Notification.findById(notification._id)
      .populate('targetUsers', 'name email')
      .populate('targetCategories', 'name slug')
      .populate('createdBy', 'name email');

    res.json({ message: 'Notification updated successfully', notification: updatedNotification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const activeNotifications = await Notification.countDocuments({ isActive: true });
    const scheduledNotifications = await Notification.countDocuments({
      scheduledAt: { $gt: new Date() },
      isActive: true,
    });

    // Get read statistics
    const notifications = await Notification.find({});
    let totalReads = 0;
    notifications.forEach((notif) => {
      totalReads += notif.readBy.length;
    });

    res.json({
      totalNotifications,
      activeNotifications,
      scheduledNotifications,
      totalReads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


