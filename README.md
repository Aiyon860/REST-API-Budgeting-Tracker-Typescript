# Budgeting Tracker — Ultra MVP (TypeScript, Fastify, Prisma, Zod, JWT)

A REST API for **personal budgeting** built with a clean **Route → Handler → Service → Repository** architecture.  
Request validation is powered by **Zod**, persistence by **Prisma** (PostgreSQL), authentication by **JWT**, and the data model is **future-proof** (every entity includes a `userId`).

> ⚠️ **Current status**
>
> - **Error handling is minimal** (basic mapping; many Prisma/Zod errors are not translated to specific HTTP codes yet). **To be refined** when time allows.
> - **Pagination is not implemented** on list endpoints. **To be added** when time allows.

---

## MVP Features

- **Auth (JWT, single seeded user)**
  - `POST /v1/auth/login` — login with the seeded user → JWT
  - `GET  /v1/auth/me` — user info from token
- **Accounts** — CRUD + computed balance endpoint
- **Categories** — CRUD with `INCOME` / `EXPENSE`
- **Transactions** — CRUD + filtering by `from`, `to`, `accountId`, `categoryId`, `type`
- **Budgets** — monthly target per category (CRUD) + **progress** endpoint
- **Summary** — aggregated `income`, `expense`, `net` for a date range
- **Health check** — `GET /v1/health`

> **Account balance is computed on read**:  
> `balance = initialBalance + Σ(INCOME) − Σ(EXPENSE)`

---

## Tech Stack

- **Typescript** + **Fastify** (ESM)
- **Prisma** (PostgreSQL)
- **Zod** for Validation
- **JWT** for Auth
- **npm** + **tsx** for Development

---

## Architecture & Folder Structure

```pgsql
budgeting-tracker/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ env/
│  │  └─ index.ts
│  ├─ seeds/
│  │  └─ seed.ts
│  ├─ plugins/
│  │  ├─ prisma.plugin.ts
│  │  └─ jwt.plugin.ts
│  ├─ middlewares/
│  │  └─ auth.middleware.ts
│  ├─ routes/
│  │  └─ v1/
│  │     ├─ index.ts
│  │     ├─ health.route.ts
│  │     ├─ auth.route.ts
│  │     ├─ accounts.route.ts
│  │     ├─ categories.route.ts
│  │     ├─ transactions.route.ts
│  │     ├─ budgets.route.ts
│  │     └─ summary.route.ts
│  ├─ handlers/
│  │  ├─ auth.handler.ts
│  │  ├─ accounts.handler.ts
│  │  ├─ categories.handler.ts
│  │  ├─ transactions.handler.ts
│  │  ├─ budgets.handler.ts
│  │  └─ summary.handler.ts
│  ├─ services/
│  │  ├─ auth.service.ts
│  │  ├─ accounts.service.ts
│  │  ├─ categories.service.ts
│  │  ├─ transactions.service.ts
│  │  ├─ budgets.service.ts
│  │  └─ summary.service.ts
│  ├─ repositories/
│  │  ├─ user.repository.ts
│  │  ├─ account.repository.ts
│  │  ├─ category.repository.ts
│  │  ├─ transaction.repository.ts
│  │  └─ budget.repository.ts
│  ├─ schemas/
│  │  ├─ auth.schema.ts
│  │  ├─ account.schema.ts
│  │  ├─ category.schema.ts
│  │  ├─ transaction.schema.ts
│  │  └─ budget.schema.ts
│  ├─ utils/
│  │  ├─ errors.util.ts
│  │  ├─ pagination.util.ts
│  │  └─ object.util.ts
│  └─ types/
│     ├─ fastify.d.ts
│     └─ jwt.util.ts
├─ .env.example
├─ .gitignore
├─ README.md
├─ package.json
├─ package-lock.json
└─ tsconfig.json

```

---

## Database (overview)

- **User** — authentication account.
- **Account** — `userId`, `name`, `type`, `initialBalance`, `currency`.
- **Category** — `userId`, `name`, `type (INCOME|EXPENSE)`.
- **Transaction** — `userId`, `accountId`, `categoryId?`, `type`, `amount (Decimal(18,2))`, `occurredAt (Date)`.
- **BudgetMonth** — `userId`, `categoryId`, `year`, `month`, `amount (Decimal(18,2))`.

Key uniques:

- `Account`: `@@unique([userId, name])`
- `Category`: `@@unique([userId, name, type])`
- `BudgetMonth`: `@@unique([userId, categoryId, year, month])`

---

## Prerequisites

- **Node 18+**
- **PostgreSQL 13+**
- **pnpm**
- A database and a valid **`DATABASE_URL`** in `.env`

---

## Environment Configuration

Copy `.env.example` → `.env`, then adjust:

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:root@localhost:5432/budgeting_tracker
JWT_SECRET=supersecret
BCRYPT_SALT_ROUNDS=10
SEED_EMAIL=user@example.com
SEED_PASSWORD=password123
PORT=3000
HOST=0.0.0.0
```

---

## Install & Run

```bash
npm i
npm prisma:generate
npm prisma:migrate
npm seed
npm run dev
```

---

## Quick Start (Auth & Sanity checks)

1. Health

```bash
curl -s http://localhost:3000/v1/health
```

2. Login -> token

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
echo "TOKEN: ${TOKEN:0:20}..."
```

3. List accounts & Categories

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/v1/accounts
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:3000/v1/categories?type=EXPENSE"
```

4. Create an EXPENSE transaction (example)

```bash
# replace ACCOUNT_ID & CAT_FOOD
curl -s -X POST http://localhost:3000/v1/transactions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
"accountId": "ACCOUNT_ID",
    "categoryId": "CAT_FOOD",
    "type": "EXPENSE",
    "amount": 45000,
    "occurredAt": "2025-08-18T07:00:00.000Z",
    "notes": "Lunch test"
  }'
```

5. Check account balance & Summary

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/v1/accounts/ACCOUNT_ID/balance
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:3000/v1/summary?from=2025-08-01&to=2025-08-31"
```

> Date format: send ISO UTC (e.g., `"2025-08-18T07:00:00.000Z"`).
> In code, `occurredAt` is a Date (Zod `z.coerce.date()`).

---

## Implemenation Notes

- Account balances are not stored; computed from `initialBalance` + transaction aggregates.
- Decimal values are stored as `Decimal(18,2)`. Depending on serialization, you may see numbers or strings (both reflect 2 decimal places).
- JWT: all endpoints (except `/v1/health` and `POST /v1/auth/login`) require `Authorization: Bearer <token>`.
- Body parsing: use `application/json`. If you prefer `x-www-form-urlencoded`, register `@fastify/formbody` and ensure handlers parse `req.body` (not the entire `req`).

---

## Troubleshooting

- Route not found for `/auth/login`: ensure you use POST, not GET.
- Body is undefined: check `Content-Type` and how the payload is sent (JSON vs form-urlencoded).
- JWT/`req.user` typing issues: ensure `src/types/jwt.d.ts` augments `FastifyJWT`.
- Prisma orderBy (v6) error: use an array of objects — e.g., orderBy: `[{ year: 'desc' }, { month: 'desc' }]`.
- `aggregate` sum returns `null`: no rows matched the filter (verify `userId`, `accountId`, `type`). Prefer Prisma enums for `type` (`TransactionType.EXPENSE/INCOME`).
