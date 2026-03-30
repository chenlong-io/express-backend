import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
// dev: 仅 4xx 和 5xx 错误才打印
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);

// Health Check
app.post('/health', (req, res) => {
    console.log('object :>> ', req.body);
  res.status(200).json({ status: 'ok' });
});


// 全局错误处理
app.use(errorHandler);

export default app;
