import { PrismaClient, CategoryType } from '@prisma/client';

export class CategoryRepository {
  constructor(private readonly prisma: PrismaClient) { }

  create = async (
    userId: string,
    data: {
      name: string;
      type: CategoryType;
    }
  ) => {
    return this.prisma.category.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  list = async (userId: string, type?: CategoryType) => {
    return this.prisma.category.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  get = async (userId: string, id: string) => {
    return this.prisma.category.findFirst({
      where: { id, userId },
    });
  }

  update = async (
    userId: string,
    id: string,
    data: Partial<{
      name: string;
      type: CategoryType;
    }>
  ) => {
    return this.prisma.category.update({
      where: { id, userId },
      data,
    });
  }

  delete = async (userId: string, id: string) => {
    return this.prisma.category.delete({
      where: { id, userId },
    });
  }
}
