import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    accountId: z.cuid(),
    categoryId: z.cuid().optional(),
    type: z.enum(['INCOME', 'EXPENSE']),
    amount: z.coerce.number().positive(),
    occurredAt: z.coerce.date().default(new Date()),
    notes: z.string().max(500).optional(),
  }),
});

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>['body'];

export const listTransactionSchema = z.object({
  query: z.object({
    accountId: z.cuid().optional(),
    categoryId: z.cuid().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
});

export type ListTransactionQuery = z.infer<typeof listTransactionSchema>['query'];

export const updateTransactionSchema = z.object({
  params: z.object({ id: z.cuid() }),
  body: createTransactionSchema.shape.body.partial(),
});

export type UpdateTransactionBody = z.infer<typeof updateTransactionSchema>['body'];
