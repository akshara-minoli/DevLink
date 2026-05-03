import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = Router();

router.get('/', requireAuth, getUserNotifications);
router.post('/', createNotification);
router.patch('/:id/read', requireAuth, markAsRead);
router.patch('/read-all', requireAuth, markAllAsRead);
router.delete('/:id', requireAuth, deleteNotification);

export default router;
