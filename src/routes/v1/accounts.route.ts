import type { FastifyInstance } from 'fastify';
import { AccountsService } from '../../services/accounts.service.js';
import { AccountsHandler } from '../../handlers/accounts.handler.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

export default async function accountsRoutes(app: FastifyInstance) {
  const service = new AccountsService(app.prisma);
  const handler = new AccountsHandler(service);

  app.post('/accounts', { preHandler: [verifyJWT] }, handler.create);
  app.get('/accounts', { preHandler: [verifyJWT] }, handler.list);
  app.get('/accounts/:id', { preHandler: [verifyJWT] }, handler.get);
  app.patch('/accounts/:id', { preHandler: [verifyJWT] }, handler.update);
  app.delete('/accounts/:id', { preHandler: [verifyJWT] }, handler.delete);
  app.get('/accounts/:id/balance', { preHandler: [verifyJWT] }, handler.balance);
}
