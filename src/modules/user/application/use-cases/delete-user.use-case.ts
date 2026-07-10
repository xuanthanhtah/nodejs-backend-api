import { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { UserNotFoundError } from '../../domain/errors/user.errors';

export interface DeleteUserCommand {
  id: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userId = UserId.create(command.id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId.value);
    }

    await this.userRepository.delete(userId);
  }
}
