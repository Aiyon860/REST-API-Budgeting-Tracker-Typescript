import type { FastifyInstance } from 'fastify';
import { TransactionsService } from '../../services/transactions.service.js';
import { TransactionsHandler } from '../../handlers/transactions.handler.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

export default async function transactionsRoutes(app: FastifyInstance) {
  const service = new TransactionsService(app.prisma);
  const handler = new TransactionsHandler(service);

  app.post('/transactions', { preHandler: [verifyJWT] }, handler.create);
  app.get('/transactions', { preHandler: [verifyJWT] }, handler.list);
  app.get('/transactions/:id', { preHandler: [verifyJWT] }, handler.get);
  app.patch('/transactions/:id', { preHandler: [verifyJWT] }, handler.update);
  app.delete('/transactions/:id', { preHandler: [verifyJWT] }, handler.delete);
}
