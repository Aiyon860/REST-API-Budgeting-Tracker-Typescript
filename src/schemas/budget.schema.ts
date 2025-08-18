import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    categoryId: z.cuid(),
    year: z.coerce.number().int().min(2000).max(2100),
    month: z.coerce.number().int().min(1).max(12),
    amount: z.coerce.number().nonnegative(),
  }),
});

export const updateBudgetSchema = z.object({
  params: z.object({ id: z.cuid() }),
  body: createBudgetSchema.shape.body.partial(),
});

export type UpdateBudgetBody = z.infer<typeof updateBudgetSchema>['body'];

export const budgetProgressParam = z.object({
  params: z.object({ id: z.cuid() }),
})
