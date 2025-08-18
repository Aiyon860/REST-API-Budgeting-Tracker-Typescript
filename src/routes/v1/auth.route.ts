import type { FastifyInstance } from "fastify";
import { AuthService } from "../../services/auth.service";
import { AuthHandler } from "../../handlers/auth.handler";
import { verifyJWT } from "../../middlewares/auth.middleware";

export default async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app.prisma, app);
  const handler = new AuthHandler(service);

  app.post('/auth/login', handler.login);
  app.get('/auth/me', { preHandler: [verifyJWT] }, handler.me);
}
