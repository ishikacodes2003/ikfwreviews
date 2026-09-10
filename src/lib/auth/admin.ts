import { timingSafeEqual } from "node:crypto";

export interface AdminCredentials {
  email: string;
  password: string;
  username: string;
  isConfigured: boolean;
}

export function getAdminCredentials(): AdminCredentials {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const username = (
    process.env.ADMIN_USERNAME ||
    (email ? email.split("@")[0] : "") ||
    "admin"
  ).trim().toLowerCase();

  return {
    email,
    password,
    username,
    isConfigured: Boolean(email && password),
  };
}

export function isAdminIdentifier(identifier: string): boolean {
  if (!identifier) return false;
  const normalized = identifier.trim().toLowerCase();
  const { email, username } = getAdminCredentials();
  return (Boolean(email) && normalized === email) || (Boolean(username) && normalized === username);
}

export function verifyAdminPassword(password: string): boolean {
  const { password: expectedPassword, isConfigured } = getAdminCredentials();
  if (!isConfigured || !expectedPassword || !password) return false;

  const actualBuf = Buffer.from(password);
  const expectedBuf = Buffer.from(expectedPassword);

  if (actualBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(actualBuf, expectedBuf);
}

export function matchesAdminCredentials(identifier: string, password: string): boolean {
  return isAdminIdentifier(identifier) && verifyAdminPassword(password);
}
