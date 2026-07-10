import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { CreateUserRequestSchema, UpdateUserRequestSchema } from '../requests/user.requests';
import { HttpStatusCode } from '../../../../../shared/constants/http-status';
import { ValidationError } from '../../../../../shared/exceptions/ApiErrors';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = CreateUserRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.errors);
      }

      const result = await this.createUserUseCase.execute(parseResult.data);
      res.status(HttpStatusCode.CREATED).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getUserUseCase.execute({ id });
      res.status(HttpStatusCode.OK).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const parseResult = UpdateUserRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.errors);
      }

      const result = await this.updateUserUseCase.execute({
        id,
        displayName: parseResult.data.displayName,
        role: parseResult.data.role,
      });

      res.status(HttpStatusCode.OK).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute({ id });
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
}
