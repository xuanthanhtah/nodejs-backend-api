const fs = require('fs');
const path = require('path');

const write = (p, content) => {
    fs.writeFileSync(path.join('D:/backend/src/modules/document', p), content.trim() + '\n', 'utf8');
};

write('domain/entities/document.entity.ts', `
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
`);

write('domain/repositories/document.repository.ts', `
import { DocumentEntity } from '../entities/document.entity';

export interface GetDocumentsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
  createdBy?: string;
}

export interface PaginatedDocuments {
  data: DocumentEntity[];
  count: number;
}

export interface IDocumentRepository {
  findById(id: string): Promise<DocumentEntity | null>;
  findAll(query: GetDocumentsQuery): Promise<PaginatedDocuments>;
  save(document: DocumentEntity): Promise<void>;
  update(id: string, document: DocumentEntity): Promise<void>;
  delete(id: string): Promise<void>;
  saveBatch(documents: DocumentEntity[]): Promise<void>;
}
`);

write('infrastructure/persistence/repositories/prisma-document.repository.ts', `
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
`);

write('application/use-cases/document.use-cases.ts', `
import { IDocumentRepository, GetDocumentsQuery } from '../../domain/repositories/document.repository';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { randomUUID } from 'crypto';

export class DocumentUseCases {
  constructor(private readonly repo: IDocumentRepository) {}

  async getDocuments(query: GetDocumentsQuery, userId: string, role: string) {
    if (role === 'STAFF') {
      query.createdBy = userId;
    }
    const result = await this.repo.findAll(query);
    return {
      data: result.data.map(d => ({
        id: d.getId(), code: d.getCode(), title: d.getTitle(),
        category: d.getCategory(), status: d.getStatus(),
        createdBy: d.getCreatedBy(), createdAt: d.getCreatedAt(), updatedAt: d.getUpdatedAt()
      })),
      count: result.count
    };
  }

  async createDocument(data: any, createdBy: string) {
    const doc = DocumentEntity.create({
      id: randomUUID(),
      code: data.code,
      title: data.title,
      category: data.category,
      status: data.status,
      createdBy
    });
    await this.repo.save(doc);
    return {
        id: doc.getId(), code: doc.getCode(), title: doc.getTitle(),
        category: doc.getCategory(), status: doc.getStatus(),
        createdBy: doc.getCreatedBy(), createdAt: doc.getCreatedAt(), updatedAt: doc.getUpdatedAt()
    };
  }

  async updateDocument(id: string, data: any) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new Error('Document not found');
    doc.updateDetails(data);
    await this.repo.update(id, doc);
    return {
        id: doc.getId(), code: doc.getCode(), title: doc.getTitle(),
        category: doc.getCategory(), status: doc.getStatus(),
        createdBy: doc.getCreatedBy(), createdAt: doc.getCreatedAt(), updatedAt: doc.getUpdatedAt()
    };
  }

  async deleteDocument(id: string) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new Error('Document not found');
    await this.repo.delete(id);
  }

  async batchCreate(documents: any[], createdBy: string) {
    const docs = documents.map(data => DocumentEntity.create({
      id: randomUUID(),
      code: data.code,
      title: data.title,
      category: data.category,
      status: data.status,
      createdBy
    }));
    await this.repo.saveBatch(docs);
    return { success: true, count: docs.length };
  }
}
`);

write('presentation/http/controllers/document.controller.ts', `
import { Request, Response, NextFunction } from 'express';
import { DocumentUseCases } from '../../../application/use-cases/document.use-cases';
import { HttpStatusCode } from '../../../../../shared/constants/http-status';

export class DocumentController {
  constructor(private readonly useCases: DocumentUseCases) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const result = await this.useCases.getDocuments(req.query, user.id, user.role || 'STAFF');
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) { next(error); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const result = await this.useCases.createDocument(req.body, user.id);
      res.status(HttpStatusCode.CREATED).json(result);
    } catch (error) { next(error); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.useCases.updateDocument(req.params.id, req.body);
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) { next(error); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.useCases.deleteDocument(req.params.id);
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) { next(error); }
  };

  batch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!Array.isArray(req.body)) throw new Error('Body must be an array');
      const result = await this.useCases.batchCreate(req.body, user.id);
      res.status(HttpStatusCode.CREATED).json(result);
    } catch (error) { next(error); }
  };
}
`);

write('presentation/http/routes/document.routes.ts', `
import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { DocumentUseCases } from '../../../application/use-cases/document.use-cases';
import { PrismaDocumentRepository } from '../../../infrastructure/persistence/repositories/prisma-document.repository';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../../../../shared/middleware/auth.middleware';

export function createDocumentRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const repo = new PrismaDocumentRepository(prisma);
  const useCases = new DocumentUseCases(repo);
  const controller = new DocumentController(useCases);

  router.use(authMiddleware);

  router.get('/', controller.getAll);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);
  router.post('/batch', controller.batch);

  return router;
}
`);

console.log('Document module files created');
