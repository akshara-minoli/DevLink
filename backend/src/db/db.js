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
    CREATE EXTENSION IF NOT EXISTS citext;

    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email CITEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'developer',
      title TEXT,
      bio TEXT,
      location TEXT,
      avatar_url TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      portfolio_url TEXT,
      profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS phone TEXT,
      ADD COLUMN IF NOT EXISTS title TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS location TEXT,
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS github_url TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
      ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
      ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN NOT NULL DEFAULT FALSE;
  `);

  await query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'join_request_status') THEN
        CREATE TYPE join_request_status AS ENUM ('pending', 'approved', 'rejected');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('planning', 'recruiting', 'active', 'completed', 'paused');
      END IF;
    END
    $$;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS skills (
      id BIGSERIAL PRIMARY KEY,
      name CITEXT NOT NULL UNIQUE,
      category TEXT DEFAULT 'General',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_skills (
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
      level TEXT DEFAULT 'intermediate',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, skill_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id BIGSERIAL PRIMARY KEY,
      owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT DEFAULT 'Web App',
      repository_url TEXT,
      live_url TEXT,
      tech_stack TEXT[] NOT NULL DEFAULT '{}',
      required_skills TEXT[] NOT NULL DEFAULT '{}',
      team_size INTEGER NOT NULL DEFAULT 3,
      status project_status NOT NULL DEFAULT 'recruiting',
      is_public BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Web App',
      ADD COLUMN IF NOT EXISTS live_url TEXT,
      ADD COLUMN IF NOT EXISTS tech_stack TEXT[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS required_skills TEXT[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS team_size INTEGER NOT NULL DEFAULT 3,
      ADD COLUMN IF NOT EXISTS status project_status NOT NULL DEFAULT 'recruiting',
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS project_members (
      project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'member',
      joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (project_id, user_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS join_requests (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      message TEXT,
      status join_request_status NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, project_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS collaboration_requests (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipient_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      requested_skills TEXT[] NOT NULL DEFAULT '{}',
      status join_request_status NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (project_id, recipient_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      link TEXT,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects(owner_id);
    CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
    CREATE INDEX IF NOT EXISTS join_requests_project_id_idx ON join_requests(project_id);
    CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
  `);
}
