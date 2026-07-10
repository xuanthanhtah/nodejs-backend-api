import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { PrismaUserRepository } from '../../../infrastructure/persistence/repositories/prisma-user.repository';
import { PrismaClient } from '@prisma/client';

export function createUserRoutes(prisma: PrismaClient): Router {
  const router = Router();

  const userRepository = new PrismaUserRepository(prisma);

  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getUserUseCase = new GetUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  const userController = new UserController(
    createUserUseCase,
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  );

  router.post('/', userController.create);
  router.get('/:id', userController.get);
  router.put('/:id', userController.update);
  router.delete('/:id', userController.delete);

  return router;
}
