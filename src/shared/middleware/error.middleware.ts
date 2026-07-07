import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../exceptions/BaseError';
import { ValidationError } from '../exceptions/ApiErrors';
import { ResponseFormatter } from '../utils/response-formatter';
import { logger } from '../../infrastructure/logger/winston.logger';
import { env } from '../../config/env';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`[Error]: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ValidationError) {
    return ResponseFormatter.error(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof BaseError) {
    return ResponseFormatter.error(res, err.message, err.statusCode);
  }

  const isDev = env.NODE_ENV === 'development';
  const message = isDev ? err.message : 'Internal Server Error';
  
  return ResponseFormatter.error(res, message, 500);
};
