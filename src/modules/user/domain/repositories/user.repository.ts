import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.value-object';
import { Email } from '../value-objects/email.value-object';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
