import { Request, Response, NextFunction } from 'express';

/**
 * 全局响应格式化中间件
 * 自动拦截 res.json 方法并将返回内容包装为统一格式：
 * {
 *   code: number,    // 业务状态码（默认为 HTTP 状态码）
 *   message: string, // 提示信息
 *   data: any        // 实际数据
 * }
 */
export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 保存原始的 json 方法
  const originalJson = res.json;

  // 重写 json 方法
  res.json = function (data: any) {
    // 如果数据已经符合标准格式（包含 code 和 message 且只有这两个或更多），则不再包装
    // 主要是为了兼容错误处理或其他已经手动包装过的地方
    const isFormatted =
      data && typeof data === 'object' && 'code' in data && 'message' in data;

    if (isFormatted) {
      return originalJson.call(this, data);
    }

    // 统一包装响应
    const formattedResponse = {
      code: res.statusCode || 200,
      message: 'success',
      data: data === undefined ? null : data,
    };

    return originalJson.call(this, formattedResponse);
  };

  next();
};
