Joseph Peralta
Bruce Nyeha
Erandy Ramirez

InventoryHub: Simple Inventory Management System

Description
InventoryHub is a web-based inventory management system designed for small businesses and organizations to track products and stock levels efficiently. The system allows employees to update inventory records, administrators to manage products and users, and owners to monitor inventory status and reports. It helps improve inventory accuracy and reduce manual record-keeping.
 
Problem or Need
Many small businesses still manage inventory using spreadsheets or paper records, making it difficult to track stock levels accurately and efficiently.
 
Core Features
User authentication with role-based access (Employee, Admin, Owner)
Create, Read, Update, and Delete (CRUD) inventory items
Stock quantity tracking and updates
User management for Admins
Inventory dashboard and summary reports for Owners

## Project Constitution 
Governing Principles for InventoryHub

1. TypeScript Standards
Strict mode enabled ("strict": true in tsconfig.json).

No use of any; prefer unknown, generics, or discriminated unions.

Strong typing for API responses, props, and state.

Utility types (Partial, Pick, Omit) used for clarity, not shortcuts.

Consistent use of interface for contracts and type for unions.

2. Tailwind CSS Conventions
Utility-first approach: styling via Tailwind classes, not custom CSS.

Avoid @apply unless for reusable component patterns.

No custom CSS unless Tailwind cannot achieve the design.

Use Tailwind configuration (tailwind.config.js) for theme extensions (colors, spacing, typography).

Responsive design via Tailwind’s breakpoint utilities (sm:, md:, lg:).

3. Next.js Patterns
App Router: use app/ directory with file-based routing.

Server Components: default to server components for data fetching and rendering.

Client Components: only when interactivity or hooks (useState, useEffect) are required.

Data fetching: prefer fetch in server components; use caching and revalidation (revalidate).

API routes: colocated in app/api/ with proper typing.

Error handling: use error.tsx and loading.tsx conventions.

4. Testing Expectations
Unit tests with Jest and React Testing Library.

Integration tests for API routes and database interactions.

End-to-end tests with Playwright or Cypress.

80% minimum coverage enforced via CI.

Snapshot testing for UI components.

Mocking external services (e.g., database, APIs).

5. Naming Conventions
Files & folders: kebab-case (inventory-list.tsx).

Components: PascalCase (InventoryCard.tsx).

Variables & functions: camelCase (updateStockLevel).

Types & interfaces: PascalCase with Props or Type suffix (InventoryItemProps).

Constants: UPPER_SNAKE_CASE (MAX_STOCK_LIMIT).

Tests: mirror file structure with .test.tsx suffix.

6. Team Collaboration Guidelines
Git workflow: feature branches → pull requests → code review → merge.

Commit messages: Conventional Commits (feat:, fix:, chore:).

Code reviews: mandatory for all merges; focus on readability, maintainability, and adherence to standards.

Documentation: inline JSDoc for complex functions; README updates for major changes.

Agile practices: sprint planning, daily standups, retrospectives.

Knowledge sharing: regular demos, pair programming encouraged.

CI/CD: automated linting, testing, and deployment pipelines.

##  Project specification
Project Specification: InventoryHub
1. Title & Description
Title: InventoryHub

Description: A web-based inventory management system built with Next.js (App Router), TypeScript, and Tailwind CSS. Designed for small businesses and organizations to track products, manage stock levels, and streamline record-keeping.

2. Purpose & Target Audience
Purpose: Improve inventory accuracy, reduce manual record-keeping, and provide real-time visibility into stock levels.

Target Audience:

Employees: Update inventory records.

Administrators: Manage products, categories, and users.

Owners: Monitor inventory status, generate reports, and oversee operations.

3. User Stories & Acceptance Criteria
🟢 Sign Up
User Story: As a new user, I want to sign up with my email and password so I can access InventoryHub.

Acceptance Criteria:

User can register with email, password, and role (employee/admin/owner).

Password must meet security requirements (min length, complexity).

Confirmation email sent after registration.

📦 Create (Add Product)
User Story: As an administrator, I want to add new products so they can be tracked in the system.

Acceptance Criteria:

Product form includes name, SKU, category, quantity, and price.

Validation ensures required fields are filled.

Product appears in inventory list immediately after creation.

📖 Read (View Inventory)
User Story: As an employee, I want to view the inventory list so I can check stock levels.

Acceptance Criteria:

Inventory list displays product name, SKU, quantity, and status (in stock, low stock, out of stock).

Search and filter options available.

Pagination for large datasets.

✏️ Update (Edit Product)
User Story: As an administrator, I want to update product details so inventory stays accurate.

Acceptance Criteria:

Editable fields: name, category, quantity, price.

Changes saved and reflected immediately.

Audit log records updates.

🗑️ Delete (Remove Product)
User Story: As an administrator, I want to delete products so outdated items are removed.

Acceptance Criteria:

Delete action requires confirmation.

Deleted products no longer appear in inventory list.

Audit log records deletion.

4. API Endpoints
Endpoint	Method	Description
/api/auth/signup	POST	Register new user
/api/auth/login	POST	Authenticate user
/api/products	GET	Fetch product list
/api/products/:id	GET	Fetch single product
/api/products	POST	Create new product
/api/products/:id	PUT	Update product
/api/products/:id	DELETE	Delete product
/api/reports	GET	Generate inventory reports


5. Implementation Priority
Authentication & Authorization

User roles (employee/admin/owner).

Secure login & signup.

Core CRUD for Products

Create, Read, Update, Delete workflows.

Inventory Dashboard

Stock levels, search, filters, pagination.

Audit Logging

Track changes and deletions.

Reports & Analytics

Exportable summaries for owners.

User Management

Admins manage employee accounts.