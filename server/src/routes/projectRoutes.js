import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Project listing endpoint ready.' });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Project creation endpoint ready.' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Project details endpoint ready for ${req.params.id}.` });
});

export default router;
