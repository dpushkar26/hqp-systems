# Phase 1 Progress

| Task | Description | Status | Owner | Branch | Commit SHAs | Test Evidence |
|---|---|---|---|---|---|---|
| H0 | Codebase reality check | done | A0 | main | | |
| H1 | Branch, freeze, safety | done | A1 | audit-fixes | | |
| H2 | Prisma migration baseline | blocked | A1 | audit-fixes | | |
| H3 | Single Prisma client | done | A1 | audit-fixes | | |
| H4 | Money migration & money.ts | done | A1/A2 | audit-fixes | | |
| H5 | Roles and tenancy | done | A1 | audit-fixes | | |
| H6 | Invoice and order linkage | done | A1 | audit-fixes | | |
| H7 | Soft delete and constraints | done | A1 | audit-fixes | | |
| H8 | Menu fields | done | A1 | audit-fixes | | |
| H9 | Sessions, OTP, customers | done | A1/A6 | audit-fixes | | |
| H10 | Auth layer and permission map | done | A4 | audit-fixes | | |
| H11 | forHotel tenant data layer | done | A5 | audit-fixes | | |
| H12 | middleware.ts route protection | done | A4 | audit-fixes | | |
| H13 | Security patch set | done | A3 | audit-fixes | | |
| H14 | Standard error shape and validation helper | done | A2 | audit-fixes | | |
| H15 | Visit-count correction | done | A6 | audit-fixes | | |
| H16 | Full Test Protocol Execution | blocked | A7 | audit-fixes | | |

## Assumptions vs Reality
- The prompt assumed 14 Prisma models. There are actually 17 models.
- The prompt assumed `new PrismaClient()` was created in several files. This is true (1 singleton, 4 server actions).
- The prompt assumed money was Float. This is true (4 fields).
- The prompt assumed missing `hotelId` on `User` and `role` as free string. This is true.
- The prompt assumed `GET /api/orders` returned all orders and `PATCH /api/orders/update` was unauthenticated. This is true.
- All versions match assumptions (Next.js 16.3.5, Prisma 7.10.0, Zod 4.6.5, NextAuth 4.24.15).

## Running Log (Decisions, version checks, dependencies, risks)
- **Wave 0 completed**: `docs/codebase-status.md` generated. No surprises other than extra Prisma models.
- **Wave 1-3 completed**: Schema updated to phase 1, auth layered securely, multi-tenancy rules setup via forHotel, security vulnerabilities resolved.
- **Wave 4 (Test) blocked**: Tests have been written, but cannot be executed because Docker is not available in the environment to create the throwaway PostgreSQL instance for testing. A question was logged in `docs/phase1-questions.md`. The written test report is available in `docs/BACKEND_TEST_REPORT.md` and the UI developer handoff is available in `docs/HANDOFF_PUSHKAR.md`.
