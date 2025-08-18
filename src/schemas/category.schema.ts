import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.enum(['INCOME', 'EXPENSE']),
  })
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.cuid() }),
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
  }),
});

export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>['body'];
