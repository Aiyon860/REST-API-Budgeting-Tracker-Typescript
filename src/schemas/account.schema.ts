import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.enum(['CASH', 'BANK', 'EWALLET', 'CREDIT']),
    currency: z.string().default('IDR'),
    initialBalance: z.coerce.number().nonnegative().default(0),
  }),
});

export const updateAccountSchema = z.object({
  params: z.object({ id: z.cuid() }),
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['CASH', 'BANK', 'EWALLET', 'CREDIT']).optional(),
    currency: z.string().optional(),
  }),
});

export type UpdateAccountBody = z.infer<typeof updateAccountSchema>['body'];

export const idParamSchema = z.object({
  params: z.object({ id: z.cuid() }),
});
