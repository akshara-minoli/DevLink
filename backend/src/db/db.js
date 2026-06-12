import { Pool } from 'pg';
import { env } from '../config/env.js';

let pool;

export function hasDatabaseConnection() {
  return Boolean(env.databaseUrl || (env.dbHost && env.dbName && env.dbUser));
}

export function getPool() {
  if (!hasDatabaseConnection()) {
    return null;
  }

  if (!pool) {
    const poolConfig = env.databaseUrl
      ? { connectionString: env.databaseUrl }
      : {
          host: env.dbHost,
          port: env.dbPort,
          database: env.dbName,
          user: env.dbUser,
          password: env.dbPassword,
        };

    pool = new Pool(poolConfig);
  }

  return pool;
}

export async function query(text, values = []) {
  const activePool = getPool();

  if (!activePool) {
    const error = new Error('Database environment variables are not configured.');
    error.status = 503;
    throw error;
  }

  return activePool.query(text, values);
}

export async function verifyDatabaseConnection() {
  const activePool = getPool();

  if (!activePool) {
    return { available: false, reason: 'Database environment variables are not configured' };
  }

  await activePool.query('SELECT 1');
  return { available: true };
}

export async function initDatabase() {
  if (!hasDatabaseConnection()) {
    return;
  }

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'developer',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}