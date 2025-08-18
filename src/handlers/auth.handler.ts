import type { FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema } from '../schemas/auth.schema.js';
import { AuthService } from '../services/auth.service.js';

export class AuthHandler {
  constructor(private authService: AuthService) { }

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    const { body } = loginSchema.parse(req);

    const result = await this.authService.login(body.email, body.password);
    if (!result) {
      return reply.status(401).send({
        message: 'Invalid Credentials'
      });
    }

    return reply.send({
      accessToken: result.token,
      user: result.user,
    });
  }

  me = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await this.authService.me(req.user!.id);
    return reply.send(user);
  }
}
