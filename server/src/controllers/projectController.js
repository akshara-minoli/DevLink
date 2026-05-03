import Project from '../models/Project.js';
import User from '../models/User.js';

export const listProjects = async (req, res) => {
  try {
    const { tags, status, search } = req.query;
    const query = {};

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email designation')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ message: 'Failed to list projects.' });
  }
};

export const getRecommendedProjects = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await User.findById(userId).select('technologies');

    if (!user || user.technologies.length === 0) {
      const allProjects = await Project.find()
        .populate('owner', 'name email designation')
        .populate('members', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      return res.json({ projects: allProjects });
    }

    const projects = await Project.find()
      .populate('owner', 'name email designation')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 2);

    const scoredProjects = projects.map((project) => {
      const matchCount = project.tags.filter((tag) => user.technologies.includes(tag)).length;
      const matchPercentage = project.tags.length > 0 ? (matchCount / project.tags.length) * 100 : 0;

      return {
        ...project.toObject(),
        matchPercentage: Math.round(matchPercentage),
      };
    });

    const recommended = scoredProjects
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, parseInt(limit));

    res.json({ projects: recommended });
  } catch (error) {
    console.error('Get recommended projects error:', error);
    res.status(500).json({ message: 'Failed to fetch recommended projects.' });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const ownedProjects = await Project.find({ owner: userId })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    const joinedProjects = await Project.find({ members: userId, owner: { $ne: userId } })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      owned: ownedProjects,
      joined: joinedProjects,
    });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Failed to fetch user projects.' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, tags, repositoryUrl } = req.body;
    const userId = req.user?.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      owner: userId,
      members: [userId],
      tags: tags || [],
      repositoryUrl: repositoryUrl || null,
    });

    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members', 'name email');

    res.status(201).json({
      message: 'Project created successfully.',
      project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Failed to create project.' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email designation')
      .populate('members', 'name email designation');

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, repositoryUrl, status } = req.body;
    const userId = req.user?.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!project.owner.equals(userId)) {
      return res.status(403).json({ message: 'Only project owner can update the project.' });
    }

    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (tags) project.tags = tags;
    if (repositoryUrl) project.repositoryUrl = repositoryUrl;
    if (status) project.status = status;

    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members', 'name email');

    res.json({
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project.' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!project.owner.equals(userId)) {
      return res.status(403).json({ message: 'Only project owner can delete the project.' });
    }

    await Project.findByIdAndDelete(id);

    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project.' });
  }
};
