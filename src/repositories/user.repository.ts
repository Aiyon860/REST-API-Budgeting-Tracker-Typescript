import { PrismaClient } from '@prisma/client';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  findByEmail = async (email: string) => {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById = async (id: string) => {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
