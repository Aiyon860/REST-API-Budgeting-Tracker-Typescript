import type { FastifyReply, FastifyRequest } from 'fastify';
import { BudgetsService } from '../services/budgets.service.js';
import { budgetProgressParam, createBudgetSchema, updateBudgetSchema } from '../schemas/budget.schema.js';

export class BudgetsHandler {
  constructor(private readonly budgetsService: BudgetsService) { }

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const { body } = createBudgetSchema.parse(req);
    const row = await this.budgetsService.create(req.user!.id, body);
    return reply.code(201).send(row);
  };

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const q = req.query as any;
    if (q.year) {
      q.year = Number(q.year);
    }
    if (q.month) {
      q.month = Number(q.month);
    }
    const rows = await this.budgetsService.list(
      req.user!.id,
      {
        year: q.year,
        month: q.month,
        categoryId: q.categoryId
      });
    return reply.send(rows);
  };

  get = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = (req.params as any).id as string;
    const row = await this.budgetsService.get(req.user!.id, id);
    if (!row) {
      return reply.code(404).send({ message: 'Not found' });
    }
    return reply.send(row);
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params, body } = updateBudgetSchema.parse(req);
    const row = await this.budgetsService.update(req.user!.id, params.id, body);
    return reply.send(row);
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = (req.params as any).id as string;
    await this.budgetsService.delete(req.user!.id, id);
    return reply.code(204).send({
      message: "Budget's deleted"
    });
  };

  progress = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params } = budgetProgressParam.parse(req);
    const data = await this.budgetsService.progress(req.user!.id, params.id);
    if (!data) {
      return reply.code(404).send({ message: 'Not found' });
    }
    return reply.send(data);
  };
}
