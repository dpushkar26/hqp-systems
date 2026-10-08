# Codebase Status Report (Wave 0)

## Backend Endpoint Audit

| Path | Methods | Auth Check | Zod | Models Touched | hotelId Source | Response Shapes |
|---|---|---|---|---|---|---|
| `/api/auth/forgot-password` | POST | none | no | User, PasswordResetToken | N/A | 200: { success: true }, 400: { error: "Email is required" }, 500 |
| `/api/auth/otp/send` | POST | session | yes | Session, Customer | DB (`session.hotelId`) | 200: { success: true, message: string, devOtpCode: string }, 400/401/500 |
| `/api/auth/otp/verify` | POST | session | yes | Session, Customer | DB (`session.customerId`) | 200: { success: true, message: string, visitCount: number }, 400/401/500 |
| `/api/auth/reset-password` | POST | none | no | PasswordResetToken, User | N/A | 200: { success: true }, 400/500 |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth | no | User, Account, Session, VerificationToken | N/A | Standard NextAuth JSON |
| `/api/orders` | POST, GET | POST: session<br>GET: none ⚠️ | POST: yes<br>GET: no | Session, MenuItem, Order, OrderItem | POST: DB (`session.hotelId`)<br>GET: Nowhere ⚠️ | POST: 200/400/401/403/500<br>GET: 200/500 |
| `/api/orders/update` | PATCH | none ⚠️ | no | Order | DB (`order.hotelId`) | 200: { success: true, order }, 500 |
| `/api/payments/create` | POST | none ⚠️ | no | Order, Payment | N/A | 200/400/404/500 |
| `/api/payments/webhook` | POST | none ⚠️ | no | Payment, Order | DB (`payment.order.hotelId`) | 200/500 |
| `/api/session/init` | POST | none | yes | Table, Session | Request body | 200/400/500 |
| `/api/session/orders` | GET | session | no | Session, Order | DB (`session.hotelId`) | 200/401/500 |
| `/api/test-seed` | POST | none ⚠️ | no | Hotel, Table, MenuCategory, MenuItem | Hardcoded `'hqsp-demo'` | 200/500 |
| `/[hotelId]/table/[tableId]` | GET | none | no | Table, Session | URL path params | 307 Redirect, 400 |

## Server Actions Audit

- **billing.ts**: `generateInvoice`. Zod validated. Creates Invoice/Payment, uses Razorpay. Instantiates unpooled `new PrismaClient()`.
- **customer.ts**: `getCustomerProfile`. Zod validated. Queries Customer and relations. Instantiates unpooled `new PrismaClient()`.
- **dashboard.ts**: `generateReceipt`, `sendBillToWhatsApp`, `exportDailyBillsToExcel`. Uses BullMQ and XLSX. Instantiates unpooled `new PrismaClient()`.
- **ordering.ts**: `createOrder`. Zod validated. Creates Order/Payment, uses Razorpay, Redis, BullMQ. Atomic visitCount increment. Instantiates unpooled `new PrismaClient()`.
- **auth.ts**: `registerOwner`, `verifyOwnerOTP`. Uses shared singleton `prisma`. NextAuth credentials flow.

## Database & Prisma State

- Prisma 7.10.0 with `@prisma/adapter-pg`.
- **4 Float fields**: `MenuItem.price`, `Invoice.totalAmount`, `OrderItem.price`, `Payment.amount`. Codebase does float math on these fields.
- **5 places** `new PrismaClient()` is called: 1 singleton, 4 bypassed in Server Actions.
- **0 migrations**: `apps/web/prisma/migrations` does not exist.
- `WebhookEvent` model exists but is completely unused.
- `visitCount` increment occurs both on OTP verification and Order Creation (atomic SQL).

## Security & Auth State

- Webhook signature check is commented out.
- Socket room join is unauthenticated, allowing IDOR. CORS is overly permissive.
- `/api/test-seed` is completely unauthenticated and active in production.
- `GET /api/orders` leaks all orders globally.
- `PATCH /api/orders/update` has no auth or tenant checks.
- `devOtpCode` leaks OTP plaintext in the response. No rate limiting or attempt lockouts.
- OTP is only 4 digits, stored plaintext.
- No exposed production secrets in git history, but insecure default fallback secrets exist in code.

## Version List

- **Node.js**: `v24.18.0`
- **pnpm**: `9.15.9`
- **Next.js**: `16.3.5`
- **Prisma**: `7.10.0`
- **Zod**: `4.6.5`
- **NextAuth**: `4.24.15`
