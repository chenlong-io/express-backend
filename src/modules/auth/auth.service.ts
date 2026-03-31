import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthModel } from './auth.model';
import { AppError } from '@/utils/AppError';

/**
 * 认证服务类
 * 处理所有与用户认证和授权相关的业务逻辑。
 */
@injectable()
export class AuthService {
  constructor(@inject(AuthModel) private userModel: AuthModel) {}

  /**
   * 用户注册
   * @param username 用户名
   * @param password 密码 (明文)
   * @throws AppError 如果用户名已存在
   */
  async register(username: string, password: string): Promise<void> {
    const existingUser = await this.userModel.findByUsername(username);
    if (existingUser) {
      // 使用 HTTP 400 状态码，业务错误码 10001
      throw new AppError('用户名已存在', 400, 10001);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await this.userModel.create({
      username,
      passwordHash,
      role: 'user', // 默认角色为普通用户
    });
  }

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns 包含 Token 和用户信息的对象
   * @throws AppError 如果凭据无效
   */
  async login(
    username: string,
    password: string,
  ): Promise<{
    token: string;
    user: { id: number; username: string; role: string };
  }> {
    const user = await this.userModel.findByUsername(username);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // 签发 JWT Token，有效期 1 天
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { token, user: payload };
  }

  /**
   * 修改密码
   * @param userId 用户 ID
   * @param oldPass 旧密码
   * @param newPass 新密码
   * @throws AppError 如果旧密码错误或用户不存在
   */
  async changePassword(
    userId: number,
    oldPass: string,
    newPass: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid old password', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    await this.userModel.update(userId, { passwordHash });
  }
}
