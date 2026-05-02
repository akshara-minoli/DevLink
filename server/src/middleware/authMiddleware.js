import jwt from 'jsonwebtoken';
import { findUserById } from '../data/usersStore.js';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Authentication token missing.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devlink-local-secret');
    const user = findUserById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    req.user = { id: user.id, name: user.name, email: user.email };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
