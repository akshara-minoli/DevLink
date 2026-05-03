import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 20, skip = 0, unreadOnly = false } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const query = { user: userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate('relatedUser', 'name email')
      .populate('relatedProject', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: userId, read: false });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, relatedUserId, relatedProjectId, actionUrl } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ message: 'User ID, type, title, and message are required.' });
    }

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedUser: relatedUserId || null,
      relatedProject: relatedProjectId || null,
      actionUrl: actionUrl || null,
    });

    await notification.populate('relatedUser', 'name email');
    await notification.populate('relatedProject', 'title');

    res.status(201).json({
      message: 'Notification created successfully.',
      notification,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Failed to create notification.' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    if (!notification.user.equals(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this notification.' });
    }

    notification.read = true;
    await notification.save();

    res.json({
      message: 'Notification marked as read.',
      notification,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read.' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    await Notification.updateMany({ user: userId, read: false }, { read: true });

    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read.' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    if (!notification.user.equals(userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this notification.' });
    }

    await Notification.findByIdAndDelete(id);

    res.json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification.' });
  }
};
