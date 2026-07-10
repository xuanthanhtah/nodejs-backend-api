import { randomUUID } from 'crypto';

export class UserId {
  private constructor(public readonly value: string) {}

  static create(value?: string): UserId {
    return new UserId(value ?? randomUUID());
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
