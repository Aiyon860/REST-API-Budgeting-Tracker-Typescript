import { PrismaClient } from '@prisma/client';

export class BudgetRepository {
  constructor(private readonly prisma: PrismaClient) { }

  create = async (
    userId: string,
    data: {
      categoryId: string;
      year: number;
      month: number;
      amount: number;
    }
  ) => {
    return this.prisma.budgetMonth.create({
      data: {
        userId,
        ...data,
      },
    });
  };

  list = async (
    userId: string,
    q: {
      year?: number;
      month?: number;
      categoryId?: string;
    }) => {
    return this.prisma.budgetMonth.findMany({
      where: {
        userId,
        ...q,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  get = async (
    userId: string,
    id: string
  ) => {
    return this.prisma.budgetMonth.findFirst({
      where: { id, userId },
    });
  }

  update = async (
    userId: string,
    id: string,
    data: Partial<{
      categoryId: string;
      year: number;
      month: number;
      amount: number;
    }>
  ) => {
    return this.prisma.budgetMonth.update({
      where: { id, userId },
      data,
    });
  }

  delete = async (
    userId: string,
    id: string
  ) => {
    return this.prisma.budgetMonth.delete({
      where: { id, userId },
    });
  }
}
