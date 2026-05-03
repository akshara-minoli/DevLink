import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, designation, workExperience, bio, github, linkedin, technologies } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        designation: designation || null,
        workExperience: workExperience || null,
        bio: bio || null,
        github: github || null,
        linkedin: linkedin || null,
        technologies: technologies || [],
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      message: 'Profile updated successfully.',
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
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await User.findById(userId);

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
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};
