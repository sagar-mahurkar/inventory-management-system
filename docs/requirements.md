# Inventory Management System — MVP Requirements

## 1. Project Classification

- **Classification:** Small MVP
- **Stack:** Node.js backend + React frontend
- **Database:** PostgreSQL (proposed relational database; confirm during setup)
- **Delivery target:** Six hours across Phases 0–14
- **Scope principle:** Deliver the smallest reliable system that supports basic product and stock management.

## 2. Problem Statement

Provide a simple interface to maintain products and categories, record stock entering and leaving inventory, view current stock levels, identify low-stock products, and review inventory movement history.

## 3. Target User

A single inventory operator who manages the product catalogue and records stock movements.

**MVP boundary:** Multi-user accounts, roles, and per-user data isolation are excluded unless later requirements explicitly require them.

## 4. Functional Requirements

### FR-1: Product Management
- Create a product with a name, SKU, category, unit price, and reorder threshold.
- View a product list and individual product details.
- Update product details.
- Delete a product only when it has no inventory movement history; otherwise, prevent deletion to preserve the audit trail.
- SKU must be unique.

### FR-2: Category Management
- Create, list, update, and delete categories.
- Category names must be unique.
- Prevent deleting a category while products are assigned to it; require reassignment or removal of those products first.

### FR-3: Stock-In
- Record stock received for a product using a positive quantity.
- Optionally record a note/reference.
- Increase current stock and create an inventory movement record as one atomic operation.

### FR-4: Stock-Out
- Record stock issued/removed for a product using a positive quantity.
- Reject a stock-out that would make current stock negative.
- Decrease current stock and create an inventory movement record as one atomic operation.

### FR-5: Current Stock
- Display each product's current stock quantity.
- Display products with zero stock.
- Stock quantity must not be directly editable through ordinary product create/update operations; it changes through stock-in and stock-out operations.

### FR-6: Low-Stock Indicators
- Mark a product as low stock when `current_stock <= reorder_level`.
- Display the low-stock state in the product list and/or dashboard.
- A reorder level of zero is valid and means only zero-stock products meet the threshold.

### FR-7: Inventory Movement History
- List stock-in and stock-out movements with product, movement type, quantity, timestamp, and optional note/reference.
- Show newest movements first.
- Preserve movement history; movements are not edited or deleted through the MVP UI.

## 5. Non-Functional Requirements

- Validate request data on the backend; frontend validation is for usability only.
- Enforce SKU/category uniqueness and valid quantities at the database/application boundary.
- Use database transactions so a stock update and its movement record either both succeed or both fail.
- Prevent negative stock, including when concurrent stock-out requests occur.
- Return consistent HTTP status codes and clear error messages.
- Keep credentials and secrets out of source control; use `.env` and commit a safe `.env.example`.
- Use parameterized queries or an ORM.
- Keep the code structure simple and maintainable; avoid infrastructure not required by this MVP.

## 6. MVP Screens

1. Products list with search/filter only if time permits, stock quantity, and low-stock indicator.
2. Product create/edit form.
3. Category management.
4. Stock-in/stock-out form.
5. Inventory movement history.

A separate analytics dashboard is optional; basic counts/low-stock summary may be included only if core workflows are complete.

## 7. Out of Scope

- Authentication, roles, and multi-tenant access
- Suppliers, purchase orders, and sales orders
- Barcode scanning
- Multiple warehouses/locations
- Batch/lot and serial-number tracking
- Product images and file uploads
- Stock transfers between locations
- Notifications/email alerts
- Forecasting, advanced reports, and charts
- Import/export and integrations
- Redis, background workers, microservices, and complex deployment infrastructure
- Production deployment unless separately required

## 8. Acceptance Criteria

- [ ] A product can be created, viewed, updated, and safely deleted under the stated history rule.
- [ ] Categories can be managed and duplicate names are rejected.
- [ ] A stock-in operation increases stock and creates exactly one movement record.
- [ ] A valid stock-out operation decreases stock and creates exactly one movement record.
- [ ] A stock-out exceeding available stock is rejected and leaves stock/history unchanged.
- [ ] Current stock is visible in the product list.
- [ ] Low-stock status follows `current_stock <= reorder_level`.
- [ ] Movement history displays type, quantity, product, timestamp, and note/reference.
- [ ] Stock updates and movement records are transactionally consistent.
- [ ] Core workflows are manually verified and essential backend tests pass.
- [ ] README setup instructions and `.env.example` are current.
- [ ] Git workflow and phase completion requirements are followed.

## 9. Key Deliverables

- `docs/requirements.md` — this scope and acceptance contract
- `docs/database-design.md` — proposed entities, relationships, constraints, and indexes
- Node.js backend and React frontend foundations
- PostgreSQL schema/models and reproducible schema setup
- Product, category, stock movement, and current-stock workflows
- Essential backend tests and end-to-end manual verification
- README and environment example

## 10. Scope Control

Any feature not required by FR-1 through FR-7 is deferred unless an explicit change to MVP scope is approved. If the six-hour target is at risk, reduce optional UI polish and search functionality before weakening data integrity, stock transaction safety, or required Git workflow.
