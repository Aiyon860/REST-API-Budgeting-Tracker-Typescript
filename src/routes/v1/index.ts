import type { FastifyInstance } from "fastify";
import healthRoutes from "./health.route.js";
import authRoutes from "./auth.route.js";
import accountsRoutes from "./accounts.route.js";
import categoriesRoutes from "./categories.route.js";
import transactionsRoutes from "./transactions.route.js";
import budgetsRoutes from "./budgets.route.js";
import summaryRoutes from "./summary.route.js";

export default async function v1Routes(app: FastifyInstance) {
  await healthRoutes(app);
  await authRoutes(app);
  await accountsRoutes(app);
  await categoriesRoutes(app);
  await transactionsRoutes(app);
  await budgetsRoutes(app);
  await summaryRoutes(app);
}
