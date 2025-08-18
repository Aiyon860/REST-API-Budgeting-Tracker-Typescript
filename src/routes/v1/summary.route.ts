import type { FastifyInstance } from 'fastify';
import { SummaryService } from '../../services/summary.service.js';
import { SummaryHandler } from '../../handlers/summary.handler.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

export default async function summaryRoutes(app: FastifyInstance) {
  const service = new SummaryService(app.prisma);
  const handler = new SummaryHandler(service);

  app.get('/summary', { preHandler: [verifyJWT] }, handler.summary);
}
