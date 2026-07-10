import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger';
import { env } from './config/env';
import { logger } from './infrastructure/logger/winston.logger';
import { globalErrorHandler } from './shared/middleware/error.middleware';
import { requestIdMiddleware } from './shared/middleware/request-id.middleware';
import { createUserRoutes } from './modules/user';
import { prisma } from './infrastructure/database/prisma';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Security
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression() as unknown as express.RequestHandler);

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request ID
    this.app.use(requestIdMiddleware);

    // Logging
    const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
    this.app.use(
      morgan(morganFormat, {
        stream: { write: (message: string) => logger.info(message.trim()) },
      }),
    );

    // Rate Limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use('/api', limiter);
  }

  private initializeRoutes() {
    // Health Check
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'UP', timestamp: new Date() });
    });

    // API Versioning & Routes
    this.app.use('/api/v1/users', createUserRoutes(prisma));
    
    // Auth Routes
    const { createAuthRoutes } = require('./modules/auth/presentation/http/routes/auth.routes');
    this.app.use('/api/auth', createAuthRoutes(prisma));

    // Document Routes
    const { createDocumentRoutes } = require('./modules/document/presentation/http/routes/document.routes');
    this.app.use('/api/documents', createDocumentRoutes(prisma));

    // 404 Route
    this.app.use((req: Request, res: Response, _next: NextFunction) => {
      res.status(404).json({ success: false, message: 'API route not found' });
    });
  }

  private initializeSwagger() {
    this.app.use(
      '/api-docs',
      swaggerUi.serve as unknown as express.RequestHandler[],
      swaggerUi.setup(swaggerDocument) as unknown as express.RequestHandler,
    );
  }

  private initializeErrorHandling() {
    this.app.use(globalErrorHandler);
  }
}
