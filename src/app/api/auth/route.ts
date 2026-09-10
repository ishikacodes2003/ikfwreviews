import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "@/db";
import { sessions, userRoles, users } from "@/db/schema";
import { SESSION_COOKIE, sessionExpiry } from "@/lib/auth/server";

function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const hash = scryptSync(password, salt, 64).toString("hex"); return `${salt}:${hash}`; }
function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(":"); if (!salt || !hash) return false; const actual = scryptSync(password, salt, 64); const expected = Buffer.from(hash, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); }
function publicUser(user: typeof users.$inferSelect) { return { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, image: user.image }; }
function cookieOptions(expires: Date) { return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", expires }; }

export async function GET() {
  const { getCurrentUser } = await import("@/lib/auth/server");
  return NextResponse.json({ user: await getCurrentUser() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body?.action;
    if (action === "session") { const { getCurrentUser } = await import("@/lib/auth/server"); return NextResponse.json({ user: await getCurrentUser() }); }
    const db = getDb();
    if (action === "sign-out") {
      const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
      if (sessionId && db) {
        try {
          await db.delete(sessions).where(eq(sessions.id, sessionId));
        } catch (err) {
          console.error("Failed to delete session from DB on sign-out:", err);
        }
      }
      const response = NextResponse.json({ ok: true }); response.cookies.set(SESSION_COOKIE, "", cookieOptions(new Date(0))); return response;
    }
    if (!db) return NextResponse.json({ error: "Database service is not configured or unavailable." }, { status: 503 });
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    if (!email || !password || password.length < 8) return NextResponse.json({ error: "Enter a valid email and a password of at least 8 characters." }, { status: 400 });

    if (action === "sign-up") {
      const name = String(body?.name || "").trim();
      if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
      const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      const id = randomUUID();
      const user = { id, name, email, passwordHash: hashPassword(password), emailVerified: true, image: null, createdAt: new Date(), updatedAt: new Date() };
      await db.transaction(async (tx) => {
        await tx.insert(users).values(user);
        await tx.insert(userRoles).values({ userId: id, role: process.env.ADMIN_EMAIL?.trim().toLowerCase() === email ? "admin" : "user" });
      });
      const sessionId = randomBytes(32).toString("hex"); const expiresAt = sessionExpiry();
      await db.insert(sessions).values({ id: sessionId, userId: id, expiresAt, createdAt: new Date() });
      const response = NextResponse.json({ user: publicUser(user) }, { status: 201 }); response.cookies.set(SESSION_COOKIE, sessionId, cookieOptions(expiresAt)); return response;
    }

    if (action === "sign-in") {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      const sessionId = randomBytes(32).toString("hex"); const expiresAt = sessionExpiry();
      await db.insert(sessions).values({ id: sessionId, userId: user.id, expiresAt, createdAt: new Date() });
      const response = NextResponse.json({ user: publicUser(user) }); response.cookies.set(SESSION_COOKIE, sessionId, cookieOptions(expiresAt)); return response;
    }
    return NextResponse.json({ error: "Unsupported authentication action." }, { status: 400 });
  } catch (error) { console.error("Auth error", error); return NextResponse.json({ error: "Authentication service error." }, { status: 500 }); }
}
