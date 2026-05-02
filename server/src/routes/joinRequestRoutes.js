import { Router } from 'express';

const router = Router();

router.post('/:projectId', (req, res) => {
  res.status(201).json({ message: `Join request endpoint ready for project ${req.params.projectId}.` });
});

router.patch('/:id/approve', (req, res) => {
  res.json({ message: `Join request ${req.params.id} approved.` });
});

router.patch('/:id/reject', (req, res) => {
  res.json({ message: `Join request ${req.params.id} rejected.` });
});

export default router;
