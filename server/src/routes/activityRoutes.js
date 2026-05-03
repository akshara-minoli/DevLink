import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getUserActivity,
  createActivity,
  getFeedActivity,
} from '../controllers/activityController.js';

const router = Router();

router.get('/', requireAuth, getUserActivity);
router.post('/', createActivity);
router.get('/feed/all', getFeedActivity);

export default router;
