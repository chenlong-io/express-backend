import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import { responseHandler } from './middlewares/responseHandler';
import authRoutes from './modules/auth/auth.module';
import { AppError } from './utils/AppError';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 日志打印，dev: 仅 4xx 和 5xx 错误才打印
app.use(morgan('dev'));

// 全局响应格式化
app.use(responseHandler);

// 路由
app.use('/auth', authRoutes);

// 健康检查
app.post('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 处理 404 未找到路由
app.use((req, res, next) => {
  next(new AppError(`找不到路径: ${req.originalUrl}`, 404));
});

// 全局错误处理(必须在所有路由之后)
app.use(errorHandler);

export default app;
