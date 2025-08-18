import { PrismaClient, AccountType, TransactionType } from '@prisma/client';

export class AccountRepository {
  constructor(private readonly prisma: PrismaClient) { }

  create = async (
    userId: string,
    data: {
      name: string;
      type: AccountType;
      currency: string;
      initialBalance: number
    }) => {
    return this.prisma.account.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  list = async (userId: string) => {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  get = async (userId: string, id: string) => {
    return this.prisma.account.findFirst({
      where: { id, userId },
    });
  }

  update = async (
    userId: string,
    id: string,
    data: Partial<{
      name: string;
      type: AccountType;
      currency: string;
    }>) => {
    return this.prisma.account.update({
      where: { id, userId },
      data,
      select: {
        id: true,
        name: true,
        type: true,
        currency: true,
        initialBalance: true,
        userId: true,
      }
    });
  }

  delete = async (userId: string, id: string) => {
    return this.prisma.account.delete({
      where: { id, userId },
    });
  }

  sumIncome = async (userId: string, accountId: string) => {
    return this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        accountId,
        userId,
        type: TransactionType.INCOME,
      },
    });
  }

  sumExpense = async (userId: string, accountId: string) => {
    return this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        accountId,
        userId,
        type: TransactionType.EXPENSE,
      },
    });
  }
}
