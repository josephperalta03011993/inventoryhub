InventoryHub

InventoryHub is a web-based inventory management system designed for small businesses and organizations to track products and stock levels efficiently. Employees can view product and stock information, administrators can manage products and users, and owners can monitor inventory status and reports. It helps improve inventory accuracy and reduce manual record-keeping.

Problem: Many small businesses still manage inventory using spreadsheets or paper records, making it difficult to track stock levels accurately and efficiently.

Live demo: https://inventoryhub-nine.vercel.app/
Repository: https://github.com/josephperalta03011993/inventoryhub
Original project constitution and specification: docs/project-plan.md
Team
Name	Responsibility
Joseph Peralta	User management (Users CRUD)
Bruce Nyeha	 Auth and login
Erandy Ramirez  
Bryton Palmer	Owner dashboard and reports
Tech Stack
Framework: Next.js 16 (App Router) with React 19
Language: TypeScript
Styling: Tailwind CSS 4
Database: Neon (serverless PostgreSQL) via @neondatabase/serverless
Authentication: custom JWT sessions (jose) stored in an httpOnly cookie
Validation: Zod
Tooling: ESLint and Prettier
Hosting: Vercel
Features
Products: list, view, create, edit, and delete products (SKU, name, category, stock, price, status).
Users: list, view, create, edit, and delete accounts with three roles: Employee, Admin, and Owner.
Authentication: sign up, log in, and log out. Public sign-ups are always created as Employees.
Owner dashboard: stock value and low-stock overview, plus three reports:
Low stock (products at or below the restock threshold)
Stock status
Transaction history, filterable by date range and employee
Loading and error states on the owner pages, so a failed database query never looks like an empty report.
Getting Started
Prerequisites
Node.js 20 or newer
A free Neon account
1. Clone and install
bash
git clone https://github.com/josephperalta03011993/inventoryhub.git
cd inventoryhub/inventoryhub
npm install

(Run the commands in the folder that contains package.json.)

2. Create the database

Create a Neon project, open its SQL Editor, and run the following reference schema:

sql
CREATE TABLE products (
  id        SERIAL PRIMARY KEY,
  sku       TEXT NOT NULL UNIQUE,
  name      TEXT NOT NULL,
  category  TEXT NOT NULL,
  stock     INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price     NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  status    TEXT NOT NULL DEFAULT 'In Stock'
);

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'Employee'
    CHECK (role IN ('Employee','Admin','Owner')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inventory_transactions (
  id                 SERIAL PRIMARY KEY,
  product_id         INTEGER REFERENCES products(id) ON DELETE SET NULL,
  user_id            UUID REFERENCES users(id) ON DELETE SET NULL,
  transaction_type   TEXT NOT NULL
    CHECK (transaction_type IN ('stock_adjustment','restock','physical_count')),
  previous_quantity  INTEGER NOT NULL,
  new_quantity       INTEGER NOT NULL,
  quantity_change    INTEGER NOT NULL,
  reason             TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

For an existing database, run `./inventoryhub/database/migrations/001_inventory_transactions.sql` in the Neon SQL Editor. It creates the transaction-history table and indexes if needed, and records current product quantities as opening balances. It does not reconstruct stock changes made before the migration.

3. Configure environment variables

Create a file named .env.local in the project root (it is git-ignored):

DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
[JWT SECRET VARIABLE NAME]="a-long-random-string"

Copy the connection string from the Connect button in your Neon project.

4. Run the app
bash
npm run dev

Open http://localhost:3000.

5. Create the first Owner account
Sign up at /signup. New accounts are Employees.
In the Neon SQL Editor, promote your account:
sql
UPDATE users SET role = 'Owner' WHERE email = 'your-email@example.com';
Deployment

The app is deployed on Vercel.

Import the GitHub repository in Vercel (set the root directory to the folder containing package.json).
Add the same environment variables from .env.local under Settings → Environment Variables.
Deploy. Variables only apply to new builds, so redeploy after changing them.
Confirm that Deployment Protection allows public visitors to view the production site.
API Routes
Route	Method	Request body	Success response	Errors
/api/auth/signup	POST	{ name, email, password }	201 account created (role is always Employee)	400 invalid input, 409 email already registered
/api/auth/login	POST	{ email, password }	200 and sets the inventory_session cookie (2-hour expiry)	400 invalid input, 401 invalid credentials
/api/auth/logout	POST	—	200 and clears the inventory_session cookie	—

The original specification proposed REST endpoints under /api/products and /api/reports. In the implemented app, products, users, and reports are read in server components and changed through Server Actions, so the only route handlers are the authentication routes above.

The login and signup pages are client components that call these routes, which query the users table (client, then route handler, then database). Product, user, and report pages read from the database in server components, and create/update/delete operations use Server Actions.

Project Structure
app/
  api/auth/        login and signup route handlers
  lib/             database client (db.ts) and auth helpers (auth-utils.ts)
  products/        product list, detail, create, edit
  (admin)/users/   user management
  owner/           owner dashboard and reports
Test Accounts
Role	Email	Password
Owner	[email]	[password]
Admin	[email]	[password]
Employee	[email]	[password]
Product Demo

The problem. Small shops and warehouse teams often track stock in spreadsheets or on paper. Counts drift, nobody knows who changed what, and low stock is discovered only after a customer is turned away. InventoryHub gives a team one shared, always-current record of what is on hand and a log of every stock change.

The users. The app serves three kinds of people. Employees view products and stock information. Admins manage the product catalog and staff accounts. Owners review the business: how much stock value is on hand, which items need restocking, and who made which change and when.

The key flow. An owner signs in and lands on the dashboard, sees the low-stock count and total stock value at a glance, and opens the Low Stock report to decide what to reorder. From the Transaction History report they can filter by date range and employee to audit changes. The value is fewer stockouts, accountability for every adjustment, and decisions based on live data instead of guesswork.

Known Issues and Opportunities
Password hashing: passwords are hashed with a fast, unsalted method (app/lib/auth-utils.ts). Planned follow-up: switch to bcrypt, argon2, or scrypt with a per-user salt.
Low-stock threshold: the threshold is a fixed value of 10 for every product. A per-product restock level would be more realistic.
Product status: the status label is entered manually and can disagree with the stock count. Deriving it from stock would remove the inconsistency.
Error handling: the product and user list pages log database errors and show an empty list. Showing an explicit error state, as the owner pages do, would be clearer.
Automated tests: the original plan called for Jest, React Testing Library, and end-to-end tests with a coverage target. No automated test suite has been set up yet.
Signup roles: the original specification let users choose a role at sign-up. For security, public sign-ups are now always Employees, and Admins or Owners are assigned by an existing Owner or Admin.
