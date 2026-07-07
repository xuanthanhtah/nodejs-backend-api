import { CreateUserUseCase } from '../../../src/modules/user/application/CreateUserUseCase';
import { IUserRepository } from '../../../src/modules/user/domain/IUserRepository';
import { ConflictError } from '../../../src/shared/exceptions/ApiErrors';
import { User } from '../../../src/modules/user/domain/User';
import { PasswordService } from '../../../src/shared/utils/auth-service';

jest.mock('../../../src/shared/utils/auth-service');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  it('should throw ConflictError if email already exists', async () => {
    const userData = { email: 'test@test.com', password: 'password', firstName: 'Test', lastName: 'User' };
    const existingUser = new User('id', userData.email, userData.firstName, userData.lastName, true, new Date(), new Date(), 'hashed');
    
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(userData)).rejects.toThrow(ConflictError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
  });

  it('should create user successfully', async () => {
    const userData = { email: 'test@test.com', password: 'password', firstName: 'Test', lastName: 'User' };
    const hashedPassword = 'hashed_password';
    const createdUser = new User('id', userData.email, userData.firstName, userData.lastName, true, new Date(), new Date(), hashedPassword);
    
    mockUserRepository.findByEmail.mockResolvedValue(null);
    (PasswordService.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(createdUser);

    const result = await createUserUseCase.execute(userData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(PasswordService.hash).toHaveBeenCalledWith(userData.password);
    expect(mockUserRepository.create).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
    expect(result.email).toBe(userData.email);
    expect(result.id).toBe('id');
  });
});
