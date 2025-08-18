import type { PrismaClient, TransactionType } from '@prisma/client';
import { TransactionRepository } from '../repositories/transaction.repository';
import type { CreateTransactionBody, ListTransactionQuery, UpdateTransactionBody } from '../schemas/transaction.schema';
import { cleanUndefined } from '../utils/object.util';

export class TransactionsService {
  private readonly transactionRepository: TransactionRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.transactionRepository = new TransactionRepository(this.prisma);
  }

  create = async (
    userId: string,
    body: CreateTransactionBody
  ) => {
    const data = cleanUndefined(body) as {
      accountId: string;
      categoryId?: string;
      type: TransactionType;
      amount: number;
      occurredAt: Date;
      notes?: string;
    }
    return await this.transactionRepository.create(userId, data);
  }

  list = async (
    userId: string,
    filter: ListTransactionQuery
  ) => {
    const f = cleanUndefined(filter) as {
      from?: Date;
      to?: Date;
      accountId?: string;
      categoryId?: string;
      type?: TransactionType;
    }
    return await this.transactionRepository.list(userId, f);
  }

  get = async (userId: string, id: string) => {
    return await this.transactionRepository.get(userId, id);
  }

  update = async (
    userId: string,
    id: string,
    body: UpdateTransactionBody
  ) => {
    const data = cleanUndefined(body);
    return await this.transactionRepository.update(userId, id, data);
  }

  delete = async (userId: string, id: string) => {
    return await this.transactionRepository.delete(userId, id);
  }
}
