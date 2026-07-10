import { BadRequestError } from '../../../../shared/exceptions/ApiErrors';

export class Email {
  private constructor(public readonly value: string) {}

  static create(rawValue: string): Email {
    const normalizedValue = rawValue.trim().toLowerCase();
    if (!Email.isValid(normalizedValue)) {
      throw new BadRequestError(`Invalid email format: ${rawValue}`);
    }
    return new Email(normalizedValue);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
