# Inventory Management System — Testing Strategy

## 1. Purpose

Define the backend verification approach for the MVP. Testing depth is based on risk and criticality; the goal is reliable behavior, not an arbitrary coverage percentage.

## 2. Test Stack

- Jest for unit and API contract tests.
- Supertest for HTTP-level tests against the Express application.
- TypeScript compiler for type checking and build verification.
- PostgreSQL-backed integration tests should use a dedicated test database when added; never point destructive test setup at development or production data.

## 3. Current Test Layers

### Application and API contract tests

Verify:
- Health endpoint success.
- Consistent 404 and malformed JSON responses.
- Request validation for categories, products, and inventory movements.
- Rejection of unknown fields and invalid pagination values.
- Summary endpoint response contracts.

These tests do not require a live database when invalid requests are rejected by middleware or the summary service is mocked.

### Inventory movement service unit tests

Verify:
- Stock-in increments stock and records a movement.
- Stock-out decrements stock when sufficient stock exists.
- Insufficient stock returns a conflict and does not call stock/movement persistence methods.
- Missing products return a not-found error.
- Movement persistence errors propagate to the transaction caller.
- The service requests a pessimistic write lock for the product row.

These tests mock the TypeORM transaction manager. They verify service decisions and calls, but do not prove PostgreSQL transaction rollback or concurrent-request behavior.

## 4. Critical Database Integration Tests

When a dedicated PostgreSQL test database is configured, add integration coverage for:
- A successful stock movement updates the product and inserts exactly one movement row.
- Insufficient stock leaves both stock and movement history unchanged.
- A movement insert failure rolls back the stock update.
- Concurrent stock-out requests cannot drive stock below zero.
- Foreign-key, uniqueness, CHECK constraints, and delete restrictions behave as designed.
- Summary aggregations return correct values for populated and empty tables.

Do not describe these database behaviors as verified until tests run against PostgreSQL.

## 5. Verification Commands

Run from `backend/`:

```bash
npm run typecheck
npm test
npm run build
```

All commands must pass before submitting the Phase 9 pull request. Review failures and fix root causes rather than weakening validation or assertions.

## 6. Phase 9 Acceptance Criteria

- Existing tests remain green.
- Service tests cover stock movement success, insufficient stock, missing product, and persistence failure.
- API contract tests cover important validation boundaries.
- Typecheck, complete Jest suite, and build pass.
- Known verification limits are documented; mocked tests are not presented as live database integration tests.
