import { UserRole } from "@prisma/client";

export type Capability = 
  | "hotel:create"
  | "hotel:approve"
  | "hotel:go-live"
  | "hotel:suspend"
  | "hotel:profile"
  | "hotel:financials"
  | "tables:manage"
  | "menu:write"
  | "menu:availability"
  | "orders:read"
  | "orders:update"
  | "orders:cancel"
  | "bills:generate"
  | "bills:settle"
  | "bills:refund"
  | "reports:view"
  | "staff:manage";

export const PERMISSIONS: Record<Capability, UserRole[]> = {
  "hotel:create": ["PLATFORM_ADMIN", "PLATFORM_OPS"],
  "hotel:approve": ["PLATFORM_ADMIN"],
  "hotel:go-live": ["PLATFORM_ADMIN", "PLATFORM_OPS"],
  "hotel:suspend": ["PLATFORM_ADMIN"],
  "hotel:profile": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER"],
  "hotel:financials": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER"],
  "tables:manage": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER"],
  "menu:write": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER"],
  "menu:availability": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER", "KITCHEN"],
  "orders:read": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER", "CASHIER", "KITCHEN"],
  "orders:update": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER", "CASHIER", "KITCHEN"],
  "orders:cancel": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER", "CASHIER"],
  "bills:generate": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER", "CASHIER"],
  "bills:settle": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER", "CASHIER"],
  "bills:refund": ["PLATFORM_ADMIN", "OWNER", "MANAGER"],
  "reports:view": ["PLATFORM_ADMIN", "PLATFORM_OPS", "OWNER", "MANAGER"],
  "staff:manage": ["PLATFORM_ADMIN", "OWNER", "MANAGER"],
};
