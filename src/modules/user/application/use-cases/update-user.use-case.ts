import { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { UserNotFoundError } from '../../domain/errors/user.errors';
import { UserResponseDto } from '../dto/user.dto';

export interface UpdateUserCommand {
  id: string;
  displayName: string;
  role: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserResponseDto> {
    const userId = UserId.create(command.id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId.value);
    }

    user.updateDetails(command.displayName, command.role);

    await this.userRepository.save(user);

    return {
      id: user.getId().value,
      email: user.getEmail().value,
      displayName: user.getDisplayName(),
      role: user.getRole(),
      isActive: user.isActive(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }
}
