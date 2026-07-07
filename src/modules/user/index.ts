import { prisma } from '../../infrastructure/database/prisma';
import { PrismaUserRepository } from './infrastructure/PrismaUserRepository';
import { CreateUserUseCase } from './application/CreateUserUseCase';
import { UpdateUserUseCase } from './application/UpdateUserUseCase';
import { DeleteUserUseCase } from './application/DeleteUserUseCase';
import { GetUserUseCase, ListUsersUseCase } from './application/ReadUserUseCases';
import { LoginUseCase } from './application/LoginUseCase';
import { UserController } from './presentation/UserController';
import { UserRoutes } from './presentation/UserRoutes';

// Dependency Injection setup for the User Module
const userRepository = new PrismaUserRepository(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);

const userController = new UserController(
  createUserUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  getUserUseCase,
  listUsersUseCase,
  loginUseCase,
);

const userRoutes = new UserRoutes(userController);

export { userRoutes };
