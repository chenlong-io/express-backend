import { injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { users } from '@/db/schema';

// 导出用户插入类型和选择类型辅助类型
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

/**
 * 用户仓储类
 * 负责与 users 表进行直接的数据交互。
 */
@injectable()
export class AuthModel {
  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 找到的用户对象或 undefined
   */
  async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user;
  }

  /**
   * 根据 ID 查找用户
   * @param id 用户 ID
   * @returns 找到的用户对象或 undefined
   */
  async findById(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  /**
   * 创建新用户
   * @param user 用户数据对象
   */
  async create(user: NewUser): Promise<void> {
    await db.insert(users).values(user);
  }

  /**
   * 更新用户信息
   * @param id 用户 ID
   * @param data 要更新的数据部分
   */
  async update(id: number, data: Partial<NewUser>): Promise<void> {
    await db.update(users).set(data).where(eq(users.id, id));
  }

  /**
   * 获取所有用户
   * @returns 用户列表
   */
  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }
  /**
   * 删除用户
   * @param id 用户 ID
   */
  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
