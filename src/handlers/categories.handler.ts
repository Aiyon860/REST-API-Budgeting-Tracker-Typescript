import type { FastifyReply, FastifyRequest } from 'fastify';
import { CategoriesService } from '../services/categories.service';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema.js';

export class CategoriesHandler {
  constructor(private readonly categoriesService: CategoriesService) { }

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const { body } = createCategorySchema.parse(req);
    const row = await this.categoriesService.create(req.user!.id, body);
    return reply.code(201).send(row);
  }

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const type = (req.query as any)?.type as 'INCOME' | 'EXPENSE' | undefined;
    const rows = await this.categoriesService.list(req.user!.id, type);
    return reply.send(rows);
  }

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params, body } = updateCategorySchema.parse(req);
    const row = await this.categoriesService.update(req.user!.id, params.id, body);
    return reply.send(row);
  }

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = (req.params as any).id as string;
    await this.categoriesService.delete(req.user!.id, id);
    return reply.code(204).send({
      message: "Category's deleted"
    });
  }
}
