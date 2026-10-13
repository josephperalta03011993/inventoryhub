# InventoryHub

InventoryHub is a web-based inventory management system for small businesses and organizations. It centralizes product and stock records and gives employees, administrators, and owners tools suited to their responsibilities.

**Live application:** [https://inventoryhub-one.vercel.app](https://inventoryhub-one.vercel.app)

**Repository:** [josephperalta03011993/inventoryhub](https://github.com/josephperalta03011993/inventoryhub)

## Access instructions

Sign in at `/login` with an account provided by the instructor. Authentication is implemented with **Auth.js v5** and its Credentials provider; it is not using Clerk. Public sign-up creates Employee accounts. Admin and Owner demo credentials should be provided to the grader privately rather than committed to this public repository.

After signing in, test the role-specific flows:

1. As an Employee, browse products, submit a stock count, and check its status under **My Stock Reports**.
2. As an Admin, create or update a disposable product or user, then remove it; review submitted counts from **Stock Reports**.
3. As an Owner, review the dashboard and the stock status, low-stock, employee, and transaction-history reports.

## Team

- Joseph Peralta
- Bruce Nyeha
- Bryton Palmer

## Product demo summary

Small teams often track inventory in spreadsheets or on paper, which makes it hard to keep counts accurate and to see which items need attention. InventoryHub provides a shared, database-backed inventory so staff can view current products and owners can monitor stock levels, low-stock items, and inventory activity.

Employees can submit stock counts and check whether they have been reviewed. Administrators manage products and user accounts and review submitted counts; owners use the dashboard and reports to oversee inventory and activity. This role-based workflow keeps routine stock reporting connected to the inventory record and its audit history.

## Features

- Sign up and sign in with role-based access for Employees, Admins, and Owners.
- Browse products and stock details.
- Admin product CRUD: add, view, edit, and delete products.
- Admin user CRUD: create, view, edit, and delete user accounts.
- Employee stock-count reports with review status.
- Admins and Owners can approve or reject stock-count reports; approval updates product stock and creates an audit entry.
- Owner dashboard, stock-status and low-stock reports, employee directory, and transaction history.
- Responsive layouts for desktop and mobile.

Public sign-up creates an Employee account. Admins can create accounts with any supported role.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Neon PostgreSQL using `@neondatabase/serverless`
- Auth.js v5 Credentials provider, JWT sessions, and role-based access
- Zod validation
- Vercel deployment

## Local setup

The Next.js project is in the `inventoryhub/` directory of the repository. Run these commands from that directory:

```bash
npm ci
```

Create an `.env.local` file in `inventoryhub/` with:

```dotenv
DATABASE_URL=your_neon_postgresql_connection_string
AUTH_SECRET=your_random_secret_at_least_32_characters_long
```

Use a Neon connection string for `DATABASE_URL`. Generate a unique secret for `AUTH_SECRET`; for example, with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Do not commit `.env.local` or share its values. The database must already contain the `public.users` and `public.products` tables expected by the application. This repository does not include a baseline schema or seed script for those tables.

Apply the checked-in database migrations to the same Neon database, in order:

1. `database/migrations/001_inventory_transactions.sql`
2. `database/migrations/002_employee_stock_reports.sql`

For a new database, first provision the baseline `users` and `products` tables with the columns used by the application; the two checked-in migrations add audit history and employee stock reports, not those baseline tables. You can run each migration in the Neon SQL Editor.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Available project commands:

```bash
npm run lint
npm run build
npm run start
```

`npm run start` serves the production build; run `npm run build` first.

## Deployment (Vercel)

1. Import the repository into Vercel.
2. Set **Root Directory** to `inventoryhub` (the directory containing this `package.json`).
3. Add `DATABASE_URL` and `AUTH_SECRET` in the Vercel project’s environment variables for the environments you deploy.
4. Confirm the Neon database has its baseline `users` and `products` tables and that both checked-in migrations have been applied.
5. Deploy. Vercel uses the Next.js framework settings and the `build` script from `package.json`.

The current live deployment is [inventoryhub-one.vercel.app](https://inventoryhub-one.vercel.app).

## Application routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/signup`, `/login` | Public | Account registration and sign-in |
| `/products` | Employee, Admin | Browse inventory; Admins also get product-management actions |
| `/products/new`, `/products/[id]/edit` | Admin | Create and update products |
| `/users`, `/users/new`, `/users/[id]`, `/users/[id]/edit` | Admin | Manage user accounts |
| `/reports/new`, `/reports/mine` | Employee | Submit stock counts and view their report history |
| `/reports` | Admin, Owner | Review submitted stock counts |
| `/owner/dashboard` | Owner | Inventory overview |
| `/owner/reports/stock-status` | Owner | Stock totals and inventory value |
| `/owner/reports/low-stock` | Owner | Products below their restock threshold |
| `/owner/reports/employees` | Owner | Employee directory |
| `/owner/reports/transaction-history` | Owner | Inventory audit history |

## API routes

These are the implemented HTTP route handlers. Product, user, and stock-report changes are performed through authenticated Next.js Server Actions, not through REST endpoints.

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/signup` | `POST` | Creates a public Employee account. Accepts JSON with `name`, `email`, and `password`. |
| `/api/auth/[...nextauth]` | `GET`, `POST` | Auth.js v5 handlers for sign-in, sign-out, session, and related authentication actions. The Credentials provider verifies accounts against the existing Neon `users` table. |

## Database behavior

- `public.users` stores account identity, role, and password hash.
- `public.products` stores product and stock information.
- `public.inventory_transactions` records inventory changes. Product deletion preserves history and sets the related product reference to `NULL`.
- `public.employee_stock_reports` stores employee-submitted counts and their review status.
- Approving a stock report updates the product quantity and records the change in transaction history.

## Verification and known issues

- Before the Auth.js migration, production smoke testing on October 14, 2026 verified sign-up, role-based access, login/logout, and create/read/update/delete flows for users and products. Temporary test users and the temporary product were deleted afterward; the product’s audit-history entry was retained by design.
- The Auth.js v5 migration was smoke-tested locally on October 14, 2026: Employee, Admin, and Owner sign-in, role redirects, protected routes, and logout passed. Deploy this version and set `AUTH_SECRET` in Vercel before asking graders to test the hosted application.
- A mobile PageSpeed Insights lab run on October 14, 2026 scored **99 Performance**, **100 Accessibility**, **100 Best Practices**, and **100 SEO** for the live site. [View the report](https://pagespeed.web.dev/analysis/https-inventoryhub-one-vercel-app/1pc2qi03ud?form_factor=mobile). Lab scores can vary between runs and do not replace manual accessibility testing.
- The repository currently has no automated test script or checked-in baseline schema/seed script. Configure the database and run the migrations before starting a new deployment.
- Next.js may report a multiple-lockfile/workspace-root warning because the app is in the `inventoryhub/` subdirectory. Keep the Vercel Root Directory set to `inventoryhub` and check the build output if the warning appears.
- Public sign-up intentionally assigns the Employee role; elevated roles must be provisioned by an Admin.
- Authentication uses Auth.js v5 with the Credentials provider and JWT sessions; it does not use Auth.js database persistence or Clerk. Set `AUTH_SECRET` locally and in Vercel before signing in. For migration compatibility only, the configuration can fall back to an existing `JWT_SECRET`; prefer setting `AUTH_SECRET`. Existing sessions from the previous custom-cookie implementation are invalidated and users must sign in again.

## Contributors and workflow

The team uses feature branches and pull requests for changes. See the repository’s merged pull-request history for the project workflow.
