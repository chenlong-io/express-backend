import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

// 扩展 Express Request 接口，添加 user 属性
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: 'admin' | 'user';
  };
}

/**
 * 验证 JWT Token 中间件
 * 检查请求头中的 Authorization 字段，验证 Token 有效性。
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided, authorization denied', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    next(new AppError('Token is not valid', 401));
  }
};

/**
 * 角色验证中间件 (工厂函数)
 * 检查当前用户是否拥有指定角色。
 * @param role 需要的角色 ('admin' | 'user')
 */
export const requireRole = (role: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user) {
      return next(new AppError('Unauthorized', 401));
    }

    // 如果需要 admin 权限，但用户不是 admin，则拒绝
    if (role === 'admin' && user.role !== 'admin') return next(new AppError('Access denied: Admins only', 403));
    next();
  };
};

export const isAdmin = requireRole('admin');
