import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();
// 使用 DI 容器解析 Controller 实例
const authController = container.resolve(AuthController);

// 注册
router.post('/register', authController.register); // POST /auth/register

// 登录
router.post('/login', authController.login); // POST /auth/login

// 修改密码
router.post('/change-password', verifyToken, authController.changePassword);

export default router;
