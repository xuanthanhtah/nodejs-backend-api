export class DocumentEntity {
  private constructor(
    private readonly id: string,
    private code: string,
    private title: string,
    private category: string,
    private status: string,
    private readonly createdBy: string,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(input: {
    id: string;
    code: string;
    title: string;
    category: string;
    status: string;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): DocumentEntity {
    if (!/^[A-Z0-9-_]+$/i.test(input.code) || input.code.length > 20) {
        throw new Error('Invalid code');
    }
    if (input.title.length > 255) {
        throw new Error('Title too long');
    }

    return new DocumentEntity(
      input.id,
      input.code,
      input.title,
      input.category,
      input.status,
      input.createdBy,
      input.createdAt || new Date(),
      input.updatedAt || new Date()
    );
  }

  getId(): string { return this.id; }
  getCode(): string { return this.code; }
  getTitle(): string { return this.title; }
  getCategory(): string { return this.category; }
  getStatus(): string { return this.status; }
  getCreatedBy(): string { return this.createdBy; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  updateDetails(input: { code?: string; title?: string; category?: string; status?: string }) {
    if (input.code) {
        if (!/^[A-Z0-9-_]+$/i.test(input.code) || input.code.length > 20) throw new Error('Invalid code');
        this.code = input.code;
    }
    if (input.title) {
        if (input.title.length > 255) throw new Error('Title too long');
        this.title = input.title;
    }
    if (input.category) this.category = input.category;
    if (input.status) this.status = input.status;
    
    this.updatedAt = new Date();
  }
}
