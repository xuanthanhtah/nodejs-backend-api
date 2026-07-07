import { Router } from 'express';
import { UserController } from './UserController';
import { validateRequest } from '../../../shared/middleware/validate.middleware';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  userIdParamSchema,
  paginationSchema,
} from '../validator/UserValidator';

export class UserRoutes {
  public router: Router = Router();

  constructor(private readonly userController: UserController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Auth routes
    this.router.post('/register', validateRequest(createUserSchema), this.userController.register);
    this.router.post('/login', validateRequest(loginSchema), this.userController.login);

    // CRUD routes (Protected)
    this.router.use(authMiddleware);

    this.router.get('/', validateRequest(paginationSchema), this.userController.list);
    this.router.get('/:id', validateRequest(userIdParamSchema), this.userController.getById);
    this.router.post('/', validateRequest(createUserSchema), this.userController.create);
    this.router.put('/:id', validateRequest(updateUserSchema), this.userController.update);
    this.router.delete('/:id', validateRequest(userIdParamSchema), this.userController.delete);
  }
}
