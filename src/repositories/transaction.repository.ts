import { Prisma, PrismaClient, TransactionType } from '@prisma/client';

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) { }

  create = async (
    userId: string,
    data: {
      accountId: string;
      type: TransactionType;
      categoryId?: string;
      amount: number;
      occurredAt: Date;
      notes?: string;
    }
  ) => {
    return this.prisma.transaction.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  list = async (
    userId: string,
    filter: {
      from?: Date;
      to?: Date;
      accountId?: string;
      categoryId?: string;
      type?: TransactionType;
    }
  ) => {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(filter.from ? { occurredAt: { gte: new Date(filter.from) } } : {}),
        ...(filter.to ? { occurredAt: { lte: new Date(filter.to) } } : {}),
        ...(filter.accountId ? { accountId: filter.accountId } : {}),
        ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
        ...(filter.type ? { type: filter.type } : {}),
      },
      orderBy: { occurredAt: 'desc' },
    });
  }

  get = async (userId: string, id: string) => {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
    });
  }

  update = async (
    userId: string,
    id: string,
    data: {
      accountId?: string;
      categoryId?: string;
      type?: TransactionType;
      amount?: number;
      occurredAt?: Date;
      notes?: string;
    }) => {
    return this.prisma.transaction.update({
      where: { id, userId },
      data,
    });
  }

  delete = async (userId: string, id: string) => {
    return this.prisma.transaction.delete({
      where: { id, userId },
    });
  }

  sumByCategoryInMonth = async (
    userId: string,
    categoryId: string,
    year: number,
    month: number,
  ) => {
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 1);

    return this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        categoryId,
        type: TransactionType.EXPENSE,
        occurredAt: {
          gte: from,
          lte: to,
        },
      },
    });
  }

  sumIncomeExpense = async (
    userId: string,
    accountId?: string,
    from?: Date,
    to?: Date
  ) => {
    const whereBase: Prisma.TransactionWhereInput = { userId };

    if (from || to) {
      const occuredAt: Prisma.DateTimeFilter = {};
      if (from) {
        occuredAt.gte = from;
      }
      if (to) {
        occuredAt.lte = to;
      }
      whereBase.occurredAt = occuredAt;
    }

    if (accountId) {
      whereBase.accountId = accountId;
    }

    return Promise.all([
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          ...whereBase,
          type: TransactionType.INCOME,
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          ...whereBase,
          type: TransactionType.EXPENSE,
        },
      }),
    ]);
  }
}
