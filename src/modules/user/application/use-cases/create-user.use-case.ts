import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';
import { UserEmailAlreadyExistsError } from '../../domain/errors/user.errors';
import { UserResponseDto } from '../dto/user.dto';

export interface CreateUserCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const email = Email.create(command.email);
    const emailExists = await this.userRepository.existsByEmail(email);

    if (emailExists) {
      throw new UserEmailAlreadyExistsError(email.value);
    }

    const user = User.create({
      email: command.email,
      password: command.password, // In a real scenario, should hash this password
      firstName: command.firstName,
      lastName: command.lastName,
    });

    await this.userRepository.save(user);

    return {
      id: user.getId().value,
      email: user.getEmail().value,
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      isActive: user.isActive(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }
}
