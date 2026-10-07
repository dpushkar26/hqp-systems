export type UserRole = 'GUEST' | 'STAFF' | 'ADMIN';

export interface StaffSession {
  userId: string;
  role: UserRole;
  expiresAt: Date;
}
