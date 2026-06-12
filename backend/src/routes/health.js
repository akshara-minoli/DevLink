import { Router } from 'express';
import { verifyDatabaseConnection } from '../db/db.js';

export const healthRouter = Router();

healthRouter.get('/', async (request, response, next) => {
  try {
    const database = await verifyDatabaseConnection();

    response.json({
      status: 'ok',
      service: 'devlink-api',
      timestamp: new Date().toISOString(),
      database,
    });
  } catch (error) {
    next(error);
  }
});