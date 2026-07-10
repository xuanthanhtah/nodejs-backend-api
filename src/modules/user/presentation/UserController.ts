import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../application/CreateUserUseCase';
import { UpdateUserUseCase } from '../application/UpdateUserUseCase';
import { DeleteUserUseCase } from '../application/DeleteUserUseCase';
import { GetUserUseCase, ListUsersUseCase } from '../application/ReadUserUseCases';
import { LoginUseCase } from '../application/LoginUseCase';
import { ResponseFormatter } from '../../../shared/utils/response-formatter';
import { HttpStatusCode } from '../../../shared/constants/http-status';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      return ResponseFormatter.success(
        res,
        user,
        'User registered successfully',
        HttpStatusCode.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData = await this.loginUseCase.execute(req.body);
      return ResponseFormatter.success(res, authData, 'Login successful', HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      return ResponseFormatter.success(
        res,
        user,
        'User created successfully',
        HttpStatusCode.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.updateUserUseCase.execute(id, req.body);
      return ResponseFormatter.success(res, user, 'User updated successfully', HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id);
      return ResponseFormatter.success(res, null, 'User deleted successfully', HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      return ResponseFormatter.success(res, user, 'User retrieved successfully', HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.listUsersUseCase.execute(req.query);
      return ResponseFormatter.success(
        res,
        result.items,
        'Users retrieved successfully',
        HttpStatusCode.OK,
        {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      );
    } catch (error) {
      next(error);
    }
  };
}
