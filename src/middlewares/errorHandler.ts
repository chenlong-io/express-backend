import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('意外错误:', err);

  const response: any = {
    status: 'error',
    message: 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    // Inspect properties safely
    response.error = {
      ...err,
      name: err.name,
      message: err.message,
      // @ts-ignore
      code: err.code,
    };
  }

  return res.status(500).json(response);
};
