import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/User';
import { PrismaClient } from '@prisma/client';
import { PaginatedResult } from '../../../shared/interfaces/api-response.interface';
import { PaginationQuery } from '../../../shared/interfaces/pagination.interface';
import { UserMapper } from '../mapper/UserMapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const userModel = await this.prisma.user.findUnique({ where: { id } });
    if (!userModel) return null;
    return UserMapper.toDomain(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.prisma.user.findUnique({ where: { email } });
    if (!userModel) return null;
    return UserMapper.toDomain(userModel);
  }

  async create(userData: Partial<User>): Promise<User> {
    const userModel = await this.prisma.user.create({
      data: {
        email: userData.email!,
        password: userData.password!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
      },
    });
    return UserMapper.toDomain(userModel);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const userModel = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: userData.isActive,
      },
    });
    return UserMapper.toDomain(userModel);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findAll(query: PaginationQuery): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', q } = query;
    const skip = (page - 1) * limit;

    const where = q
      ? {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' as const } },
            { lastName: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
      }),
    ]);

    return {
      items: items.map(UserMapper.toDomain),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }
}
