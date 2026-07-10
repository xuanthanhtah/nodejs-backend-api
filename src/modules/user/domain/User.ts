export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly displayName: string,
    public readonly role: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly password?: string, // optional because we don't always want to fetch it
  ) {}

  public get fullName(): string {
    return `${this.displayName} ${this.role}`;
  }
}
