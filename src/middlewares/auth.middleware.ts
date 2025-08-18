import type { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJWT(req: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await req.jwtVerify<{ id: string; email: string }>();
    req.user = {
      id: payload.id,
      email: payload.email
    };
  } catch (err) {
    return reply.status(401).send({
      message: 'Unauthorized'
    });
  }
}
