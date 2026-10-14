# Inventory Management System API Design

Base path: `/api/v1`. Authentication is excluded from the approved MVP.

## Response conventions

Successful resource responses use `{ "data": ... }`. List endpoints return pagination metadata alongside the items. Errors use the existing API error format:

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

## Inventory movements

| Method | Path | Purpose | Success |
|---|---|---|---:|
| GET | `/inventory-movements` | List movement history | 200 |
| POST | `/inventory-movements` | Record stock-in or stock-out | 201 |

Supported query parameters: `product_id`, `movement_type`, `limit`, and `offset`. `movement_type` must be `STOCK_IN` or `STOCK_OUT`; quantity must be a positive integer.

Stock updates and movement insertion execute in one database transaction. A product row is locked during the operation, and stock-out is rejected if the available balance is insufficient. Failed operations must not change stock or create a movement record.

## Common status codes

- `400` — invalid input or invalid category reference
- `404` — category or product not found
- `409` — duplicate category name/SKU, category in use, product with movement history, or insufficient stock
- `500` — unexpected server error

## Scope exclusions

No authentication, user accounts, warehouses, suppliers, or orders are introduced by these endpoints.
