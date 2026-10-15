# Inventory Management System — MVP Requirements

## 1. Project Classification

- **Classification:** Small MVP
- **Stack:** Node.js, Express, TypeScript, React, and Vite
- **Database:** PostgreSQL
- **Project status:** Complete for the agreed MVP scope; see [`project-completion.md`](project-completion.md).
- **Scope principle:** Deliver the smallest maintainable system that supports basic product and stock management.

## 2. Problem Statement

Provide a simple interface to maintain products and categories, record stock entering and leaving inventory, view current stock levels, identify low-stock products, and review inventory movement history.

## 3. Target User and MVP Boundary

The MVP is designed for a single inventory operator.

The following are outside the agreed MVP scope: multi-user accounts, authentication and roles, per-user data isolation, warehouses, suppliers, purchase orders, sales orders, and production deployment.

## 4. Functional Requirements

### FR-1: Product Management

- Create products with a name, SKU, category, unit price, and reorder threshold.
- View product lists and individual product details.
- Update product details.
- Delete a product only when it has no inventory movement history; otherwise, prevent deletion to preserve the audit trail.
- Enforce unique SKUs.

### FR-2: Category Management

- Create, list, update, and delete categories.
- Enforce unique category names.
- Prevent deleting a category while products are assigned to it.

### FR-3: Stock-In

- Record received stock using a positive quantity.
- Optionally record a note or reference.
- Increase current stock and create an inventory movement record as one atomic operation.

### FR-4: Stock-Out

- Record issued or removed stock using a positive quantity.
- Reject a stock-out that would make current stock negative.
- Decrease current stock and create an inventory movement record as one atomic operation.

### FR-5: Current Stock

- Display each product's current stock quantity, including zero-stock products.
- Do not allow ordinary product create/update operations to edit stock directly. Stock changes go through stock-in and stock-out operations.

### FR-6: Low-Stock Indicators

- Define low stock as `current_stock <= reorder_level`.
- Display the low-stock state in the product list and/or dashboard.
- A reorder level of zero is valid; only zero-stock products meet that threshold.

### FR-7: Inventory Movement History

- List stock-in and stock-out movements with product, movement type, quantity, timestamp, and optional note/reference.
- Show newest movements first.
- Preserve movement history; movements are not edited or deleted through the MVP UI.

## 5. Non-Functional Requirements

- Validate request data on the backend; frontend validation is for usability only.
- Enforce SKU/category uniqueness and valid quantities at the database/application boundary.
- Keep a stock update and its movement record in one database transaction.
- Prevent negative stock, including under concurrent stock-out requests.
- Return consistent HTTP status codes and clear error messages.
- Keep secrets out of source control and provide a safe `.env.example`.
- Use parameterized queries or an ORM.
- Keep the implementation simple and avoid infrastructure not required by the MVP.

## 6. MVP Screens

1. Product list with stock quantities and low-stock indicators.
2. Product create/edit form.
3. Category management.
4. Stock-in/stock-out form.
5. Inventory movement history.
6. Basic inventory and movement summaries.

Search and filtering are included where implemented. Advanced analytics are outside the MVP.

## 7. Out of Scope

- Authentication, roles, and multi-tenant access
- Suppliers, purchase orders, and sales orders
- Barcode scanning
- Multiple warehouses/locations
- Batch/lot and serial-number tracking
- Product images and file uploads
- Stock transfers between locations
- Notifications/email alerts
- Forecasting and advanced reporting
- Import/export and third-party integrations
- Redis, background workers, microservices, and complex deployment infrastructure
- Production deployment

## 8. Acceptance Criteria and Completion Notes

The MVP implementation and manual browser-based E2E verification were reported complete. Backend automated tests, type-checking, and build checks passed. The frontend type-check, lint, and build passed during Phase 12. Real PostgreSQL integration tests remain deferred, so database-level rollback, constraints, and concurrent-request behavior are not claimed as independently verified by the mocked tests.

- [x] Core product and category workflows implemented and browser-verified.
- [x] Stock-in/stock-out workflows and movement history included in the MVP and browser-verified.
- [x] Dashboard and movement summaries included.
- [x] Backend automated test suite passes: 35 tests across 7 suites.
- [x] Backend type-check and production build pass.
- [x] Frontend type-check, lint, and production build passed in Phase 12.
- [x] Browser-based E2E testing reported complete for Phase 13.
- [x] Documentation reviewed for final project handoff.
- [ ] PostgreSQL-backed integration tests: deferred; see [`testing-strategy.md`](testing-strategy.md).

## 9. Key Deliverables

- `docs/requirements.md` — agreed MVP scope and acceptance contract
- `docs/database-design.md` — entities, relationships, constraints, indexes, and transaction rules
- `docs/api-foundation.md` — HTTP foundation and error conventions
- `docs/api-design.md` — feature API contract
- `docs/testing-strategy.md` — test layers, commands, and verification limits
- `docs/project-completion.md` — final status and known limitations
- Backend, frontend, PostgreSQL data model, inventory workflows, automated tests, and manual E2E verification

## 10. Scope Control

Features outside FR-1 through FR-7 are deferred unless the MVP scope is explicitly changed. Data integrity and stock transaction safety take precedence over optional UI polish.
