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
