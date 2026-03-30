import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * 认证控制器
 * 处理 HTTP 请求并调用 AuthService。
 */
@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  /**
   * 处理注册请求
   * POST /auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('object :>> ', req.body);
      const { username, password } = req.body;
      await this.authService.register(username, password);
      res.status(201).json({ message: '注册成功' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 处理登录请求
   * POST /auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const data = await this.authService.login(username, password);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 处理修改密码请求
   * POST /auth/change-password
   */
  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = (req as AuthRequest).user!.id;
      await this.authService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: '修改密码成功' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 检查登录状态
   * GET /auth/status
   */
  checkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as AuthRequest).user;
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };
}
