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
