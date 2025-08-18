import type { FastifyReply, FastifyRequest } from 'fastify';
import { SummaryService } from '../services/summary.service';

export class SummaryHandler {
  constructor(private readonly summaryService: SummaryService) { }

  summary = async (req: FastifyRequest, reply: FastifyReply) => {
    const q = req.query as any;

    const from = q.from ? new Date(q.from) : undefined;
    const to = q.to ? new Date(q.to) : undefined;
    const accountId = q.accountId as string | undefined;

    const data = await this.summaryService.summarize(req.user!.id, from, to, accountId);

    return reply.send(data);
  };
}
