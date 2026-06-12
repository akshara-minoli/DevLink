import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Missing authorization token.' });
  }

  const token = authorizationHeader.slice('Bearer '.length);

  try {
    request.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired token.' });
  }
}