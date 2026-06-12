import { createApp } from './app.js';
import { env } from './config/env.js';
import { initDatabase } from './db/db.js';

const app = createApp();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function startServer() {
  try {
    for (let attempt = 1; attempt <= 10; attempt += 1) {
      try {
        await initDatabase();
        break;
      } catch (error) {
        if (attempt === 10) {
          throw error;
        }

        console.warn(`Database not ready yet, retrying (${attempt}/10)...`);
        await sleep(2000);
      }
    }

    app.listen(env.port, () => {
      console.log(`DevLink API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start the API server:', error);
    process.exit(1);
  }
}

startServer();