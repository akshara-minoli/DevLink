import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(currentDir, '..', '..');
const repoRoot = path.resolve(backendRoot, '..');

for (const envPath of [path.join(backendRoot, '.env'), path.join(repoRoot, '.env')]) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

export const env = {
  port: Number(process.env.PORT ?? 5000),
  dbHost: process.env.DB_HOST,
  dbPort,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'devlink-secret',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
};