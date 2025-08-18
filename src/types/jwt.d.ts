import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      // payload yang kita sign & terima saat verify
      id: string;
      email: string;
    };
    user: {
      // tipe untuk request.user setelah jwtVerify()
      id: string;
      email: string;
    };
  }
}
