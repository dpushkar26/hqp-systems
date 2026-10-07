"use client";

import { useSession } from "next-auth/react";
import { StaffSession } from "@/types/auth";

export function useStaffSession(): StaffSession | null {
  const { data: session } = useSession();
  if (!session?.user) return null;
  
  const user = session.user as any;
  return {
    id: user.id,
    role: user.role,
    hotelId: user.hotelId,
    isActive: user.isActive,
    deletedAt: user.deletedAt,
  };
}
