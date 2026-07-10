import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../utils/auth-service';
import { UnauthorizedError } from '../exceptions/ApiErrors';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = JwtService.verifyAccessToken(token);

    // Attach user payload to request
    (req as Request & { user?: unknown }).user = decoded;

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
