import { App } from './app';
import { env } from './config/env';
import { logger } from './infrastructure/logger/winston.logger';
import { prisma } from './infrastructure/database/prisma';

const app = new App().app;
const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, shutting down gracefully...');
  server.close(async () => {
    logger.info('Closed out remaining connections.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  // Do not exit on unhandled promise rejections immediately, handle properly
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});
