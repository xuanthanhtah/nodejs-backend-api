import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../../../../shared/constants/http-status';
import { ValidationError, UnauthorizedError } from '../../../../../shared/exceptions/ApiErrors';
import { LoginRequestSchema } from '../requests/auth.requests';
import { LoginUseCase } from '../../../../user/application/LoginUseCase';
import { GetUserUseCase } from '../../../../user/application/use-cases/get-user.use-case';

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
