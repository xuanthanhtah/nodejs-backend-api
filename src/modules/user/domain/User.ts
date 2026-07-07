export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly password?: string, // optional because we don't always want to fetch it
  ) {}

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
