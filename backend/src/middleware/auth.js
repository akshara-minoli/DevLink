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

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ message: 'Authentication is required.' });
    }

    if (!roles.includes(request.user.role)) {
      return response.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    return next();
  };
}
