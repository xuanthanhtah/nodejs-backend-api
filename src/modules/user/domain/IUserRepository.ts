import { User } from './User';
import { PaginatedResult } from '../../../shared/interfaces/api-response.interface';
import { PaginationQuery } from '../../../shared/interfaces/pagination.interface';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(query: PaginationQuery): Promise<PaginatedResult<User>>;
}
