import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/winston.logger';

class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'info' },
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'error' },
        ],
      });

      if (process.env.NODE_ENV === 'development') {
        (Database.instance as any).$on('query', (e: any) => {
          logger.debug(`Query: ${e.query}`);
        });
      }

      (Database.instance as any).$on('error', (e: any) => {
        logger.error(`DB Error: ${e.message}`);
      });
    }

    return Database.instance;
  }
}

export const prisma = Database.getInstance();
