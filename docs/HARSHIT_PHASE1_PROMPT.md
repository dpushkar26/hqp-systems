0. ROLE AND MISSION
You are the Orchestrator of a team of specialist sub-agents. Your mission is to complete all of Harshit's Phase 1 backend work (tasks H0 to H16) for the HQSP project, and to leave the codebase in a state where Pushkar (UI developer) can start his work immediately and completely without waiting on anything backend-related. After the development you must run a full API and database verification that replicates real user flows (guest, owner, cashier, kitchen, platform users, attackers), and produce evidence that every item passes.
Product: HQSP (Hotel Quick Service Platform): QR-based ordering, POS and management SaaS for hotels and restaurants in India. A guest scans a table QR, orders with no app or account, and verifies a phone OTP before the first order only. Kitchen and counter see orders live. Each restaurant (hotel) sees only its own data.
Phase 1 is foundation only: security, migrations, data model, auth, tenancy. It is not a feature phase. Do not build anything listed in section 3 ("Out of scope").
Success means: every acceptance criterion in section 7 is met with command output as evidence, the final gate in section 10 passes, and a handoff package for Pushkar exists (section 9).

1. NON-NEGOTIABLE RULES
1.1 Safety rules (never break these)
Local databases only. Run migrations, backfills, destructive tests and load tests only against a local Docker Postgres/Redis (or a throwaway DB you create). Never run anything against a database whose URL you did not create in this session. If DATABASE_URL in the environment looks remote (not localhost/127.0.0.1/docker host), stop and ask the human.
Never commit secrets. No real keys, tokens or passwords in code, tests, docs or git history. Use placeholders. Test secrets are generated at test time (for example crypto.randomBytes).
Never prisma db push except on a local throwaway DB. Use prisma migrate dev / migrate deploy only.
Never delete history data models' rows or drop columns without a verified backfill (money migration must compare totals before and after).
Do not log OTPs, tokens or secrets in any environment other than a clearly test-only capture provider that refuses to run when NODE_ENV=production.
Never push to main. Work on audit-fixes (and per-agent branches that merge into it). Tag pre-migration before any change.
No new dependencies without writing the reason in docs/phase1-progress.md. Prefer what is already installed. If a test runner already exists, use it; otherwise add Vitest only.
If something is ambiguous, ambiguous in a risky way, or contradicts this prompt, stop that lane and record a question in docs/phase1-questions.md. Continue other lanes. Do not guess on: Prisma 7 configuration, anything touching real data, secret rotation.
1.2 Project rules (from the PRD, apply to every line of code)
Zero-friction guests: no guest accounts; phone OTP only before the first order; browsing stays anonymous.
Server owns prices. Client prices are ignored; the server recomputes from the database.
Zod validation at every API boundary.
Race-safe counters (visit count, invoice numbers) with atomic SQL.
No hard deletes of orders, payments, sessions, invoices.
Tenant isolation is enforced by the platform (forHotel), never by developer memory. hotelId always comes from the authenticated session (staff) or the guest session's table (guest), never from request body or URL alone.
One canonical way per feature. Route Handlers are the API.
Money is integer paise. No floats anywhere.
Authorize on the server on every request with role and hotel. Hiding UI buttons is never enough.
Every external call is idempotent and retryable.
Mock data is never imported by production code paths. Mocks live only in tests and seed scripts.
Business logic belongs in src/server/services/*; route handlers stay thin.
1.3 Ownership rules (parallel work without collisions)
You (Harshit's agents) own: prisma/**, src/server/db/**, src/server/auth/**, src/server/http/** (shared response/validation helpers), src/app/api/**, middleware.ts, apps/realtime/**, src/lib/money.ts, src/types/auth.ts, src/types/api.ts, tests/backend/**, scripts/ (migration/backfill/platform-user scripts), docs/BACKEND_*.md, docs/MIGRATIONS.md (draft notes).
Pushkar owns (do NOT edit except as stated below): src/app/(guest), (staff), (ops), (auth), src/components, src/lib/apiFetch.ts, src/server/integrations/**, src/server/services/** skeletons, .github/**, .env.example, scripts/seed/**, tests/e2e/**, other docs/**.
Single exception: keep the build green. When a backend change (for example price -> priceMinor) breaks compilation in a Pushkar-owned file, you may make the smallest mechanical fix (rename the field, adjust a type) so typecheck and build pass. No styling, no behavior change, no refactors. Log every such file and line range in docs/phase1-ui-touchpoints.md with a one-line reason, so Pushkar knows exactly what changed.
Fallbacks for things Pushkar normally provides (you may not have them yet): if src/server/integrations/sms/types.ts does not exist when you need it, create a minimal interface plus a test-capture provider and note it in docs/phase1-progress.md; if CI does not exist, run the same checks locally and record the output. Do not build his full versions (.github/, seed, lint rule, E2E).
Do not delete billing.ts, customer.ts, dashboard.ts, ordering.ts (dead or duplicate Server Actions). Add a one-line // DEPRECATED: logic moves to services in Phase 2/3 header only if you touch them.

2. CONTEXT YOU MUST KNOW
2.1 Stack
pnpm monorepo: apps/web (Next.js App Router, React 19, Tailwind v4; Route Handlers are the API; Server Components), apps/realtime (Fastify + Socket.io + Redis subscriber). Prisma 7 + PostgreSQL (pooled via PgBouncer in production; DATABASE_URL pooled, DIRECT_URL direct for migrations). NextAuth v4 for staff. Zod 4. Redis (Upstash in production) for rate limits and pub/sub. Razorpay for payments (Phase 2 completes it). Keep NextAuth v4. Verify, do not blindly downgrade, Next.js/Zod/Prisma versions: check the installed version and its release status on the official site/docs, record the result in docs/phase1-progress.md.
2.2 Current state of the codebase (from the audit; VERIFY in Wave 0 before relying on any line)
DB: Postgres connected, 14 Prisma models, no migrations folder; Prisma 7 with @prisma/adapter-pg installed but not configured.
new PrismaClient() created in several files.
Money is Float (MenuItem.price, OrderItem.price, Payment.amount, Invoice.totalAmount). The cart UI hardcodes total * 1.18 (Pushkar removes that in UI; you do not).
User has no hotelId; role is a free string; no platform roles; no hotel status/GST fields.
No auth on /owner/*; no middleware.ts.
GET /api/orders returns all hotels' orders. PATCH /api/orders/update is unauthenticated. /api/test-seed is open.
Razorpay order creation is commented out (mock id); the webhook signature check is commented out.
Socket room join is unauthenticated; web calls realtime via localhost:4000.
OTP: 4 digits, stored plain, returned in the API response as devOtpCode, no rate limit. Sessions reset on every scan and never expire. SMS via Fast2SMS.
Every cart submit creates a separate order with invoiceId = null (bill accumulation is Phase 2).
Visit count increments at OTP verify and in a second, different place.
BullMQ producers exist, no worker (leave untouched).
Existing things that must keep working: QR scan creating the cookie session (/[hotelId]/table/[tableId], cookie active_session_id), guest cart, the OTP gate flow (403 OTP_REQUIRED -> /auth), POST /api/orders with server-side price lookup, owner registration with email OTP (NextAuth + Nodemailer), the realtime server skeleton.
2.3 Shared contracts with Pushkar (implement exactly; he codes against them in parallel)
Money: all API money fields are integer paise, names end in Minor (priceMinor, totalMinor, subtotalMinor, cgstMinor, sgstMinor, serviceChargeMinor, roundOffMinor, amountMinor). src/lib/money.ts exports formatINR(paise), add, percentBp(paise, bp), roundOff. Basis points: 500 bp = 5%. Error shape: every error { "error": { "code": "...", "message": "..." } }. Codes: UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND (404), VALIDATION_ERROR (400), RATE_LIMITED (429), OTP_REQUIRED (403), OTP_INVALID, OTP_EXPIRED, OTP_LOCKED, SESSION_EXPIRED. OTP: POST /api/auth/otp/send -> { ok: true, resendAvailableAt: ISO }; POST /api/auth/otp/verify -> { ok: true } or an error code. 6 digits, hashed, 5-minute expiry, max 5 attempts, resend cooldown, Redis rate limits. The OTP never appears in any response or log. Session cookie: active_session_id, HttpOnly, Secure (in production), SameSite=Lax, with expiry; guest sessions expire after 4 hours of inactivity. Auth types: src/types/auth.ts: UserRole = 'PLATFORM_ADMIN'|'PLATFORM_OPS'|'OWNER'|'MANAGER'|'CASHIER'|'KITCHEN'|'WAITER', StaffSession = { userId: string; role: UserRole; hotelId: string | null }. NextAuth session carries role and hotelId (null for platform users). Route paths Pushkar will provide and your middleware redirects to: /login, /access-denied, /scan-again, /not-available. Put them as constants in one file (src/server/auth/routes.ts). If Pushkar's final names differ, only that one constants file changes.

3. OUT OF SCOPE (do not build; stop if tempted)
Bill-accumulation service logic (services/orders.place(), invoice recalculation), real Razorpay order creation, webhook idempotency logic (only re-enable the signature check now), realtime JWT handshake and server-decided rooms (only the interim lock-down), menu CRUD APIs, image upload to R2, counter/kitchen/ops APIs, WhatsApp, Excel, reports, notifications, ops portal, any UI, CI workflow files, seed script, lint rule, E2E tests. These belong to Phase 2 or later or to Pushkar.

4. ORCHESTRATION MODEL
4.1 Shared state
Create and keep updated docs/phase1-progress.md (the single source of truth): a table of every task (H0..H16) with status (todo | in-progress | blocked | done | verified), owner agent, branch, commit SHAs, test evidence link, and a running log of decisions, version checks, new dependencies, and risks. Also maintain docs/phase1-questions.md (open questions for the human) and docs/phase1-ui-touchpoints.md (files in Pushkar's area you had to touch).
4.2 Git protocol
Tag pre-migration on the current HEAD before anything else; create audit-fixes.
Each sub-agent works in its own git worktree and branch h/<lane>-<task>; merges into audit-fixes through a small PR-style merge (rebase first, run typecheck + its tests before merge). Only one agent edits prisma/schema.prisma and prisma/migrations/** (the DB agent).
After each merge: pnpm install && pnpm prisma generate && pnpm typecheck on audit-fixes. If broken, the merging agent fixes it before anyone else merges.
Small commits with clear messages (feat(db): ..., fix(security): ..., test(api): ...).
4.3 Agents (lanes) and what they own
AgentTasksEditsNeeds from othersProduces for others
A0 Recon (3 read-only sub-agents: backend, DB, security)
H0
docs only
nothing
docs/codebase-status.md backend section; corrected assumptions
A1 DB (strictly sequential, owns schema)
H1, H2, H3, H4 (schema), H5 (schema), H6, H7, H8, H9 (schema)
prisma/**, src/server/db/prisma.ts
Wave 0 recon
Migrations strictly in this order: 0_init, 2_money_minor, 3_roles_tenancy, 4_invoice_model, 5_soft_delete, 6_menu_fields, 7_session_otp (see 5.1)
A2 Contracts
H4 (money.ts), types, H14
src/lib/money.ts, src/types/**, src/server/http/**
A1 baseline
money.ts early, error helpers, auth types
A3 Security
H13
src/app/api/**, apps/realtime/**, cookie/CORS config
A0, A2 (error helper)
Hardened endpoints
A4 Auth
H10, H12
src/server/auth/**, middleware.ts, NextAuth config
A1 (role enum, hotelId), A2
requireRole, permissions.ts, session claims, middleware
A5 Tenancy
H11
src/server/db/forHotel.ts
A1 (tenant models final)
forHotel, tenant model list
A6 OTP/Session
H9 (code), H15
src/server/**, src/app/api/auth/**
A1 migration 7, A4, SMS interface
OTP backend
A7 Test engineers (4 parallel)
H16
tests/backend/**
all above
Test suites and evidence
A8 Independent Auditor
verification
read-only + test runs
everything
Red-team report
A9 Handoff
Pushkar package
docs/BACKEND_*.md
everything
Handoff docs
4.4 Waves (run in this order; agents inside a wave run in parallel)
Wave 0 (parallel, read-only): A0 recon x3.
Wave 1 (sequential core + parallel side lanes): A1 does H1 -> H2 -> H3. In parallel, A2 starts money.ts (pure functions, no DB) and types; A3 starts the no-schema security fixes (section 5.13).
Wave 2 (DB chain with parallel consumers): A1 does H4 -> H5 -> H6 -> H7 -> H8 -> H9 schema (migration order must equal folder order), merging each migration immediately and posting it in docs/phase1-progress.md. In parallel: A2 finishes H14; A4 builds H10 against the types (finalizes when H5 merges); A5 builds H11 (finalizes when H5 and H7 merge); A3 finishes guards that need requireRole.
Wave 3: A4 finishes H12 (middleware); A6 implements OTP/session code (needs migration 7, SMS interface); H15.
Wave 4 (parallel testing): four test engineers (section 8): T1 migrations and DB constraints, T2 security and cross-tenant, T3 OTP and session flows, T4 money/order/auth user-flow replays plus concurrency.
Wave 5: A8 independent audit (re-runs everything fresh from an empty database, tries to break it). Fix findings; re-run until clean.
Wave 6: A9 handoff package and final gate (sections 9 and 10).
If parallel agents are unavailable in this environment, run the agents in the order of the waves above.
4.5 Blockers
If an agent is blocked more than one attempt-cycle, it records the blocker in docs/phase1-progress.md, switches to another unblocked task in its lane, and the Orchestrator reassigns. Never edit another lane's files silently.

5. TASK SPECIFICATIONS (H0 to H16)
Every task: read the current state first, then implement, then run its acceptance checks and paste the evidence into docs/phase1-progress.md.
5.1 Migration order and naming (read before touching Prisma)
Migration folders are applied in lexicographic order, so they must be created in this exact order and each one is a diff from the previous state: 0_init, 2_money_minor, 3_roles_tenancy, 4_invoice_model, 5_soft_delete, 6_menu_fields, 7_session_otp (the number 1 is intentionally skipped to match the PRD).
Workflow per migration: edit schema -> prisma migrate dev --create-only --name <name> -> rename the generated folder to the numbered name before applying -> hand-edit SQL where this prompt says (backfills, raw index) -> apply on the local DB -> run the migration tests -> commit.
Prisma 7: read the official docs for the required config file and driver adapter before H2. Record the commands and docs you used. If the docs contradict this prompt, follow the docs and note it.
Deviation from the PRD sketch (decision made here): in 4_invoice_model keep Order.invoiceId nullable in Phase 1. Making it required now would break POST /api/orders (which creates orders without an invoice until Phase 2 builds services/orders.place()). Phase 2 makes it required after the service exists. Record this decision in docs/phase1-progress.md and in docs/MIGRATIONS.md.
5.2 H0: Codebase reality check (Wave 0, three read-only sub-agents)
Backend recon: list every handler under src/app/api/**: path, methods, auth check (none/session/role), Zod validation (yes/no), models touched, where hotelId comes from, response shapes. List all Server Actions (billing.ts, customer.ts, dashboard.ts, ordering.ts) and what they contain.
DB recon: Prisma version, adapter state, every model and field, all Float fields, all places new PrismaClient() is called, existing migrations (expect none), indexes, relations and onDelete behavior, WebhookEvent model, anything referencing visitCount.
Security recon: state of webhook signature check, socket room join code, CORS config, cookie flags, /api/test-seed, GET /api/orders, PATCH /api/orders/update, devOtpCode, secrets in git history (scan with a local tool or git log -p grep patterns; do not print secret values, only file and line), Redis usage and rate limiting.
Output: docs/codebase-status.md ("Backend" section) with the endpoint table, version list (Next.js, Prisma, Zod, NextAuth, Node, pnpm), and a list of any assumption in section 2.2 that turned out wrong. Update this prompt's assumptions in docs/phase1-progress.md before Wave 1.
Acceptance: the file exists, covers every handler and model, and is cross-checked by a second agent (spot check 5 random handlers).
5.3 H1: Branch, freeze, safety
git tag pre-migration on current HEAD, push the tag; create audit-fixes. Record the HEAD SHA.
Add a local DB dump instruction to docs/MIGRATIONS.md (do not dump any remote DB).
Do not delete dead server actions.
Acceptance: tag and branch exist (git tag -l, git branch).
5.4 H2: Prisma migration baseline
Configure Prisma 7 per the official docs (config file, driver adapter), keep DATABASE_URL (pooled) and DIRECT_URL (direct) usage separated.
Generate the baseline from the current schema: prisma migrate diff --from-empty --to-schema <schema> --script saved as prisma/migrations/0_init/migration.sql.
Prove it on an empty local DB with prisma migrate deploy; on a DB that was created from the old schema use prisma migrate resolve --applied 0_init.
Provide docker-compose.test.yml (or equivalent) under infra/ with Postgres and Redis for local and test use (ports bound to localhost, no real credentials).
Acceptance: an empty Postgres reaches the exact current schema through migrate deploy; prisma migrate status is clean; the app boots.
5.5 H3: Single Prisma client
Create src/server/db/prisma.ts exporting one shared client (cached on globalThis in development). Replace every new PrismaClient() (including a separate singleton for apps/realtime if it uses Prisma).
Acceptance: grep -rn "new PrismaClient" apps packages returns only the singleton file(s); app boots and a basic query works.
5.6 H4: Money migration (Float to paise) and money.ts
Publish src/lib/money.ts first (pure functions, no DB): formatINR(paise) (en-IN grouping, two decimals, ₹), add, percentBp(paise, bp) (integer math, defined rounding), roundOff. The rounding rule is defined once. Merge it to audit-fixes immediately (Pushkar is waiting on it).
Migration 2_money_minor: add nullable MenuItem.priceMinor, OrderItem.priceMinor, Payment.amountMinor, Invoice.totalMinor; backfill ROUND(old * 100); switch all code (reads and writes) to the new fields; make the new columns required; drop the old Float columns. Pre-launch this is one migration.
Keep POST /api/orders working: it still looks up prices on the server from priceMinor and ignores any client-sent price.
Verify with a before/after comparison on legacy-shaped test data (see T1 scenario M-03).
Where UI files break on the rename, make only the minimal mechanical fix and log it in docs/phase1-ui-touchpoints.md.
Acceptance: grep -n "Float" prisma/schema.prisma returns nothing; totals before and after migration are identical to the paisa on a legacy fixture; typecheck and build pass; money unit tests (pure) exist for your own confidence (Pushkar also writes P20).
5.7 H5: Roles and tenancy (migration 3_roles_tenancy)
Enums: UserRole { PLATFORM_ADMIN PLATFORM_OPS OWNER MANAGER CASHIER KITCHEN WAITER }, HotelStatus { DRAFT ASSIGNED APPROVED LIVE SUSPENDED }.
User: role UserRole (map existing string 'OWNER' to OWNER; unknown strings must fail loudly in the migration, not silently map), hotelId String?, isActive Boolean @default(true), deletedAt DateTime?, @@index([hotelId, role]).
Hotel: status HotelStatus @default(DRAFT) (existing hotels backfilled to LIVE so nothing existing becomes unreachable; record this), gstin, fssaiNo, address, phone, logoUrl, gstRateBp Int @default(500), serviceChargeBp Int @default(0), pricesIncludeTax Boolean @default(false), upiVpa, razorpayAccountId, createdById, approvedById, approvedAt, deletedAt. The 500 bp default is a placeholder pending CA confirmation: add a comment in the schema saying so.
Backfill User.hotelId for existing owners with a dry-run-first script (scripts/backfill-user-hotel.ts): prints counts, takes an explicit user->hotel map file, refuses to run without --apply. For an unmapped owner, leave null and report it.
Script scripts/create-platform-user.ts (CLI args, password prompted or from env, hashed with the project's existing password hashing; platform users have hotelId = null).
Verify every tenant model has hotelId; add where missing and list them in docs/BACKEND_TENANT_MODELS.md (this list feeds forHotel and Pushkar's lint rule).
Acceptance: migration applies on empty DB and on a legacy-data DB; existing owner login still works; enums exist in Postgres (\dT).
5.8 H6: Invoice and order linkage (migration 4_invoice_model)
Enums InvoiceStatus { OPEN PENDING_PAYMENT PAID VOID }, ItemStatus { PENDING PREPARING READY SERVED CANCELLED }; add READY to OrderStatus (additive).
Invoice: status @default(OPEN), invoiceNumber String?, subtotalMinor, discountMinor, serviceChargeMinor, cgstMinor, sgstMinor, igstMinor, roundOffMinor, totalMinor (Int, default 0), settledAt, settledByUserId, paymentMode PaymentMode?, voidReason.
Raw SQL in the migration file: CREATE UNIQUE INDEX invoice_one_open_per_table ON "Invoice"("tableId") WHERE status = 'OPEN';
Order: notes, cancelledReason, placedBySessionId; indexes tableId, customerId, invoiceId; invoiceId stays nullable (see 5.1).
OrderItem: priceMinor, nameSnapshot String, taxRateBp Int, status ItemStatus @default(PENDING). Update the existing order-creation code so each new OrderItem stores priceMinor (server-looked-up), nameSnapshot (menu item name at order time), taxRateBp (item override if set, else the hotel's gstRateBp). Existing rows are backfilled: nameSnapshot from the menu item name, taxRateBp from the hotel rate.
Payment: amountMinor (done in H4), idempotencyKey String @unique, gatewayOrderId String?, gatewayPaymentId String? @unique. Backfill idempotencyKey for existing payments with generated unique values.
New models: InvoiceCounter { hotelId, fy, last, @@id([hotelId, fy]) }, AuditLog { id, hotelId?, userId?, action, entity, entityId, meta Json, createdAt }, NotificationLog { id, hotelId, invoiceId?, channel, status, providerRef, error, createdAt }. WebhookEvent already exists: keep as is.
Backfill script scripts/backfill-invoices.ts: for existing orders with invoiceId null, group by table and create one invoice per group (OPEN if unpaid, PAID if paid; totals from order items). Dry run by default, --apply required, runs in a transaction, prints counts before/after. Pre-pilot data may simply be cleared instead; support both and document.
Acceptance: index rejects a second OPEN invoice for the same table while OPEN+PAID is allowed; POST /api/orders still creates an order successfully with the new item fields filled; backfill dry-run counts match apply counts.
5.9 H7: Soft delete and constraints (migration 5_soft_delete)
deletedAt DateTime? on Hotel, Table, MenuItem, User (add only where not already added in earlier migrations).
onDelete: Restrict on order, invoice and payment relations (history is never cascaded).
Indexes: Order[tableId], Order[customerId] (if not present), MenuItem[hotelId, categoryId], Session[hotelId].
Table: capacity Int?, label String?, isActive Boolean @default(true).
Acceptance: deleting a table that has orders or invoices fails at the database level; soft-deleted rows are excluded by forHotel-based reads (tested in H11).
5.10 H8: Menu fields (migration 6_menu_fields)
MenuItem: imageUrl String?, isVeg Boolean @default(true), description String?, sortOrder Int @default(0), taxRateBp Int?. Remove all Base64 image handling from backend code; leave imageUrl null for legacy rows. (Image upload is Phase 2.)
Acceptance: migration applies; no Base64 handling remains in src/app/api/** or src/server/** (grep -rni "base64").
5.11 H9: Sessions, OTP, customers (migration 7_session_otp + code)
Schema: Session.expiresAt DateTime (backfill existing sessions to now() so they are invalid, acceptable pre-launch), lastSeenAt @default(now()), rename otpCode -> otpHash, add otpAttempts Int @default(0), otpSentAt DateTime?. Customer: name String?, consentAt DateTime?; keep unique [phoneNumber, hotelId].
Session behavior (minimal, Phase 1): on creation set expiresAt = now + 4h; on every authenticated guest request refresh lastSeenAt and extend expiresAt; an expired session returns 401 SESSION_EXPIRED from session-dependent endpoints. Do not implement "reuse session on rescan" (Phase 2).
OTP service src/server/services/otp.ts (only OTP-related service work; leave other service skeletons to Pushkar): generate a 6-digit OTP with a CSPRNG; store otpHash = HMAC-SHA256 or bcrypt with a per-OTP salt (and a server secret if HMAC); otpSentAt; expiry 5 minutes; max 5 attempts, enforced atomically (single SQL UPDATE ... SET otpAttempts = otpAttempts + 1 ... RETURNING so parallel guesses cannot exceed the cap); on the 5th failure return OTP_LOCKED; resend cooldown (for example 30 seconds) returning RATE_LIMITED with resendAvailableAt; Redis rate limits for send (per phone and per session/IP) and verify (per session/IP). Constant-time comparison.
Endpoints: POST /api/auth/otp/send returns { ok: true, resendAvailableAt } only; POST /api/auth/otp/verify returns { ok: true } or the error code. Delete devOtpCode from every response, type and log. Validate phone (Indian mobile, normalized to one canonical format, Zod) and OTP (exactly 6 digits).
SMS: call integrations/sms through the interface. If missing, create the minimal interface send({ to, templateId, variables }). Add a test-capture provider selected only when SMS_PROVIDER=capture and NODE_ENV !== 'production' (it writes messages to a gitignored .tmp/sms-outbox.jsonl that the tests read). In production mode, selecting it must throw at startup. Never log message bodies that contain an OTP outside this provider.
On verify success: mark the session verified, link/create the hotel-scoped Customer by phone; do not increment visit count here (see H15).
Acceptance: DB contains only otpHash; no response body or log line contains the OTP; wrong x5 locks; parallel guess test cannot exceed 5 attempts; expired OTP rejected; cooldown and rate limits work.
5.12 H10: Auth layer and permission map
NextAuth v4 callbacks put role and hotelId in the JWT and session; export getSession() (server) and a client-safe helper useStaffSession() returning StaffSession | null (Pushkar consumes it).
src/server/auth/guards.ts: requireRole([...]) returns { user, hotelId } or throws typed errors mapped to 401/403 with the standard shape. Staff hotelId always comes from the session. Guards also reject users with isActive = false or deletedAt set (401). A separate guard requireGuestSession() resolves { sessionId, hotelId, tableId, customerId? } from the active_session_id cookie (rejecting expired or unknown sessions).
src/server/auth/permissions.ts: one map capability -> allowed roles implementing the PRD matrix for PLATFORM_ADMIN, PLATFORM_OPS, OWNER, CASHIER, KITCHEN (MANAGER mirrors OWNER where the PRD says so; WAITER and fine-grained rules come in Phase 4). Capabilities must include at least: hotel create/approve/go-live/suspend, hotel profile/GSTIN/tax/payment keys (OWNER read-only), tables/QR, menu and prices (OWNER write), availability toggle, orders read/update/cancel, bills generate/settle, refund/void, reports, staff accounts.
Apply requireRole to every existing staff-facing handler (the endpoints you found in H0). OWNER writes to tax/GSTIN/payment keys/table layout/hotel status are rejected server-side if any such endpoint exists today.
src/server/auth/routes.ts constants: /login, /access-denied, /scan-again, /not-available.
Staff login hardening (lockout, PIN) is Phase 2.
Acceptance: guard rejects wrong role (403) and unauthenticated (401); permission map exported and importable by tests; Pushkar's P21 tests can run against it.
5.13 H13: Security patch set (start the no-schema part in Wave 1)
Wave 1 (no schema or auth dependencies):
Delete /api/test-seed (404 in production; seeding only by CLI script, which is Pushkar's).
Remove the global GET /api/orders.
Re-enable the Razorpay webhook signature check: HMAC SHA256 over the raw request body with RAZORPAY_WEBHOOK_SECRET, x-razorpay-signature, constant-time compare, 400 on mismatch or missing header, no state change on failure. (Idempotency is Phase 2.)
Interim realtime lock-down in apps/realtime: clients can no longer choose rooms; unauthenticated connections cannot join staff/kitchen/table rooms. Full JWT handshake is Phase 2.
CORS limited to env-configured origins (web and realtime).
Guest session cookie: HttpOnly, Secure in production, SameSite=Lax, with expiry.
Error responses never include stack traces or internal messages; use the shared error helper. After H10 merges:
PATCH /api/orders/update: require staff role (CASHIER|MANAGER|OWNER|KITCHEN as the permission map says) and hotel ownership of the order (wrong hotel -> 404). Unauthenticated -> 401.
Anything else that returned tenant data without auth in the H0 table gets requireRole/requireGuestSession and forHotel.
Secrets: scan history (file and line only); list findings in docs/phase1-questions.md for the human to rotate. Do not rotate or print secrets.
Acceptance: each item has a test in T2 (section 8); all pass.
5.14 H11: forHotel tenant data layer
src/server/db/forHotel.ts: a Prisma client extension forHotel(hotelId) injecting where: { hotelId } on findMany/findFirst/findUnique(OrThrow)/count/aggregate/update/updateMany/delete/deleteMany/upsert and setting hotelId on create/createMany for every tenant model in docs/BACKEND_TENANT_MODELS.md. It also hides soft-deleted rows (deletedAt: null) for models that have deletedAt, unless an explicit includeDeleted option is passed.
findUnique by id must also enforce hotel (convert to findFirst with the id and hotelId, or use an equivalent that cannot cross tenants).
Use forHotel in every handler you touch. Full rollout is Phase 4.
Acceptance: tests in T2 prove no read, update or delete crosses tenants, including findUnique by another hotel's id (returns null) and updateMany (affects 0 rows).
5.15 H12: middleware.ts route protection
Guard /owner, /staff, /ops groups: unauthenticated -> redirect to /login (with a callbackUrl); authenticated but wrong role/group (for example CASHIER on /ops) -> redirect to /access-denied. Platform roles may enter /ops; hotel roles may not. Keep matcher tight so guest routes, /api/** (they self-guard), static assets and the realtime token path are untouched.
Middleware is a first gate only; every API handler still calls its guard.
Acceptance: tests in T2 and the flow replays in T4 confirm redirects and that guest routes still work.
5.16 H14: Standard error shape and validation helper
src/server/http/: ok(data, init?), fail(code, message, status), parseBody(schema, req) (400 VALIDATION_ERROR with the standard shape, never echoing internal details), withErrorHandling(handler) (maps typed errors and unknown errors to the standard shape; unknown errors become a generic 500 with a request id, details only in server logs).
src/types/api.ts exports ApiErrorCode and ApiErrorBody for Pushkar's apiFetch().
Apply to every endpoint you touch.
Acceptance: fuzz test in T2 (invalid JSON, wrong types, missing fields, oversized body) returns the standard shape everywhere and never a stack trace.
5.17 H15: Visit-count correction
Find both places that increment the visit count. Remove the OTP-verify increment. Leave exactly one implementation and add a comment // Phase 2 (FR-103): make this once per day, on first order, atomic raw SQL. Keep behavior safe: do not break existing orders.
Acceptance: verifying an OTP leaves visitCount unchanged (test T3); placing an order still increments exactly as before.

6. LOCAL TEST ENVIRONMENT (build this in Wave 1; all test agents use it)
infra/docker-compose.test.yml: Postgres (and a second empty DB for migration tests) and Redis, bound to 127.0.0.1, throwaway credentials. Script scripts/test-env.sh creates .env.test with randomly generated secrets (NEXTAUTH_SECRET, REALTIME_JWT_SECRET, RAZORPAY_WEBHOOK_SECRET, OTP HMAC secret), SMS_PROVIDER=capture, NODE_ENV=test, localhost DB/Redis URLs. .env.test is gitignored.
Scripts (add to package.json, root): test:backend:setup (start containers, migrate deploy, build), test:backend (run all suites), test:backend:migrations, test:backend:security, test:backend:flows, test:backend:teardown.
Real HTTP, not mocks: start the web app (apps/web) and apps/realtime as real processes on test ports and call them over HTTP with a small cookie-jar client (tests/backend/support/http.ts; Node fetch plus a minimal jar, no new dependency) that behaves like a browser: stores Set-Cookie, sends cookies, follows or reports redirects as configured, can set Origin. Each simulated person gets their own jar: guestPhone1, guestPhone2, ownerA, ownerB, cashierA, kitchenA, platformAdmin, attacker (no cookies).
Fixture factory (tests/backend/support/fixtures.ts, uses Prisma directly; raw Prisma is allowed in tests): creates hotels A and B (status LIVE), tables, categories, menu items (with unique marker names such as HOTELB-SECRET-ITEM), users for every role incl. platform users with known test passwords, and returns ids. Idempotent per test run (unique suffixes). Never reused outside tests.
Production-build checks: a separate job runs next build && next start (NODE_ENV=production, SMS_PROVIDER unset) to assert production-only behavior (/api/test-seed 404, Secure cookie flag, capture provider refuses to start).
Evidence: every suite writes machine-readable results and the Orchestrator assembles docs/BACKEND_TEST_REPORT.md: scenario ID, description, pass/fail, request/response summary (secrets and cookies redacted), SQL assertions and their results. Raw logs go to .tmp/test-logs/ (gitignored).
Time control: tests that need time to pass (OTP expiry, session expiry) move time by updating the relevant timestamp columns with SQL or by injecting a clock; they never sleep for minutes.

7. ACCEPTANCE MATRIX (a task is verified only when its proof exists)
TaskProof required (all of them)
H0
docs/codebase-status.md backend section; list of wrong assumptions
H1
git tag -l pre-migration, git branch --list audit-fixes output
H2
M-01 passes; prisma migrate status clean; prisma migrate diff --from-url <local> --to-schema <schema> --exit-code returns no diff
H3
Z-02 grep passes; D-10 (200 rapid requests, no connection exhaustion)
H4
M-02, M-03, D-06, D-08, G-03, Z-01 pass; money.ts merged before the rest of H4
H5
M-02, M-04, M-05, A-01, A-02, A-05; tenant model list file exists
H6
D-01, D-09, M-06, M-09, G-07, G-08
H7
D-02, D-07
H8
Z-05 (no Base64), D-07
H9
O-01 to O-13, G-01, F-01, S-06, M-08
H10
A-01 to A-07, X-01
H11
X-03, X-04
H12
A-04
H13
S-01 to S-14, R-01 to R-04
H14
E-01 to E-06
H15
O-09, F-01
H16
Every scenario in section 8 executed; report generated; zero unexplained failures

8. FULL TEST PROTOCOL (API, database and user-replicated flows)
Principle: every scenario below must be executed against the real running stack and must assert both the API response (status, body shape, headers) and the database state (SQL queries) afterwards. A scenario that only checks the status code is not complete. Negative tests must also prove that nothing was written to the database.
Test teams (run in parallel in Wave 4):
T1 migrations and DB constraints: M-xx, D-xx
T2 security, auth, tenancy, errors, realtime lock-down: S-xx, A-xx, X-xx, E-xx, R-xx, Z-xx
T3 OTP, session and guest flows: O-xx, G-xx
T4 concurrency and full-day user replays: C-xx, F-xx
If any scenario fails: the owning task agent fixes the root cause, adds a regression test, and the whole affected suite plus the full flow replays are re-run. Do not weaken a test to make it pass.
8.1 T1: Migrations and database constraints
IDScenarioAssertions
M-01
Empty DB -> migrate deploy all migrations
Every migration applies; migrate status clean; no diff between DB and schema.prisma
M-02
Legacy path: build a throwaway DB at the pre-migration schema, load legacy fixture data via raw SQL (3 hotels, owner users with role string 'OWNER', tables, menu items with prices like 199.99, 10.10, 0.30, orders with invoiceId null, orders with items, payments, a few invoices with totalAmount, sessions with 4-digit otpCode), mark 0_init applied, then run migrations 2 to 7
Row counts for every table unchanged; no migration error; all data present
M-03
Money exactness on the legacy data
For every money row priceMinor = ROUND(price*100); sum of old * 100 equals sum of new for menu, order items, payments, invoices; spot-check 10 invoices end to end; no negative or NULL
M-04
Unknown role string (e.g. 'WIZARD') in User.role
Migration 3_roles_tenancy fails loudly (does not silently map); DB left unchanged by the failed migration
M-05
Hotels existing before migration
All have status = 'LIVE'; gstRateBp = 500, serviceChargeBp = 0
M-06
Backfill scripts (backfill-user-hotel, backfill-invoices)
Dry run prints counts and writes nothing; --apply required; apply creates exactly the dry-run counts; second apply creates nothing (idempotent); runs in a transaction (force an error halfway: nothing persists)
M-07
Roll back approach: restore the local dump taken before migration, re-run all migrations
Same end state as M-02
M-08
Sessions after migration 7
Legacy sessions have expiresAt <= now() (invalid); otpCode column no longer exists; otpHash present
M-09
Existing order items after migration 4
nameSnapshot non-null (from menu item name), taxRateBp non-null, priceMinor non-null
M-10
Prisma client generation after each migration
prisma generate and pnpm typecheck succeed
IDScenarioAssertions
D-01
Partial unique index
Second OPEN invoice for the same table fails with unique violation 23505; OPEN + PAID for the same table allowed; OPEN on a different table allowed; after the first becomes PAID a new OPEN is allowed
D-02
onDelete: Restrict
Deleting a Table with orders/invoices fails (FK violation); deleting a MenuItem referenced by an OrderItem fails; deleting a Hotel with tables fails; Order, Invoice, Payment rows are never cascaded
D-03
Uniqueness
Duplicate Payment.idempotencyKey fails; duplicate non-null gatewayPaymentId fails; NULL gatewayPaymentId allowed multiple times
D-04
Customer uniqueness
Same phone in hotels A and B allowed; same phone twice in A fails
D-05
Enums
Raw insert of an invalid UserRole, HotelStatus, InvoiceStatus, ItemStatus fails
D-06
No floats
information_schema.columns shows no double precision/real column in any money column; list any other float columns and justify them in the report
D-07
Indexes
pg_indexes contains Order(tableId), Order(customerId), Order(invoiceId), MenuItem(hotelId, categoryId), Session(hotelId), User(hotelId, role), the partial invoice index
D-08
NOT NULL
Money columns are NOT NULL where specified; inserting NULL fails
D-09
Defaults
New Invoice row has all *Minor fields = 0 and status = 'OPEN'; new User has isActive = true
D-10
Single client / pool
200 rapid sequential and 50 concurrent API requests complete without too many connections; pg_stat_activity connection count stays within the configured pool
D-11
hotelId coverage
Every model listed in BACKEND_TENANT_MODELS.md has a non-null hotelId column (or a documented reason)
8.2 T2: Security, auth, tenancy, errors, realtime lock-down
Security (S) , run as the attacker jar (no cookies) unless noted:
IDScenarioAssertions
S-01
Production build: GET/POST /api/test-seed
404 (and no data created)
S-02
GET /api/orders (no auth, then as ownerA, then as a guest)
Route gone (404/405) in all three; response never contains any order
S-03
PATCH /api/orders/update: unauthenticated; cashierA on hotel B's order; cashierA on hotel A's order; guest session
401; 404 (and order unchanged in DB); 200 (allowed, DB updated); 401/403 for guest
S-04
Webhook POST /api/webhooks/razorpay: missing signature; wrong signature; valid signature for a different body; correct HMAC of the raw body
400; 400; 400; 200 or the handler's normal success. For every failure: payment/invoice/webhook tables unchanged. Code review check: constant-time compare used, raw body (not re-serialized JSON) used
S-05
CORS: preflight and real request with Origin: https://evil.example, then with an allowed origin
No Access-Control-Allow-Origin for evil; present for allowed; no * with credentials
S-06
Cookie flags
Set-Cookie for active_session_id includes HttpOnly, SameSite=Lax, an expiry; Secure present in the production build
S-07
Information leakage: force a 500 (for example a test-only route in test mode or a corrupted-state fixture) and bad inputs
Response body has no stack trace, file path, SQL, Prisma error text; server log has the details and a request id
S-08
Secret scan
No secret patterns in the working tree (report file:line only)
S-09
Injection payloads ('; DROP TABLE, <script>, very long unicode, null bytes) in phone, notes, names
No 500; values stored literally or rejected with VALIDATION_ERROR; DB intact
S-10
Mass assignment on POST /api/orders with extra fields (hotelId, price, priceMinor, total, status, invoiceId)
Extras ignored; stored row uses server values and the session's hotel
S-11
IDOR (guest): guest at hotel A table 1 requests/modifies order ids of table 2 and of hotel B
404; no data returned; DB unchanged
S-12
Oversized body (for example 5 MB JSON) and wrong content type
413 or 400 with standard shape; no crash
S-13
Method not allowed on each API route
405 with standard shape
S-14
Removed/legacy routes (/api/session/init stays unless merged later; GET /api/orders; /api/test-seed)
As specified; list every route reachable without auth in the report and justify each
Auth and roles (A):
IDScenarioAssertions
A-01
NextAuth login for each role (OWNER, MANAGER, CASHIER, KITCHEN, PLATFORM_ADMIN, PLATFORM_OPS)
/api/auth/session returns role and hotelId (null for platform roles); cookie flags correct
A-02
Wrong password x10, unknown user
Generic failure; no user enumeration difference in message or timing beyond noise
A-03
Role x endpoint matrix: generate from permissions.ts and the endpoint registry (docs/BACKEND_ENDPOINTS.json) every (role, endpoint) pair
Status equals the permission map's expectation (200 vs 403); 401 when unauthenticated; every denial writes nothing
A-04
Middleware: logged-out /owner, /staff, /ops (and a deep path); CASHIER on /ops; OWNER on /ops; PLATFORM_OPS on /ops; guest routes /{hotelId}/table/{tableId}, /auth; /api/**
Redirect to /login?callbackUrl=...; redirect to /access-denied; allowed; guest routes untouched (not redirected); API returns JSON 401 (not a redirect)
A-05
Inactive user (isActive=false) and soft-deleted user with a previously valid cookie
401 on staff endpoints
A-06
Owner registration with email OTP (existing flow)
Still completes (use a captured email transport in test mode; if impossible, document and mark for manual check)
A-07
OWNER attempts to change tax, GSTIN, payment keys, table layout, hotel status via any endpoint that exists, and via can()
403; DB unchanged. If no endpoint exists, assert via permissions.ts and record "no endpoint yet"
A-08
Platform user with hotelId = null calling a hotel-scoped staff endpoint
Handled per the permission map; never a crash or unscoped query
Tenancy (X):
IDScenarioAssertions
X-01
For every endpoint in the registry: ownerA/cashierA request hotel B resource ids
403/404; response body never contains hotel B marker strings; DB unchanged
X-02
Guest session at hotel A orders a menu item belonging to hotel B
Rejected; no Order/OrderItem rows created
X-03
forHotel matrix: for every tenant model x {findMany, findFirst, findUnique by foreign id, count, aggregate, update, updateMany, delete, deleteMany, upsert, create, createMany}
Never reads or affects another hotel's rows; creates always carry the right hotelId; soft-deleted rows hidden unless includeDeleted
X-04
Scan URL /{hotelA}/table/{tableOfHotelB} and vice versa
404 / not-available; no session created for a mismatched pair
X-05
Same phone number verified in hotel A
Customer row exists only for A; a session at B stays unverified (OTP_REQUIRED)
Errors (E):
IDScenarioAssertions
E-01
Every failing request in this whole suite
Body validates against { error: { code, message } } (Zod schema from types/api.ts); code is in the contract list
E-02
Invalid JSON, empty body, array instead of object
400 VALIDATION_ERROR
E-03
Unknown API route
Standard-shape 404
E-04
Validation error messages
Do not echo secrets, SQL, stack traces
E-05
Status/code mapping
401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT_FOUND, 429 RATE_LIMITED with consistent codes
E-06
Unknown error
Generic 500 with request id, details only in server logs
Realtime lock-down (R):
IDScenarioAssertions
R-01
Unauthenticated socket client connects and tries to join h:<A>:staff and any room (via every join mechanism the old code offered)
Join refused or ignored; after a new order is created for hotel A the client receives no event
R-02
Client-supplied room names/params in the handshake
Ignored
R-03
Realtime CORS with evil origin
Rejected
R-04
Create an order while the realtime service is stopped
Order still succeeds (201); order saved; no unhandled error
Static checks (Z):
IDCheck
Z-01
grep -rn "Float" prisma/schema.prisma returns nothing (and no float money math: no parseFloat/toFixed on money in src/server and src/app/api)
Z-02
grep -rn "new PrismaClient" apps packages only in the singleton(s)
Z-03
grep -rn "devOtpCode|otpCode" returns nothing in source
Z-04
grep -rn "mockData|MOCK_" apps/web/src/server apps/web/src/app/api returns nothing
Z-05
grep -rni "base64" src/server src/app/api shows no image handling
Z-06
grep -rn "localhost:4000" apps reviewed: remaining uses documented as Phase 2
Z-07
Every src/app/api/**/route.ts handler appears in BACKEND_ENDPOINTS.json with its auth mode; no handler lacks Zod parsing where it reads a body or query
Z-08
pnpm typecheck, pnpm lint, pnpm build all pass
8.3 T3: OTP, session and guest flows (replay a real guest)
IDScenario (guest jar unless stated)Assertions
G-01
Scan: GET /{hotelA}/table/{table1}
Success/redirect; active_session_id cookie set with correct flags; Session row with hotelId, tableId, expiresAt ≈ now+4h, unverified
O-01
POST /api/orders before verification
403 OTP_REQUIRED; no order rows
O-02
POST /api/auth/otp/send with a valid Indian mobile
200 body contains only ok and resendAvailableAt; capture outbox has a 6-digit OTP; DB otpHash is not the OTP, differs between two sends of the same OTP value (salt), otpSentAt set; no OTP in the response or server log
O-03
Wrong OTP x5
OTP_INVALID x4 with attempts incrementing in DB; 5th returns OTP_LOCKED; the correct OTP now also fails (OTP_LOCKED); DB attempts = 5
O-04
Expiry: set otpSentAt 6 minutes back via SQL
OTP_EXPIRED
O-05
Immediate second send
429 RATE_LIMITED with resendAvailableAt; no new SMS in outbox
O-06
Burst of sends from one phone and from one IP above the configured limit
RATE_LIMITED; counts recorded in Redis; recovers after the window (simulate by flushing the key/time)
O-07
Log/response scan across all OTP tests
The OTP value, devOtpCode, and otpHash never appear in any response body or server log
O-08
Validation: phone formats (valid, invalid, with +91, with spaces), OTP of 5 digits, 7 digits, letters, empty
VALIDATION_ERROR for invalid; normalized canonical phone stored for valid
O-09
Successful verify
{ ok: true }; session verified = true; hotel-scoped Customer created/linked; visitCount unchanged
O-10
After verify, POST /api/orders
201; Order, OrderItem rows exist with correct hotelId, tableId, sessionId/customer
O-11
Session expiry: set expiresAt in the past
Session-dependent endpoints return 401 SESSION_EXPIRED; no writes; an active session refreshes lastSeenAt and extends expiresAt
O-12
Replay: verify the same OTP twice
Second call fails; OTP is single use
O-13
20 parallel wrong verifies, then parallel correct+wrong mix
otpAttempts never exceeds 5; at most one success overall; no lost updates
G-03
Price tamper: client sends different price/total
Stored priceMinor equals the DB menu price; order total equals server sum
G-04
Unavailable item; soft-deleted item; item of another hotel; unknown id
Rejected with the right code; nothing written
G-05
Quantity boundaries: 0, -1, 1.5, 1000000, string
VALIDATION_ERROR for invalid; sane maximum enforced
G-06
Notes with HTML/SQL/emoji/very long text
Stored safely or rejected; never executed
G-07
Snapshot integrity: order an item, then change the menu price/name in DB
Existing OrderItem.priceMinor and nameSnapshot unchanged
G-08
Two consecutive orders from the same table (reorder)
Two Order rows, invoiceId null (bill accumulation is Phase 2), no error; documented as expected Phase 1 behavior
8.4 T4: Concurrency and full-day user replays
Concurrency (C):
IDScenarioAssertions
C-01
20 parallel attempts to create an OPEN invoice for the same table (direct DB)
Exactly 1 succeeds, 19 fail with 23505; no deadlock
C-02
50 parallel POST /api/orders from distinct verified sessions across hotels A and B
All succeed (201); DB order counts equal request counts; no cross-hotel rows; p95 latency recorded (target under 500 ms locally, informational)
C-03
O-13 under load
As O-13
C-04
20 parallel orders by the same customer
Visit count behavior matches the single remaining implementation; no lost updates beyond what H15 documents
C-05
200 requests/second burst for 10 seconds on a read endpoint
No connection exhaustion; error rate 0 for valid requests; rate-limited endpoints return RATE_LIMITED rather than 500
Full-day replays (F) , each is an ordered script with DB assertions after every step:
IDStorySteps
F-01
Guest dinner at hotel A, table 5
Scan -> try to order (OTP_REQUIRED) -> send OTP (read from outbox) -> wrong code once -> correct code -> order 3 items -> second order (reorder) -> assert 2 orders, 5 item rows with snapshots, one customer, session verified, no OTP in logs, money all integers
F-02
Two phones, two tables
Phone 1 at table 1, phone 2 at table 2 order concurrently -> orders stay separate, sessions independent, realtime clients without credentials receive nothing
F-03
Owner A's morning
Login ownerA -> session claims -> call every staff endpoint allowed -> try hotel B ids -> all denied; try to change tax/GSTIN -> denied; owner of B sees only B
F-04
Cashier and kitchen on shift
Login cashierA, kitchenA -> allowed/denied per matrix; update an order status within hotel A (200), within hotel B (404)
F-05
Platform admin / ops
Login -> hotelId null -> middleware allows /ops, denies hotel roles; platform-user CLI script creates a user that can log in
F-06
Attacker session
Run the full S-series from an unauthenticated jar and from a logged-in OWNER of A; nothing leaks, nothing writes
F-07
Session dies mid-meal
Verified guest orders -> expire session via SQL -> next order returns SESSION_EXPIRED -> re-scan creates a new session that requires OTP again
F-08
Restart resilience
Restart web while a guest is mid-flow -> cookie session still valid; restart Redis -> OTP rate-limit endpoints fail safe (no 500 leaking details; documented behavior)
F-09
Legacy upgrade day
Run M-02 legacy DB through all migrations, then boot the app against it and replay F-01 and F-03 on the migrated data

9. INDEPENDENT AUDIT AND HANDOFF PACKAGE FOR PUSHKAR
9.1 Independent audit (Wave 5, agent A8, must not be the agent that wrote the code)
Start from a fresh clone of audit-fixes and an empty database. Follow only the written setup instructions. If anything fails, that is a finding.
Re-run the entire test protocol of section 8.
Try to break it: replay S-series with creative variants (header tricks, mixed-case roles, trailing slashes, double encoding, HTTP verb tunneling, cookie tampering, replaying an old session cookie, using hotel A's table id in hotel B's URL, parameter pollution ?hotelId=B&hotelId=A, JSON with duplicate keys, extremely large numbers, Unicode phone digits).
Review diffs for the forbidden patterns: any hotelId taken from body/URL without validation against the session, any raw prisma.<tenantModel> outside src/server/db in code you changed, any money float math, any OTP in logs, any mock import in production paths, any secret.
Check that nothing outside the ownership rules was edited except the logged UI touchpoints.
Output docs/BACKEND_AUDIT.md: findings table (severity, description, evidence, fix commit, re-test result). Zero open high or medium findings is required for the gate.
9.2 Handoff package (Wave 6, agent A9)
Pushkar must be able to start immediately and finish his tasks (P0 to P22) without asking Harshit anything routine. Create:
docs/BACKEND_HANDOFF.md: (a) how to run everything locally from a clean clone (pnpm install, docker compose, .env setup from .env.example plus the new variable names you added, migrations, dev servers, ports); (b) the list of new environment variable names (names only); (c) what changed in the database (migrations table: number, name, what it does, rollback note); (d) what changed in the API (added, removed, changed endpoints); (e) what he can now rely on and the exact import paths: @/lib/money, @/types/auth, @/types/api, getSession, useStaffSession, guards, forHotel, error helpers; (f) known limitations and the Phase 2 TODO list (bill accumulation, realtime JWT, Razorpay create, Order.invoiceId required, visit count once per day); (g) the UI touchpoints summary.
docs/BACKEND_CONTRACTS.md: money, error shape and codes, OTP endpoints (exact request/response JSON and error codes), session cookie rules, role/session types, route-path constants. This is what his apiFetch() and OTP screen are built against. Include real example requests and responses captured from the test run (redacted).
docs/BACKEND_ENDPOINTS.json (machine-readable registry) and a short table in the handoff doc: method, path, auth mode (public | guest-session | staff-role:<roles> | system), request schema summary, response summary, error codes. Mark endpoints scheduled for Phase 2.
docs/BACKEND_TENANT_MODELS.md: the tenant model list (input to his lint rule) and the rule for exempt paths (scripts/, tests/).
docs/MIGRATIONS.md: what each migration does, why, how to roll back pre-launch, backfill script usage (--apply), the local dump/restore procedure, and the Order.invoiceId nullable decision.
docs/phase1-ui-touchpoints.md: every Pushkar-owned file you edited with file, line range, reason (mechanical only).
A smoke script scripts/backend-smoke.sh (or pnpm smoke) that boots against a migrated DB and checks: /api/health (create a minimal health endpoint only if one does not exist: DB and Redis ping, no secrets), a guest scan, OTP send/verify via capture, an order, staff login, a blocked cross-tenant call. Pushkar can run it any time to confirm the backend is healthy.
Fixture reuse note: explain how his seed script (P8) can reuse tests/backend/support/fixtures.ts shapes (hotels A and B, users per role); do not write his seed script.
Confirm and state explicitly that these Pushkar-needed items exist and where: money.ts, types/auth.ts, types/api.ts, StaffSession, getSession, useStaffSession, error helpers, routes.ts constants, the SMS interface (if you had to create it), OTP endpoints, *Minor fields, tax fields on Hotel.
A "Pushkar can start now" checklist in the handoff doc with each of the above ticked and a command that proves it.

10. FINAL GATE (all must be true; show the command output for each)
[ ] git tag -l pre-migration exists; all work is on audit-fixes; no direct commits to main
[ ] prisma migrate deploy on an empty DB succeeds; prisma migrate status clean; schema diff empty
[ ] Migrations present in order: 0_init, 2_money_minor, 3_roles_tenancy, 4_invoice_model, 5_soft_delete, 6_menu_fields, 7_session_otp
[ ] No Float in the schema; no money float math; no new PrismaClient() outside the singleton(s)
[ ] No devOtpCode/otpCode in source; OTP hashed, 6 digits, 5-minute expiry, 5 atomic attempts, cooldown, rate limits; OTP never in responses or logs
[ ] /api/test-seed gone; global GET /api/orders gone; PATCH /api/orders/update guarded; webhook signature enforced with raw body and constant-time compare
[ ] Realtime interim lock-down verified; CORS limited; cookie flags correct; no stack traces to clients
[ ] middleware.ts, requireRole, requireGuestSession, permission map and forHotel in place and used by every touched handler
[ ] Every scenario ID in section 8 executed; docs/BACKEND_TEST_REPORT.md shows 0 failing and 0 skipped without justification
[ ] docs/BACKEND_AUDIT.md has zero open high/medium findings
[ ] pnpm typecheck, pnpm lint, pnpm build pass on audit-fixes
[ ] Handoff package (section 9.2) complete and the smoke script passes from a fresh clone
[ ] docs/phase1-progress.md shows H0 to H16 as verified
[ ] No secrets in the diff or history added by this work; any pre-existing secret exposure listed in docs/phase1-questions.md for the human to rotate
[ ] docs/phase1-questions.md contains every open question and every manual item for the human
If any item cannot be met, say so explicitly in the final report with the reason. Do not mark an item as done without evidence.

11. FINAL REPORT FORMAT (what you send to Harshit at the end)
Summary: one paragraph: what was done, what is verified, what is open.
Task table: H0 to H16 with status, branch, commit SHAs, and the proof IDs from section 7.
Test results: counts by suite (passed/failed/skipped), link to docs/BACKEND_TEST_REPORT.md, notable findings and fixes.
Audit results: summary of docs/BACKEND_AUDIT.md.
Deviations from this prompt (for example Order.invoiceId nullable, UI touchpoints, anything the docs forced you to change) with reasons.
Things only a human can do: secret rotation, DLT/SMS provider account, Razorpay keys, CA confirmation of the GST rate (500 bp is a placeholder), real-device checks, production database decisions, confirming /login and other route paths with Pushkar.
Pushkar handoff status: the checklist from 9.2 with pass/fail, and the exact first commands he should run.
Risks and follow-ups for Phase 2.

12. RULES OF ENGAGEMENT FOR EVIDENCE AND HONESTY
No claim without proof. "Done", "fixed", "passes" must be backed by command output, a test result, or a SQL result recorded in docs/phase1-progress.md or the test report.
Run the checks yourself; do not assume that code which "looks right" works.
Never edit a test to hide a failure. If a test is wrong, explain why in the report and fix it transparently.
If the real codebase differs from section 2.2, follow the real codebase and document the difference; do not force the audit's description onto it.
If a requirement here conflicts with the official Prisma/Next.js/NextAuth documentation or with the actual installed versions, follow the documentation, record the difference, and continue.
Keep diffs small and reviewable. Prefer the smallest change that solves the problem (the PRD's change policy).
When you finish a wave, update docs/phase1-progress.md before starting the next one.
Stop and ask the human only for: remote or real-data operations, secret rotation, ambiguous Prisma 7 configuration, and any decision that this prompt marks as human-only.
BEGIN WITH WAVE 0 NOW.
