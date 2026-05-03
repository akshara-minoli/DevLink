import Activity from '../models/Activity.js';

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 20, skip = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const activities = await Activity.find({ user: userId })
      .populate('user', 'name email designation')
      .populate('project', 'title description')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments({ user: userId });

    res.json({
      activities,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Failed to fetch activity.' });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { userId, type, projectId, description, metadata } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ message: 'User ID and activity type are required.' });
    }

    const activity = await Activity.create({
      user: userId,
      type,
      project: projectId || null,
      description,
      metadata,
    });

    await activity.populate('user', 'name email');
    if (projectId) {
      await activity.populate('project', 'title');
    }

    res.status(201).json({
      message: 'Activity created successfully.',
      activity,
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Failed to create activity.' });
  }
};

export const getFeedActivity = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const activities = await Activity.find()
      .populate('user', 'name email designation')
      .populate('project', 'title description owner')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments();

    res.json({
      activities,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    console.error('Get feed activity error:', error);
    res.status(500).json({ message: 'Failed to fetch feed.' });
  }
};
