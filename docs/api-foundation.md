# API Foundation

## Scope

This document describes the API infrastructure for the Inventory Management System MVP. It does not introduce authentication or feature-specific endpoints.

## Base path

Versioned feature APIs are mounted under `/api/v1`. Feature routes will be registered through `backend/src/routes/index.ts` in later phases.

## Health check

- **Method:** `GET`
- **Path:** `/health`
- **Success status:** `200 OK`
- **Response:**

```json
{
  "status": "ok"
}
```

This endpoint reports that the HTTP application is responding. It is not a database-readiness check.

## Error response format

Errors use this structure:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found."
  }
}
```

The `code` and `message` values depend on the error.

| Condition | HTTP status | Code |
|---|---:|---|
| Unknown route | 404 | `NOT_FOUND` |
| Malformed JSON request body | 400 | `INVALID_JSON` |
| Known application error | Defined by the error | Defined by the error |
| Unexpected error | 500 | `INTERNAL_SERVER_ERROR` |

Unexpected errors return a generic client-facing message; implementation details are logged server-side.

## Middleware order

The Express application applies security headers, CORS, JSON body parsing, the health route, versioned API routes, the not-found handler, and then the centralized error handler.

## Out of scope

- User registration and login
- JWT authentication
- Roles and permissions
- Inventory feature endpoints, which belong to later phases
