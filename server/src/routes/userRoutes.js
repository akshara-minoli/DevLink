import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/:id', (req, res) => {
  res.json({ message: `User lookup endpoint ready for ${req.params.id}.` });
});

export default router;
