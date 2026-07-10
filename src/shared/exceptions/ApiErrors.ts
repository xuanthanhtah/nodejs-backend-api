import { BaseError } from './BaseError';
import { HttpStatusCode } from '../constants/http-status';

export class NotFoundError extends BaseError {
  constructor(message: string = 'Resource not found') {
    super(message, HttpStatusCode.NOT_FOUND);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string = 'Bad request') {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}

export class ValidationError extends BaseError {
  public readonly errors: unknown[];
  constructor(message: string = 'Validation error', errors: unknown[] = []) {
    super(message, HttpStatusCode.BAD_REQUEST);
    this.errors = errors;
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatusCode.FORBIDDEN);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = 'Conflict') {
    super(message, HttpStatusCode.CONFLICT);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string = 'Internal server error') {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, false);
  }
}
