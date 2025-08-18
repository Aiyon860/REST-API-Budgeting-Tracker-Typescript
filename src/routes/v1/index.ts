import type { FastifyInstance } from "fastify";
import healthRoutes from "./health.route";
import authRoutes from "./auth.route";
import accountsRoutes from "./accounts.route";
import categoriesRoutes from "./categories.route";
import transactionsRoutes from "./transactions.route";
import budgetsRoutes from "./budgets.route";
import summaryRoutes from "./summary.route";

export default async function v1Routes(app: FastifyInstance) {
  await healthRoutes(app);
  await authRoutes(app);
  await accountsRoutes(app);
  await categoriesRoutes(app);
  await transactionsRoutes(app);
  await budgetsRoutes(app);
  await summaryRoutes(app);
}
