import { UserId } from '../value-objects/user-id.value-object';
import { Email } from '../value-objects/email.value-object';

export interface UserProps {
  email: Email;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(
    private readonly id: UserId,
    private props: UserProps,
  ) {}

  static create(input: {
    id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    const now = new Date();
    return new User(UserId.create(input.id), {
      email: Email.create(input.email),
      password: input.password,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      isActive: input.isActive ?? true,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    });
  }

  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.props.email;
  }

  getPassword(): string {
    return this.props.password;
  }

  getFirstName(): string {
    return this.props.firstName;
  }

  getLastName(): string {
    return this.props.lastName;
  }

  isActive(): boolean {
    return this.props.isActive;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  updateDetails(firstName: string, lastName: string): void {
    this.props.firstName = firstName.trim();
    this.props.lastName = lastName.trim();
    this.touch();
  }

  changePassword(password: string): void {
    this.props.password = password;
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
