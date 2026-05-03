import JoinRequest from '../models/JoinRequest.js';
import Project from '../models/Project.js';

export const createJoinRequest = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const project = await Project.findById(projectId).select('owner members');

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.owner.equals(userId) || project.members.some((member) => member.equals(userId))) {
      return res.status(400).json({ message: 'User is already a project member.' });
    }

    const existingRequest = await JoinRequest.findOne({ project: projectId, user: userId });

    if (existingRequest) {
      return res.status(409).json({ message: `Join request already ${existingRequest.status}.` });
    }

    const joinRequest = await JoinRequest.create({
      project: projectId,
      user: userId,
    });

    await joinRequest.populate('user', 'name email');
    await joinRequest.populate('project', 'title description status');

    res.status(201).json({
      message: 'Join request created successfully.',
      joinRequest,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Join request already exists.' });
    }

    console.error('Create join request error:', error);
    res.status(500).json({ message: 'Failed to create join request.' });
  }
};

export const getProjectJoinRequests = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const project = await Project.findById(projectId).select('owner');

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!project.owner.equals(userId)) {
      return res.status(403).json({ message: 'Only project owner can view join requests.' });
    }

    const joinRequests = await JoinRequest.find({ project: projectId, status: 'pending' })
      .populate('user', 'name email designation technologies')
      .sort({ createdAt: -1 });

    res.json({ joinRequests });
  } catch (error) {
    console.error('Get project join requests error:', error);
    res.status(500).json({ message: 'Failed to fetch join requests.' });
  }
};

export const getUserJoinRequests = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const joinRequests = await JoinRequest.find({ user: userId })
      .populate('project', 'title description status owner')
      .sort({ createdAt: -1 });

    res.json({ joinRequests });
  } catch (error) {
    console.error('Get user join requests error:', error);
    res.status(500).json({ message: 'Failed to fetch join requests.' });
  }
};

export const approveJoinRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id);

    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found.' });
    }

    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ message: `Join request already ${joinRequest.status}.` });
    }

    const project = await Project.findByIdAndUpdate(
      joinRequest.project,
      { $addToSet: { members: joinRequest.user } },
      { new: true },
    )
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    joinRequest.status = 'approved';
    await joinRequest.save();
    await joinRequest.populate('user', 'name email');

    res.json({
      message: `Join request ${req.params.id} approved.`,
      joinRequest,
      project,
    });
  } catch (error) {
    console.error('Approve join request error:', error);
    res.status(500).json({ message: 'Failed to approve join request.' });
  }
};

export const rejectJoinRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id);

    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found.' });
    }

    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ message: `Join request already ${joinRequest.status}.` });
    }

    joinRequest.status = 'rejected';
    await joinRequest.save();
    await joinRequest.populate('user', 'name email');
    await joinRequest.populate('project', 'title description status');

    res.json({
      message: `Join request ${req.params.id} rejected.`,
      joinRequest,
    });
  } catch (error) {
    console.error('Reject join request error:', error);
    res.status(500).json({ message: 'Failed to reject join request.' });
  }
};
