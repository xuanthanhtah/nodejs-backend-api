import { IUserRepository } from '../domain/IUserRepository';
import { UserResponseDTO } from '../dto/UserDTO';
import { UserMapper } from '../mapper/UserMapper';
import { NotFoundError } from '../../../shared/exceptions/ApiErrors';
import { PaginationQuery } from '../../../shared/interfaces/pagination.interface';
import { PaginatedResult } from '../../../shared/interfaces/api-response.interface';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return UserMapper.toDTO(user);
  }
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: PaginationQuery): Promise<PaginatedResult<UserResponseDTO>> {
    const paginatedUsers = await this.userRepository.findAll(query);
    return {
      ...paginatedUsers,
      items: paginatedUsers.items.map((user) => UserMapper.toDTO(user)), // Wait, items are already domain objects. Mapper in repo mapped to Domain. Wait, repo returns PaginatedResult<User> (Domain User). Here we map to DTO.
    };
  }
}
