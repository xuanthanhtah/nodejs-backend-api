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
