import { z } from 'zod';
import * as dotenv from 'dotenv';
import { randomBytes } from 'crypto';
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url().default('postgres://postgres:root@localhost:5432/budgeting_tracker'),
  JWT_SECRET: z.string().min(8).default(randomBytes(4).toString('hex')),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
  SEED_EMAIL: z.email().default('user@example.com'),
  SEED_PASSWORD: z.string().min(8).default('password123'),
  HOST: z.string().default('0.0.0.0'),
});

export const env = EnvSchema.parse(process.env);
