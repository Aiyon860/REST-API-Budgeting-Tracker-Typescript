import fastify from 'fastify';
import cors from '@fastify/cors';
import prismaPlugin from './plugins/prisma.plugin.js';
import jwtPlugin from './plugins/jwt.plugin.js';
import formBodyPlugin from '@fastify/formbody';
import v1Routes from './routes/v1/index.js';

export function buildApp() {
  const app = fastify({ logger: true });

  // Register plugins
  app.register(cors, {
    origin: true, // Allow all origins
  });
  app.register(prismaPlugin);
  app.register(jwtPlugin);
  app.register(formBodyPlugin);

  // Register routes
  app.register(v1Routes, { prefix: '/v1' });

  // Error handling
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });

  return app;
};
