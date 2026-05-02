import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { addUser, findUserByEmail } from '../data/usersStore.js';

const router = Router();

const createToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET || 'devlink-local-secret',
    { expiresIn: '7d' },
  );

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Name, email, password, and confirm password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = findUserByEmail(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  };

  addUser(user);

  return res.status(201).json({
    message: 'Registration successful.',
    token: createToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = findUserByEmail(normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({
    message: 'Login successful.',
    token: createToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export default router;
