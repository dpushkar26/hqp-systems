export type UserRole = 'PLATFORM_ADMIN' | 'PLATFORM_OPS' | 'OWNER' | 'MANAGER' | 'CASHIER' | 'KITCHEN' | 'WAITER';

export interface StaffSession {
  id: string;
  role: UserRole;
  hotelId: string | null;
  isActive: boolean;
  deletedAt: Date | null;
}
