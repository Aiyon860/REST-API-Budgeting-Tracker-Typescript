import type { FastifyInstance } from 'fastify';
import { CategoriesService } from '../../services/categories.service';
import { CategoriesHandler } from '../../handlers/categories.handler';
import { verifyJWT } from '../../middlewares/auth.middleware';

export default async function categoriesRoutes(app: FastifyInstance) {
  const service = new CategoriesService(app.prisma);
  const handler = new CategoriesHandler(service);

  app.post('/categories', { preHandler: [verifyJWT] }, handler.create);
  app.get('/categories', { preHandler: [verifyJWT] }, handler.list);
  app.patch('/categories/:id', { preHandler: [verifyJWT] }, handler.update);
  app.delete('/categories/:id', { preHandler: [verifyJWT] }, handler.delete);
}
