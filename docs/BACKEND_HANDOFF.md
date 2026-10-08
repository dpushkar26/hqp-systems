# Pushkar Backend Handoff

## 1. Setup Instructions
To run locally:
1. `pnpm install`
2. `docker compose -f infra/docker-compose.test.yml up -d`
3. Configure `.env` from `.env.example`.
4. `pnpm prisma migrate deploy`
5. `pnpm dev`

## 2. New Environment Variables
- `SMS_PROVIDER` (set to `capture` in local dev)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## 3. Database Changes
All float money fields migrated to `*Minor` paise integers.
Enums strictly typed (`OrderStatus`, `PaymentStatus`).
Session schema handles 6-digit OTPs with attempt tracking and expiry.

## 4. What You Can Rely On
- `import { formatINR, add, percentBp, roundOff } from '@/lib/money'`
- `import { useStaffSession } from '@/hooks/useStaffSession'`
- `import { getSession } from '@/server/auth/session'`
- API error shape: `{ error: { code, message } }`

## 5. Phase 2 TODOs (Limitations)
- Bill accumulation
- Realtime JWT handshake
- Razorpay order creation integration
- `Order.invoiceId` made required

## 6. Readiness Checklist
- [x] `money.ts`
- [x] `types/auth.ts`
- [x] `types/api.ts`
- [x] `StaffSession` & `useStaffSession`
- [x] Error helpers
- [x] Routes constants
- [x] SMS interface
- [x] OTP endpoints
- [x] `*Minor` fields
- [x] Tax fields on Hotel

Command to prove readiness: `pnpm typecheck` returns 0.
