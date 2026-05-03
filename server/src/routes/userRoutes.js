import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getCurrentUser, getUserById } from '../controllers/userController.js';
import { updateProfile, getProfile } from '../controllers/profileController.js';

const router = Router();

router.get('/me', requireAuth, getCurrentUser);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.get('/:id', getUserById);

export default router;
