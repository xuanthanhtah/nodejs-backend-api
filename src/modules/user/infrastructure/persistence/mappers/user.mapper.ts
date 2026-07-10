import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';

export class UserPersistenceMapper {
  static toDomain(record: PrismaUser): User {
    return User.create({
      id: record.id,
      email: record.email,
      password: record.password,
      firstName: record.firstName,
      lastName: record.lastName,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.getId().value,
      email: user.getEmail().value,
      password: user.getPassword(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      isActive: user.isActive(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
