import { IUserRepository } from '../domain/IUserRepository';
import { NotFoundError } from '../../../shared/exceptions/ApiErrors';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.delete(id);
  }
}
