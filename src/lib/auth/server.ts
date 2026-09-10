import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq, and, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, userRoles, users } from "@/db/schema";

export type AppUser = { id: string; name: string; email: string; emailVerified: boolean; image: string | null };
export const SESSION_COOKIE = "ikfw_session";
const SESSION_DAYS = 30;

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;
    const db = getDb();
    if (!db) return null;
    const [row] = await db
      .select({ id: users.id, name: users.name, email: users.email, emailVerified: users.emailVerified, image: users.image })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("Database error in getCurrentUser:", error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<"user" | "admin"> {
  try {
    const db = getDb();
    if (!db) return "user";
    const [record] = await db.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, userId)).limit(1);
    return record?.role ?? "user";
  } catch (error) {
    console.error("Database error in getUserRole:", error);
    return "user";
  }
}

export function rejectCrossOriginRequest(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  return null;
}

export async function authorizeAdminRequest(request: NextRequest, checkOrigin = false): Promise<NextResponse | null> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
  if ((await getUserRole(user.id)) !== "admin") return NextResponse.json({ error: "Admin role required." }, { status: 403 });
  if (checkOrigin) { const rejected = rejectCrossOriginRequest(request); if (rejected) return rejected; }
  return null;
}

export function sessionExpiry() { return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000); }
