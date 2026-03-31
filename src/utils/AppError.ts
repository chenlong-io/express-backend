export class AppError extends Error {
  public readonly statusCode: number;
  public readonly businessCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    businessCode?: number,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.businessCode = businessCode || statusCode; // 如果未提供业务码，默认使用 HTTP 状态码
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
