# Inventory Management System — Frontend

React, TypeScript, Vite, React Router, Axios, Bootstrap, and Bootstrap Icons.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The frontend defaults to `http://localhost:3000/api/v1` for API requests. Override it with `VITE_API_URL` in `.env` when needed. `VITE_API_TIMEOUT` is specified in milliseconds.

## Verification

```bash
npm run lint
npm run build
```

Authentication is not part of this MVP. API integration and functional inventory screens are implemented in later project phases.
