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
import { userRoutes } from './modules/user';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Security
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression() as any);
    
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
    this.app.use('/api/v1/users', userRoutes.router);

    // 404 Route
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ success: false, message: 'API route not found' });
    });
  }

  private initializeSwagger() {
    this.app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerDocument) as any);
  }

  private initializeErrorHandling() {
    this.app.use(globalErrorHandler);
  }
}
