import type { PrismaClient, AccountType } from '@prisma/client';
import { AccountRepository } from '../repositories/account.repository.js';
import { cleanUndefined } from '../utils/object.util.js';
import type { UpdateAccountBody } from '../schemas/account.schema.js';

export class AccountsService {
  private readonly accountRepository: AccountRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.accountRepository = new AccountRepository(this.prisma);
  }

  create = async (
    userId: string,
    data: {
      name: string,
      type: AccountType,
      currency: string,
      initialBalance: number,
    }
  ) => {
    return await this.accountRepository.create(userId, data);
  }

  list = async (userId: string) => {
    return await this.accountRepository.list(userId);
  }

  getWithBalance = async (userId: string, id: string) => {
    const account = await this.accountRepository.get(userId, id);
    if (!account) {
      return null;
    }

    const [inc, exp] = await Promise.all([
      this.accountRepository.sumIncome(userId, id),
      this.accountRepository.sumExpense(userId, id),
    ]);

    const income = Number(inc._sum.amount ?? 0);
    const expense = Number(exp._sum.amount ?? 0);
    const balance = Number(account.initialBalance) + income - expense;

    return {
      ...account,
      balance,
    }
  }

  update = async (
    userId: string,
    id: string,
    body: UpdateAccountBody
  ) => {
    const data = cleanUndefined(body);
    return await this.accountRepository.update(userId, id, data);
  }

  delete = async (userId: string, id: string) => {
    return await this.accountRepository.delete(userId, id);
  }
}
