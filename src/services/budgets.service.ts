import type { PrismaClient } from '@prisma/client';
import { BudgetRepository } from '../repositories/budget.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import type { UpdateBudgetBody } from '../schemas/budget.schema';
import { cleanUndefined } from '../utils/object.util';

export class BudgetsService {
  private readonly budgetRepository: BudgetRepository;
  private readonly transactionRepository: TransactionRepository;

  constructor(prisma: PrismaClient) {
    this.budgetRepository = new BudgetRepository(prisma);
    this.transactionRepository = new TransactionRepository(prisma);
  }

  create = (
    userId: string,
    data: {
      categoryId: string;
      year: number;
      month: number;
      amount: number
    }) => {
    return this.budgetRepository.create(userId, data);
  }

  list = (
    userId: string,
    q: {
      year?: number;
      month?: number;
      categoryId?: string
    }) => {
    return this.budgetRepository.list(userId, q);
  }

  get = (userId: string, id: string) => {
    return this.budgetRepository.get(userId, id);
  }

  update = (
    userId: string,
    id: string,
    body: UpdateBudgetBody
  ) => {
    const data = cleanUndefined(body);
    return this.budgetRepository.update(userId, id, data);
  }

  delete = (userId: string, id: string) => {
    return this.budgetRepository.delete(userId, id);
  }

  progress = async (userId: string, id: string) => {
    const budget = await this.budgetRepository.get(userId, id);
    if (!budget) {
      return null;
    }

    const sum = await this.transactionRepository.sumByCategoryInMonth(
      userId,
      budget.categoryId,
      budget.year,
      budget.month
    );
    const spent = Number(sum._sum.amount ?? 0);
    const allocated = Number(budget.amount);

    return {
      allocated,
      spent,
      remaining: allocated - spent
    };
  }
}
