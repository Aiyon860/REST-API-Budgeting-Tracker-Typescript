import { CategoryType, PrismaClient, TransactionType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from '../env';

const prisma = new PrismaClient();

async function main() {
  const email = env.SEED_EMAIL;
  const plain = env.SEED_PASSWORD;
  const saltRounds = env.BCRYPT_SALT_ROUNDS;

  const hash = await bcrypt.hash(plain, saltRounds);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: hash, name: 'Budget User' }
  });

  // Accounts
  const cash = await prisma.account.upsert({
    where: { userId_name: { userId: user.id, name: 'Cash' } },
    update: {},
    create: { userId: user.id, name: 'Cash', type: 'CASH', currency: 'IDR', initialBalance: 250000 }
  });

  const bank = await prisma.account.upsert({
    where: { userId_name: { userId: user.id, name: 'Bank' } },
    update: {},
    create: { userId: user.id, name: 'Bank', type: 'BANK', currency: 'IDR', initialBalance: 1500000 }
  });

  // Categories
  const salary = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: 'Salary', type: CategoryType.INCOME } },
    update: {},
    create: { userId: user.id, name: 'Salary', type: CategoryType.INCOME }
  });

  const food = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: 'Food', type: CategoryType.EXPENSE } },
    update: {},
    create: { userId: user.id, name: 'Food', type: CategoryType.EXPENSE }
  });

  const transport = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: 'Transport', type: CategoryType.EXPENSE } },
    update: {},
    create: { userId: user.id, name: 'Transport', type: CategoryType.EXPENSE }
  });

  // Transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        accountId: bank.id,
        categoryId: salary.id,
        type: TransactionType.INCOME,
        amount: 3000000,
        occurredAt: new Date(),
        notes: 'Monthly salary'
      },
      {
        userId: user.id,
        accountId: cash.id,
        categoryId: food.id,
        type: TransactionType.EXPENSE,
        amount: 50000,
        occurredAt: new Date(),
        notes: 'Lunch'
      },
      {
        userId: user.id,
        accountId: cash.id,
        categoryId: transport.id,
        type: TransactionType.EXPENSE,
        amount: 20000,
        occurredAt: new Date(),
        notes: 'Bus'
      }
    ]
  });

  // Budget (current month)
  const now = new Date();
  await prisma.budgetMonth.upsert({
    where: { userId_categoryId_year_month: { userId: user.id, categoryId: food.id, year: now.getFullYear(), month: now.getMonth() + 1 } },
    update: { amount: 1000000 },
    create: { userId: user.id, categoryId: food.id, year: now.getFullYear(), month: now.getMonth() + 1, amount: 1000000 }
  });

  console.log('Seed done for', email);
}

main().finally(async () => {
  await prisma.$disconnect();
});
