import "server-only";

import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

export type Database = ReturnType<typeof createDatabase>;

let database: Database | undefined;
let lastDbFailureTime = 0;
const FAILURE_COOLDOWN_MS = 15_000;
let hasLoggedMissingUrl = false;

function createDatabase(databaseUrl: string) {
  const pool = mysql.createPool({
    uri: databaseUrl,
    connectTimeout: 3000,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  });
  return drizzle(pool, { schema, mode: "default" });
}

export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL?.trim();
}

export function isDatabaseConfigured(): boolean {
  const url = getDatabaseUrl();
  return Boolean(url && url.length > 0);
}

export function markDatabaseFailure(error: unknown) {
  lastDbFailureTime = Date.now();
  console.error("Database connection/query error (cooling down for 15s before retrying). Falling back to hardcoded data:", error);
}

export function isDatabaseInCooldown(): boolean {
  if (lastDbFailureTime === 0) return false;
  const elapsed = Date.now() - lastDbFailureTime;
  if (elapsed < FAILURE_COOLDOWN_MS) {
    return true;
  }
  return false;
}

export function logMissingDbOnce() {
  if (!hasLoggedMissingUrl) {
    console.error("DATABASE_URL is not configured or does not exist. Operating in fallback mode with hardcoded reviews and seasons.");
    hasLoggedMissingUrl = true;
  }
}

export function getDb(): Database | null {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    logMissingDbOnce();
    return null;
  }
  if (!database) {
    try {
      database = createDatabase(databaseUrl);
    } catch (error) {
      markDatabaseFailure(error);
      return null;
    }
  }
  return database;
}

