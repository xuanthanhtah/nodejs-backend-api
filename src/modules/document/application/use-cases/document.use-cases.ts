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
