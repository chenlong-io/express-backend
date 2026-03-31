import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const businessCode = err instanceof AppError ? err.businessCode : 500;
  const message = err.message || 'Internal Server Error';

  const response: any = {
    code: businessCode,
    message: message,
    data: null,
  };

  if (process.env.NODE_ENV === 'development') {
    response.data = {
      stack: err.stack,
      error: {
        ...err,
        name: err.name,
        message: err.message,
        // @ts-ignore
        code: err.code,
      },
    };
  }

  if (!(err instanceof AppError)) {
    console.error('意外错误:', err);
  }

  return res.status(statusCode).json(response);
};
