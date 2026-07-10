import { PrismaClient } from '@prisma/client';
import { IDocumentRepository, GetDocumentsQuery, PaginatedDocuments } from '../../../domain/repositories/document.repository';
import { DocumentEntity } from '../../../domain/entities/document.entity';

export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(model: any): DocumentEntity {
    return DocumentEntity.create({
      id: model.id,
      code: model.code,
      title: model.title,
      category: model.category,
      status: model.status,
      createdBy: model.createdBy,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    const record = await this.prisma.document.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findAll(query: GetDocumentsQuery): Promise<PaginatedDocuments> {
    const page = query.page ? Number(query.page) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query.createdBy) where.createdBy = query.createdBy;
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { code: { contains: query.search } }
      ];
    }

    const [count, items] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      data: items.map(this.toDomain),
      count
    };
  }

  async save(document: DocumentEntity): Promise<void> {
    await this.prisma.document.create({
      data: {
        id: document.getId(),
        code: document.getCode(),
        title: document.getTitle(),
        category: document.getCategory(),
        status: document.getStatus(),
        createdBy: document.getCreatedBy(),
        createdAt: document.getCreatedAt(),
        updatedAt: document.getUpdatedAt()
      }
    });
  }

  async update(id: string, document: DocumentEntity): Promise<void> {
    await this.prisma.document.update({
      where: { id },
      data: {
        code: document.getCode(),
        title: document.getTitle(),
        category: document.getCategory(),
        status: document.getStatus(),
        updatedAt: document.getUpdatedAt()
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({ where: { id } });
  }

  async saveBatch(documents: DocumentEntity[]): Promise<void> {
    const data = documents.map(d => ({
        id: d.getId(),
        code: d.getCode(),
        title: d.getTitle(),
        category: d.getCategory(),
        status: d.getStatus(),
        createdBy: d.getCreatedBy(),
        createdAt: d.getCreatedAt(),
        updatedAt: d.getUpdatedAt()
    }));
    await this.prisma.$transaction(
      data.map(d => this.prisma.document.create({ data: d }))
    );
  }
}
