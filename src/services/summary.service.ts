import type { PrismaClient } from '@prisma/client';
import { TransactionRepository } from '../repositories/transaction.repository';

export class SummaryService {
  private readonly transactionRepository: TransactionRepository;

  constructor(prisma: PrismaClient) {
    this.transactionRepository = new TransactionRepository(prisma);
  }

  summarize = async (
    userId: string,
    from?: Date,
    to?: Date,
    accountId?: string
  ) => {
    const [inc, exp] = await this.transactionRepository.sumIncomeExpense(userId, accountId, from, to);
    const income = Number(inc._sum.amount ?? 0);
    const expense = Number(exp._sum.amount ?? 0);
    return {
      income,
      expense,
      net: income - expense
    };
  }
}
