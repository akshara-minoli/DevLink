import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

function createToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      name: user.name,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: '7d' },
  );
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    title: user.title,
    bio: user.bio,
    location: user.location,
    avatarUrl: user.avatar_url,
    githubUrl: user.github_url,
    linkedinUrl: user.linkedin_url,
    portfolioUrl: user.portfolio_url,
    profileComplete: user.profile_complete,
    createdAt: user.created_at,
  };
}

authRouter.post('/register', async (request, response, next) => {
  const { name, email, phone, password, confirmPassword } = request.body ?? {};

  if (!name || !email || !phone || !password || !confirmPassword) {
    return response.status(400).json({ message: 'Name, phone, email, password, and confirm password are required.' });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

    if (existingUser.rowCount > 0) {
      return response.status(409).json({ message: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const createdUser = await query(
      `INSERT INTO users (name, email, phone, password_hash, role, updated_at)
       VALUES ($1, $2, $3, $4, 'developer', NOW())
       RETURNING id, name, email, phone, role, title, bio, location, avatar_url, github_url, linkedin_url, portfolio_url, profile_complete, created_at`,
      [name.trim(), normalizedEmail, phone.trim(), passwordHash],
    );

    const user = createdUser.rows[0];

    return response.status(201).json({
      user: toPublicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/login', async (request, response, next) => {
  const { email, password } = request.body ?? {};

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    const user = result.rows[0];

    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordsMatch) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    return response.json({
      user: toPublicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.get('/me', requireAuth, async (request, response, next) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, role, title, bio, location, avatar_url, github_url, linkedin_url,
              portfolio_url, profile_complete, created_at
       FROM users
       WHERE id = $1`,
      [request.user.sub],
    );
    const user = result.rows[0];

    if (!user) {
      return response.status(404).json({ message: 'User not found.' });
    }

    return response.json({ user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});
