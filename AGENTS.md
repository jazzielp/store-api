# AGENTS

This file captures how to work in this repo as an agent.
It focuses on commands and style conventions observed in the codebase.

## Project snapshot
- Runtime: Bun + TypeScript (ESM)
- Web framework: Express 5
- Data access: Prisma with libsql adapter
- Validation: Zod
- Auth: JWT + bcrypt
- Tests: `bun:test` with fetch against running app
- Path alias: `@/*` -> `src/*` (see `tsconfig.json`)

## Setup
- Install dependencies: `bun install`
- Environment variables (examples):
  - `PORT`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `BASE_URL` (tests)

## Run / build / lint / test
- Dev server: `bun run --watch src/index.ts`
- Alternate start (README): `bun run index.ts`
- Tests (all): `bun test`
- Tests (single file): `bun test src/tests/product.test.ts`
- Tests (single test by name): `bun test -t "Full CRUD flow for users"`
- Lint: not configured (no eslint config or lint script found)
- Typecheck/build: not configured (TS is `noEmit` in `tsconfig.json`)

## Where to look
- App entry: `src/index.ts`
- Routing: `src/routes/*.route.ts`
- Controllers: `src/controllers/*.controller.ts`
- Models: `src/models/*.model.ts`
- Zod schemas: `src/schemas/*.schema.ts`
- Middleware: `src/middlewares/*.ts`
- Tests: `src/tests/*.test.ts`

## Code style guidelines
### Imports and module style
- Use ESM imports/exports.
- Prefer `import type` for type-only imports.
- External imports first, then internal imports, separated by a blank line.
- Internal imports use the `@/` alias when targeting `src`.
- Keep import lists formatted one-per-line when there are many symbols.

### Formatting
- Double quotes for strings.
- Semicolons are used.
- Use trailing commas in multi-line objects and parameter lists.
- Keep lines readable; break long calls across lines.

### Naming
- Types and interfaces: `PascalCase` (`NewProduct`, `Login`).
- Variables and functions: `camelCase` (`createProduct`, `findById`).
- Exported constants: `camelCase` unless environment constant.
- Environment variables: `UPPER_SNAKE_CASE` (`JWT_SECRET`).
- Route handlers are verb-based (`getAll`, `getById`, `create`, `update`, `remove`).

### Types and data
- Prefer explicit types for API payloads from `src/type.d.ts`.
- Cast `req.body` to the expected type in controllers.
- Use `Partial<T>` for patch/update inputs.
- Use Zod schemas for request validation in routes.

### Error handling
- Validate inputs early and return 400/401/404 with JSON errors.
- Controllers return early on invalid parameters or missing entities.
- Models generally wrap Prisma operations in try/catch and rethrow after logging.
- Middleware handles Zod validation errors and returns a structured error body.
- Auth middleware requires `Bearer <token>` and returns 401 on invalid tokens.

### HTTP and Express patterns
- Controllers are async and return `res.json(...)` or `res.status(...).json(...)`.
- Use `express.Router()` per resource and export default routes.
- Mount resource routers under `/api/v1` in `routerApi`.
- Response codes: 201 for create, 204 for delete, 404 for missing resources.

### Tests
- Use `bun:test` imports: `describe`, `test`, `expect`, `beforeAll`, `afterAll`.
- Tests start the app with `app.listen(...)` and close the server in `afterAll`.
- Use `fetch` against `baseURL` and assert status codes and JSON payloads.
- Prefer deterministic test data; update tests if schema changes.

### Prisma
- Prisma client is created in `src/lib/prisma.ts` using libsql adapter.
- Reads/writes live DB via `DATABASE_URL`.
- Model functions are thin wrappers over Prisma operations.

### Auth/JWT
- JWT secret must be configured via env (`JWT_SECRET`).
- Tokens expire in 1h.
- Passwords are hashed with bcrypt and 10 salt rounds.

## Agent operating notes
- If you add new routes or schemas, wire them through the router chain.
- Keep validation schemas in `src/schemas` and reuse in routes.
- Avoid mixing `console.log` with production logic unless explicitly needed.
- No formatter is configured; keep formatting consistent with existing files.
- No cursor or copilot rules were found in this repository.
