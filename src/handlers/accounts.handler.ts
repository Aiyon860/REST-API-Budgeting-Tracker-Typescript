import type { FastifyReply, FastifyRequest } from 'fastify';
import { AccountsService } from '../services/accounts.service';
import { createAccountSchema, idParamSchema, updateAccountSchema } from '../schemas/account.schema';

export class AccountsHandler {
  constructor(private readonly accountsService: AccountsService) { };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const { body } = createAccountSchema.parse(req);
    const data = await this.accountsService.create(req.user!.id, body);
    return reply.code(201).send(data);
  }

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const rows = await this.accountsService.list(req.user!.id);
    return reply.send(rows);
  }

  get = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params } = idParamSchema.parse(req);

    const data = await this.accountsService.getWithBalance(req.user!.id, params.id);
    if (!data) {
      return reply.code(404).send({
        message: 'Not found',
      })
    }

    return reply.send(data);
  }

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params, body } = updateAccountSchema.parse(req);
    const data = await this.accountsService.update(req.user!.id, params.id, body);
    return reply.send(data);
  }

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params } = idParamSchema.parse(req);
    await this.accountsService.delete(req.user!.id, params.id);
    return reply.code(204).send({
      message: "Account's deleted"
    })
  }

  balance = async (req: FastifyRequest, reply: FastifyReply) => {
    const { params } = idParamSchema.parse(req);
    const data = await this.accountsService.getWithBalance(req.user!.id, params.id);
    if (!data) {
      return reply.code(404).send({
        message: 'Not found'
      });
    }
    return reply.send({
      accountId: params.id,
      balance: data.balance,
    })
  }
}
