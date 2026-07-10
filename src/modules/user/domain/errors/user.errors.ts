import { NotFoundError, ConflictError } from '../../../../shared/exceptions/ApiErrors';

export class UserNotFoundError extends NotFoundError {
  constructor(userId: string) {
    super(`User with ID '${userId}' was not found.`);
  }
}

export class UserEmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`User with email '${email}' already exists.`);
  }
}
