const fs = require('fs');
const path = require('path');

const write = (p, content) => {
    fs.writeFileSync(path.join('D:/backend/src/modules/auth', p), content.trim() + '\n', 'utf8');
};

// 1. DTOs
write('presentation/http/requests/auth.requests.ts', `
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
`);

// 2. AuthController
write('presentation/http/controllers/auth.controller.ts', `
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../../../../shared/constants/http-status';
import { ValidationError, UnauthorizedError } from '../../../../../shared/exceptions/ApiErrors';
import { LoginRequestSchema } from '../requests/auth.requests';
import { LoginUseCase } from '../../../user/application/LoginUseCase';
import { GetUserUseCase } from '../../../user/application/use-cases/get-user.use-case';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getUserUseCase: GetUserUseCase
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = LoginRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.errors);
      }

      const result = await this.loginUseCase.execute(parseResult.data);
      res.status(HttpStatusCode.OK).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) throw new UnauthorizedError('Not authenticated');

      const result = await this.getUserUseCase.execute({ id: user.id });
      res.status(HttpStatusCode.OK).json({
        data: {
            user: result
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // For stateless JWT, we just return success
      res.status(HttpStatusCode.OK).json({
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
`);

// 3. Auth Routes
write('presentation/http/routes/auth.routes.ts', `
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginUseCase } from '../../../user/application/LoginUseCase';
import { GetUserUseCase } from '../../../user/application/use-cases/get-user.use-case';
import { PrismaUserRepository } from '../../../user/infrastructure/PrismaUserRepository';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../../../../shared/middleware/auth.middleware';

export function createAuthRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const userRepository = new PrismaUserRepository(prisma);
  const loginUseCase = new LoginUseCase(userRepository);
  const getUserUseCase = new GetUserUseCase(userRepository as any); // Type cast due to two repository structures

  const authController = new AuthController(loginUseCase, getUserUseCase);

  router.post('/login', authController.login);
  router.get('/me', authMiddleware, authController.me);
  router.post('/logout', authMiddleware, authController.logout);

  return router;
}
`);

console.log('Auth module files created');
