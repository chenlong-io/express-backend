import '@/config/env';
import 'reflect-metadata';
import app from '@/app';

const startServer = async () => {
  try {
    const port = process.env.PORT || 3000;
    const env = process.env.NODE_ENV || 'development';
    app.listen(port, () => {
      console.log(`服务器正在运行，端口 ${port}，模式 ${env}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();
