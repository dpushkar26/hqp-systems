import { getSession } from "./session";
import { UserRole } from "@/types/auth";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/prisma";

export class AuthError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getSession();
  if (!session?.user) {
    throw new AuthError(401, "Unauthorized");
  }

  const user = session.user as any;
  if (!user.isActive || user.deletedAt) {
    throw new AuthError(401, "Account is disabled or deleted");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new AuthError(403, "Forbidden");
  }

  return {
    user,
    hotelId: user.hotelId,
  };
}

export async function requireGuestSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("active_session_id")?.value;

  if (!sessionId) {
    throw new AuthError(401, "No active session");
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new AuthError(401, "Session not found");
  }

  if (session.expiresAt < new Date()) {
    throw new AuthError(401, "Session expired");
  }

  return {
    sessionId: session.id,
    hotelId: session.hotelId,
    tableId: session.tableId,
    customerId: session.customerId,
  };
}
