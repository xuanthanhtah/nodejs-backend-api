import { PrismaClient, Prisma } from '@prisma/client';
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
        (
          Database.instance as PrismaClient<
            Prisma.PrismaClientOptions,
            'query' | 'error' | 'info' | 'warn'
          >
        ).$on('query', (e: Prisma.QueryEvent) => {
          logger.debug(`Query: ${e.query}`);
        });
      }

      (
        Database.instance as PrismaClient<
          Prisma.PrismaClientOptions,
          'query' | 'error' | 'info' | 'warn'
        >
      ).$on('error', (e: Prisma.LogEvent) => {
        logger.error(`DB Error: ${e.message}`);
      });
    }

    return Database.instance;
  }
}

export const prisma = Database.getInstance();
