import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginUseCase } from '../../../../user/application/LoginUseCase';
import { GetUserUseCase } from '../../../../user/application/use-cases/get-user.use-case';
import { PrismaUserRepository } from '../../../../user/infrastructure/PrismaUserRepository';
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
