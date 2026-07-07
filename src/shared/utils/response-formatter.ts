import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseFormatter {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any,
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any[],
    code?: string,
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      ...(errors && { errors }),
      ...(code && { code }),
    };
    return res.status(statusCode).json(response);
  }
}
