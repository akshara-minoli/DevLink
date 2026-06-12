import bcrypt from 'bcryptjs';
import { initDatabase, query } from '../db/db.js';

const adminName = 'Admin';
const adminEmail = 'admin@devlink.lk';
const adminPassword = 'admin@123';
const adminRole = 'admin';

async function seedAdmin() {
  await initDatabase();

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const result = await query(
    `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role,
       updated_at = NOW()
     RETURNING id, name, email, role, created_at, updated_at`,
    [adminName, adminEmail, passwordHash, adminRole],
  );

  const adminUser = result.rows[0];
  console.log(`Seeded admin user: ${adminUser.email} (role: ${adminUser.role})`);
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin user:');
  console.error(error);
  process.exitCode = 1;
});