import { User as PrismaUser } from '@prisma/client';
import { User } from '../domain/User';
import { UserResponseDTO } from '../dto/UserDTO';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.displayName,
      prismaUser.role,
      prismaUser.isActive,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.password, // Keep password in domain object initially if needed for auth, strip in DTO
    );
  }

  static toDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
