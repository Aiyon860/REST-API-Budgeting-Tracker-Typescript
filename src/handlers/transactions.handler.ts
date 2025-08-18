import type { FastifyReply, FastifyRequest } from "fastify";
import { TransactionsService } from "../services/transactions.service.js";
import { createTransactionSchema, listTransactionSchema, updateTransactionSchema } from "../schemas/transaction.schema.js";

export class TransactionsHandler {
  constructor(private readonly transactionsService: TransactionsService) { }

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const { body } = createTransactionSchema.parse(req);
    const row = await this.transactionsService.create(req.user!.id, body);
    return reply.code(201).send(row);
  }

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const { query } = listTransactionSchema.parse(req);
    const rows = await this.transactionsService.list(req.user!.id, query);
    return reply.send(rows);
  }

  get = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = (req.params as any).id as string;
    const row = await this.transactionsService.get(req.user!.id, id);
    if (!row) {
      return reply.code(404).send({
        message: 'Not found'
      });
    }
    return reply.send(row);
  }

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params, body } = updateTransactionSchema.parse(req);
    const row = await this.transactionsService.update(req.user!.id, params.id, body);
    return reply.send(row);
  }

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = (req.params as any).id as string;
    await this.transactionsService.delete(req.user!.id, id);
    return reply.code(204).send({
      message: "Transaction's deleted"
    });
  }
}
