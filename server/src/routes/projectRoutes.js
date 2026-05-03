import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getUserProjects,
  getRecommendedProjects,
} from '../controllers/projectController.js';

const router = Router();

router.get('/', listProjects);
router.get('/recommended', requireAuth, getRecommendedProjects);
router.get('/my-projects', requireAuth, getUserProjects);
router.post('/', requireAuth, createProject);
router.get('/:id', getProjectById);
router.patch('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
