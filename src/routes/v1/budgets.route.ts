import type { FastifyInstance } from "fastify";
import { BudgetsService } from "../../services/budgets.service";
import { BudgetsHandler } from "../../handlers/budgets.handler";
import { verifyJWT } from "../../middlewares/auth.middleware";

export default async function budgetsRoutes(app: FastifyInstance) {
  const service = new BudgetsService(app.prisma);
  const handler = new BudgetsHandler(service);

  app.post('/budgets', { preHandler: [verifyJWT] }, handler.create);
  app.get('/budgets', { preHandler: [verifyJWT] }, handler.list);
  app.get('/budgets/:id', { preHandler: [verifyJWT] }, handler.get);
  app.patch('/budgets/:id', { preHandler: [verifyJWT] }, handler.update);
  app.delete('/budgets/:id', { preHandler: [verifyJWT] }, handler.delete);
  app.get('/budgets/:id/progress', { preHandler: [verifyJWT] }, handler.progress);
}
