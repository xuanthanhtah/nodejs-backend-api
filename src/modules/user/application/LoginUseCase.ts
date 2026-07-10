import { IUserRepository } from '../domain/IUserRepository';
import { AuthResponseDTO } from '../dto/UserDTO';
import { UserMapper } from '../mapper/UserMapper';
import { UnauthorizedError } from '../../../shared/exceptions/ApiErrors';
import { PasswordService, JwtService } from '../../../shared/utils/auth-service';

export interface LoginDTO {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await PasswordService.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = JwtService.generateAccessToken(payload);
    const refreshToken = JwtService.generateRefreshToken(payload);

    return {
      user: UserMapper.toDTO(user),
      accessToken,
      refreshToken,
    };
  }
}
