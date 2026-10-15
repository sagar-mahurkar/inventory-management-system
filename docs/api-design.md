# Inventory Management System — API Design

## Base Path and Scope

Base path: `/api/v1`. Authentication is excluded from the approved MVP.

## Response Conventions

Successful resource responses use a `data` envelope. List endpoints include pagination metadata alongside the items. Errors use the common API error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data"
  }
}
```

## Categories

| Method | Path | Purpose | Success |
|---|---|---|---:|
| GET | `/categories` | List categories | 200 |
| POST | `/categories` | Create category | 201 |
| GET | `/categories/:id` | Retrieve category | 200 |
| PATCH | `/categories/:id` | Update category | 200 |
| DELETE | `/categories/:id` | Delete category with no products | 204 |

Category names are required and unique. Deletion is rejected while products reference the category.

## Products

| Method | Path | Purpose | Success |
|---|---|---|---:|
| GET | `/products` | List, search, and filter products | 200 |
| POST | `/products` | Create product | 201 |
| GET | `/products/:id` | Retrieve product | 200 |
| PATCH | `/products/:id` | Update product metadata | 200 |
| DELETE | `/products/:id` | Delete product without movement history | 204 |

Supported query parameters: `category_id`, `search`, `low_stock=true|false`, `limit` (1–100, default 20), and `offset` (default 0).

`current_stock` is not editable through product create/update requests. New products start at zero stock; stock changes are recorded through inventory movements.

## Inventory Movements

| Method | Path | Purpose | Success |
|---|---|---|---:|
| GET | `/inventory-movements` | List movement history | 200 |
| POST | `/inventory-movements` | Record stock-in or stock-out | 201 |

Supported query parameters: `product_id`, `movement_type`, `limit`, and `offset`. `movement_type` must be `STOCK_IN` or `STOCK_OUT`; quantity must be a positive integer.

Stock updates and movement insertion are intended to execute in one database transaction. The product row is locked during the operation, and stock-out is rejected if available stock is insufficient. Failed operations must not change stock or create a movement record. PostgreSQL-backed integration verification is deferred; see [`testing-strategy.md`](testing-strategy.md).

## Summary and Aggregation

| Method | Path | Purpose | Success |
|---|---|---|---:|
| GET | `/summary` | Return category/product counts, total units in stock, total inventory value, low-stock count, and out-of-stock count | 200 |
| GET | `/summary/movements` | Return movement counts and total quantities for stock-in and stock-out | 200 |

Summary endpoints are read-only. Aggregation logic belongs in repository/service layers, not routes. Counts and quantities are returned as numbers. `total_inventory_value` is returned as a decimal string to avoid JavaScript floating-point precision loss. Empty tables should return zero-valued aggregates.

## Common Status Codes

- `400` — invalid input or invalid category reference
- `404` — category or product not found
- `409` — duplicate category name/SKU, category in use, product with movement history, or insufficient stock
- `500` — unexpected server error

## Scope Exclusions

These endpoints do not introduce authentication, user accounts, warehouses, suppliers, or orders.

## Contract Maintenance

This document describes the intended API contract. When implementation changes, update this document and the relevant tests together. Verify endpoint paths, response envelopes, status codes, and query parameter names against the source before extending the API.
