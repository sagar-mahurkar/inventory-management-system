# Inventory Management System — Testing Strategy

## 1. Purpose

Define the MVP verification approach. Test depth is based on risk and criticality; the goal is reliable behavior, not an arbitrary coverage percentage.

## 2. Test Stack

- Jest for unit and API contract tests.
- Supertest for HTTP-level tests against the Express application.
- TypeScript compiler for type checking and build verification.
- PostgreSQL-backed integration tests are a deferred improvement and should use a dedicated test database when introduced. Never point destructive test setup at development or production data.

## 3. Test Layers and Current Results

### Application and API Contract Tests

These tests cover the application foundation and request/response contracts, including health checks, unknown routes, malformed JSON, validation boundaries, pagination values, and summary response contracts.

### Service Unit Tests

Mocked service tests cover category, product, inventory movement, and summary behavior. Inventory movement tests cover stock-in/out decisions, insufficient stock handling, missing products, persistence errors, and the request for a pessimistic write lock.

These tests verify service decisions and interactions. They do not prove actual PostgreSQL persistence, rollback, constraint enforcement, or concurrent-request behavior.

### Recorded Backend Verification

Phase 13 results reported by the project owner:

- **Jest:** 7 suites passed; 35 tests passed.
- **Type-check:** `npm run typecheck` passed.
- **Production build:** `npm run build` passed.

Frontend checks reported as passing during Phase 12:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Browser-based end-to-end testing was reported complete for Phase 13. The documentation does not claim a specific automated browser-test framework or test report.

## 4. Deferred PostgreSQL Integration Tests

When a dedicated PostgreSQL test database is configured, add integration coverage for:

- A successful stock movement updates the product and inserts exactly one movement row.
- Insufficient stock leaves stock and movement history unchanged.
- A movement insert failure rolls back the stock update.
- Concurrent stock-out requests cannot drive stock below zero.
- Foreign-key, uniqueness, CHECK constraints, and delete restrictions behave as designed.
- Summary aggregations return correct values for populated and empty tables.

Do not describe these database behaviors as verified until tests have run against PostgreSQL.

## 5. Verification Commands

Run from `backend/`:

```bash
npm test -- --runInBand
npm run typecheck
npm run build
```

Run from `frontend/`:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

If a code or dependency change affects a layer, rerun that layer's checks. The frontend results above were recorded in Phase 12; they are not presented as a fresh Phase 14 run.

## 6. Completion and Known Limits

The project owner reported the Phase 13 backend test, type-check, build, and browser E2E work complete. Real PostgreSQL integration tests remain deferred. Consequently, mocked tests must not be represented as proof of transaction rollback, actual database constraints, or concurrency safety.
