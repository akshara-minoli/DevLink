import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  createJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  getProjectJoinRequests,
  getUserJoinRequests,
} from '../controllers/joinRequestController.js';

const router = Router();

router.get('/', requireAuth, getUserJoinRequests);
router.get('/project/:projectId', requireAuth, getProjectJoinRequests);
router.post('/:projectId', requireAuth, createJoinRequest);
router.patch('/:id/approve', requireAuth, approveJoinRequest);
router.patch('/:id/reject', requireAuth, rejectJoinRequest);

export default router;
