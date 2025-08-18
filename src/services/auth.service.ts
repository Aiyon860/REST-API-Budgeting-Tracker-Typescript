import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly app: FastifyInstance,
  ) {
    this.userRepository = new UserRepository(this.prisma);
  }

  login = async (email: string, password: string) => {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return null;
    }

    const token = this.app.jwt.sign({
      id: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  }

  me = async (userId: string) => {
    return await this.userRepository.findById(userId);
  }
}
