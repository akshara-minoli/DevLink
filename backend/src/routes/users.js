import { Router } from 'express';
import { query } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, async (request, response, next) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

    return response.json({ users: result.rows });
  } catch (error) {
    return next(error);
  }
});