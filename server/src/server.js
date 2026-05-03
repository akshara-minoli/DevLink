import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load .env from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`API gateway running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start API gateway:', error);
  process.exit(1);
});
