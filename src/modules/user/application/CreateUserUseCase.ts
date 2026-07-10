import { IUserRepository } from '../domain/IUserRepository';
import { UserResponseDTO } from '../dto/UserDTO';
import { UserMapper } from '../mapper/UserMapper';
import { ConflictError } from '../../../shared/exceptions/ApiErrors';
import { PasswordService } from '../../../shared/utils/auth-service';

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const hashedPassword = await PasswordService.hash(data.password);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return UserMapper.toDTO(user);
  }
}
