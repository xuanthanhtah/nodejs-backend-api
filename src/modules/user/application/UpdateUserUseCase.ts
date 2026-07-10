import { IUserRepository } from '../domain/IUserRepository';
import { UserResponseDTO } from '../dto/UserDTO';
import { UserMapper } from '../mapper/UserMapper';
import { NotFoundError } from '../../../shared/exceptions/ApiErrors';

export interface UpdateUserDTO {
  displayName?: string;
  role?: string;
  isActive?: boolean;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await this.userRepository.update(id, data);
    return UserMapper.toDTO(updatedUser);
  }
}
