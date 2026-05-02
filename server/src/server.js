import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

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
