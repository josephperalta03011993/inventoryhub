# InventoryHub

InventoryHub is a web-based inventory management system for small businesses and organizations. It gives employees, administrators, and owners a shared, database-backed view of products, stock counts, and inventory activity.

**Live application:** [https://inventoryhub-one.vercel.app](https://inventoryhub-one.vercel.app)

**Repository:** [josephperalta03011993/inventoryhub](https://github.com/josephperalta03011993/inventoryhub)

## Team

- Joseph Peralta
- Bruce Nyeha
- Erandy Ramirez
- Bryton Palmer

## Product demo summary

Small teams often track inventory in spreadsheets or on paper, making it difficult to keep counts accurate and identify items that need attention. InventoryHub provides a shared, database-backed inventory so staff can view current products and owners can monitor stock levels, low-stock items, and inventory activity.

Employees can submit stock counts and check whether they have been reviewed. Administrators manage products and user accounts and review submitted counts; owners use the dashboard and reports to oversee inventory and activity. This role-based workflow connects stock reporting to inventory records and their audit history.

## Features

- Role-based sign-up and sign-in for Employees, Admins, and Owners.
- Product browsing and Admin product create, read, update, and delete.
- Admin user create, read, update, and delete.
- Employee stock-count reports with review status.
- Admins and Owners can approve or reject reports; approval updates product stock and creates an audit entry.
- Owner dashboard and reports for stock status, low stock, employees, and transaction history.
- Responsive layouts for desktop and mobile.

Public sign-up creates an Employee account. Admins can create accounts with any supported role.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Neon PostgreSQL using `@neondatabase/serverless`
- Auth.js v5 Credentials provider with JWT sessions and role-based access
- Zod validation
- Vercel deployment

## Access instructions

Sign in at `/login` with credentials provided privately by the instructor. Authentication uses **Auth.js v5** with the Credentials provider, not Clerk. Do not publish demo passwords in this repository.

1. As an Employee, browse products, submit a stock count, and check its status under **My Stock Reports**.
2. As an Admin, create or update a disposable product or user, remove it, and review submitted counts under **Stock Reports**.
3. As an Owner, review the dashboard and the stock-status, low-stock, employee, and transaction-history reports.

## Local setup

The Next.js app is in the `inventoryhub/` subdirectory. From the repository root:

```bash
cd inventoryhub
npm ci
```

Create `inventoryhub/.env.local` with:

```dotenv
DATABASE_URL=your_neon_postgresql_connection_string
AUTH_SECRET=your_random_secret_at_least_32_characters_long
```

Keep `.env.local` private and do not commit it. The Neon database must have the baseline `public.users` and `public.products` tables expected by the app. Apply the checked-in migrations, in order, in the Neon SQL Editor:

1. `inventoryhub/database/migrations/001_inventory_transactions.sql`
2. `inventoryhub/database/migrations/002_employee_stock_reports.sql`

The migrations add inventory audit history and employee stock reports; they do not create the baseline `users` and `products` tables.

Start the development server from the `inventoryhub/` directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Available checks include `npm run lint` and `npm run build`; run `npm run build` before `npm run start`.

## Deployment

In Vercel, set **Root Directory** to `inventoryhub`, then configure `DATABASE_URL` and `AUTH_SECRET` for the deployment environment. Confirm the Neon baseline tables exist and both migrations have been applied, then deploy. Environment variable changes require a new deployment.

## Application routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/signup`, `/login` | Public | Registration and sign-in |
| `/products` | Employee, Admin | Browse inventory; Admins can manage products |
| `/products/new`, `/products/[id]/edit` | Admin | Create and update products |
| `/users`, `/users/new`, `/users/[id]`, `/users/[id]/edit` | Admin | Manage user accounts |
| `/reports/new`, `/reports/mine` | Employee | Submit stock counts and view report history |
| `/reports` | Admin, Owner | Review stock-count reports |
| `/owner/dashboard` | Owner | Inventory overview |
| `/owner/reports/stock-status` | Owner | Stock totals and inventory value |
| `/owner/reports/low-stock` | Owner | Products below their restock threshold |
| `/owner/reports/employees` | Owner | Employee directory |
| `/owner/reports/transaction-history` | Owner | Inventory audit history |

## API routes

Product, user, and stock-report changes use authenticated Next.js Server Actions rather than REST endpoints.

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/signup` | `POST` | Creates a public Employee account from `name`, `email`, and `password`. |
| `/api/auth/[...nextauth]` | `GET`, `POST` | Auth.js handlers for authentication and session actions; Credentials are checked against the Neon `users` table. |

## Known issues and opportunities

- The repository has no automated test script or checked-in baseline schema/seed script. A new database needs the baseline `users` and `products` tables before migrations can be applied.
- Password hashes use the existing fast, unsalted hashing format; migration to a salted password-hashing algorithm is a security improvement to plan.
- The low-stock threshold is fixed, and product status is manually stored; per-product thresholds and derived status would better prevent inconsistencies.
- Auth.js v5 login, role redirects, protected routes, and logout have been smoke-tested locally. Set `AUTH_SECRET` in Vercel and verify the production deployment before grader testing.
- The app is in the `inventoryhub/` subdirectory; keep Vercel’s Root Directory set to `inventoryhub`.

## Contributors and workflow

The team uses feature branches and pull requests for changes. See the repository’s merged pull-request history for evidence of the workflow.
