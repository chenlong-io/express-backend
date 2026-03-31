# Express Backend Enterprise Template

这是一个基于 Express 5 和 TypeScript 构建的高性能、模块化后端项目模板。它采用了依赖注入（DI）和现代 ORM (Drizzle) 实践，旨在提供一个结构清晰、易于扩展的开发基础。

模板中的 **modules/auth** 模块是示例模块，展示了如何使用依赖注入和 ORM。

## 1. 技术栈介绍

本项目选用了当前 Node.js 生态中兼具稳定与性能的方案：

- **核心框架**: [Express 5.x](https://expressjs.com/) (下一代 Express，支持 Promise 等现代特性)
- **编程语言**: [TypeScript 6.x](https://www.typescriptlang.org/) (强类型支持，极致的开发体验)
- **依赖注入**: [tsyringe](https://github.com/microsoft/tsyringe) (微软出品，支持构造函数注入)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (轻量级、TypeScript 优先且具备数据库原生的性能)
- **路径别名**: `@` 指向 `src` 目录，简化导入路径。
- **环境配置**: `dotenv` 多环境支持（.env / .env.production）。
- **工具链**:
  - `pnpm`: 高效的包管理工具
  - `nodemon` + `ts-node`: 开发环境热重载
  - `tsc-alias`: 处理生产构建后的路径别名替换
  - `pm2`: 生产环境进程管理

## 2. 核心架构设计

项目采用 **“模块化 (Modules) + 依赖注入 (DI)”** 的思维方式开发，核心目标是**高内聚、低耦合**。

### 模块化结构 (Modules)

业务逻辑按功能单元划分为独立的模块（存放于 `src/modules/`）。每个模块内部遵循经典的 **Controller-Service-Model** 三层架构：

- **Controller**: 处理 HTTP 请求参数验证、调用 Service 并返回统一格式的 JSON。
- **Service**: 承载核心业务逻辑，不关注具体的请求/响应协议，可跨 Controller 复用。
- **Model (Repository)**: 封装 Drizzle ORM，直接与数据库交互。

### 依赖注入 (DI)

基于 `tsyringe` 实现，通过 `@injectable()` 装饰器实现自动装配。

- **优势**: 开发者无需手动管理类的实例化顺序，Service 自动注入 Model，Controller 自动注入 Service。
- **可扩展**: 方便进行单元测试和 Mock 数据注入。

**响应规范**:
所有接口均通过 `responseHandler` 中间件自动包装为统一格式：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

## 3. 项目初始化与运行

### 快速开始

1. **安装依赖**:
   ```bash
   pnpm install
   ```
2. **配置环境**:
   - 复制 `.env` 并填写您的 MySQL 数据库连接信息。
   - `DATABASE_URL=mysql://user:pass@host:port/db_name`

### 数据库同步 (Drizzle 工作流)

本项目使用 Drizzle Kit 管理数据库：

- **第一步：定义 Schema**
  在 `src/db/schema.ts` 中定义表结构和字段。
- **第二步：生成迁移文件**
  ```bash
  pnpm db:generate
  ```
  该命令会扫描 schema 并生成对应的 SQL 语句于 `drizzle/` 目录下。
- **第三步：应用到数据库**
  ```bash
  pnpm db:migrate
  ```
  该命令将生成的 SQL 执行于配置的目标数据库。

### 常用命令

- **开发环境**: `pnpm dev`
- **生产构建**: `pnpm build`
- **查看数据库**: `pnpm db:studio` (开启可视化管理后台)
- **代码格式化**: `pnpm format`
