import { UserRole } from "@prisma/client";

export interface StaffSession {
  id: string;
  role: UserRole;
  hotelId: string | null;
  isActive: boolean;
  deletedAt: Date | null;
}
