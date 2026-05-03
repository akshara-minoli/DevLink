import User from '../models/User.js';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        workExperience: user.workExperience,
        bio: user.bio,
        github: user.github,
        linkedin: user.linkedin,
        technologies: user.technologies,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Failed to fetch current user.' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        workExperience: user.workExperience,
        bio: user.bio,
        github: user.github,
        linkedin: user.linkedin,
        technologies: user.technologies,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
};

export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Profile deleted successfully.' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Failed to delete profile.' });
  }
};
