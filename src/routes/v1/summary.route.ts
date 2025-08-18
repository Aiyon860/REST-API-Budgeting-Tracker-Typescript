import type { FastifyInstance } from 'fastify';
import { SummaryService } from '../../services/summary.service';
import { SummaryHandler } from '../../handlers/summary.handler';
import { verifyJWT } from '../../middlewares/auth.middleware';

export default async function summaryRoutes(app: FastifyInstance) {
  const service = new SummaryService(app.prisma);
  const handler = new SummaryHandler(service);

  app.get('/summary', { preHandler: [verifyJWT] }, handler.summary);
}
