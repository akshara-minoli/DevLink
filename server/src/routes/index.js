import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import projectRoutes from './projectRoutes.js';
import joinRequestRoutes from './joinRequestRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/join-requests', joinRequestRoutes);

export default router;
