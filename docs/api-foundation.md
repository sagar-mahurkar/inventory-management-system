# API Foundation

## Scope

This document describes the HTTP/API infrastructure for the Inventory Management System MVP. Authentication and authorization are not part of the agreed MVP.

## Base path

Feature APIs are mounted under `/api/v1`.

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

This endpoint indicates that the HTTP application is responding. It is not a database-readiness check.

## Error response format

Errors use the following structure:

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

Unexpected errors should return a generic client-facing message; implementation details belong in server-side logs.

## Middleware order

The Express application applies security headers, CORS, JSON body parsing, the health route, versioned API routes, the not-found handler, and then the centralized error handler. Keep this order aligned with the implementation.

## Out of scope

- User registration and login
- JWT authentication
- Roles and permissions
- Multi-tenant access control
