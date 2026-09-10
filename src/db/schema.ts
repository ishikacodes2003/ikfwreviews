import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const reviewStatusEnum = ["published", "hidden"] as const;
const userRoleEnum = ["user", "admin"] as const;

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

export const userRoles = mysqlTable("user_roles", {
  userId: varchar("user_id", { length: 36 }).primaryKey().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  role: mysqlEnum("role", userRoleEnum).notNull().default("user"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const seasons = mysqlTable(
  "seasons",
  {
    id: varchar("id", { length: 100 }).primaryKey(),
    name: text("name").notNull(),
    shortName: varchar("short_name", { length: 255 }),
    active: boolean("active").notNull().default(true),
    sortOrder: int("sort_order").notNull().default(0),
  },
  (table) => [index("seasons_active_sort_idx").on(table.active, table.sortOrder)],
);

export const reviews = mysqlTable(
  "reviews",
  {
    id: varchar("id", { length: 100 }).primaryKey(),
    parentName: text("parent_name").notNull(),
    city: varchar("city", { length: 255 }),
    rating: int("rating").notNull(),
    seasonId: varchar("season_id", { length: 100 })
      .notNull()
      .references(() => seasons.id, { onDelete: "restrict", onUpdate: "cascade" }),
    childExperienceHighlight: text("child_experience_highlight"),
    reviewText: text("review_text").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    verified: boolean("verified").notNull().default(true),
    helpfulCount: int("helpful_count").notNull().default(0),
    images: json("images").$type<string[]>().notNull(),
    status: mysqlEnum("status", reviewStatusEnum).notNull().default("published"),
    eventName: varchar("event_name", { length: 255 }),
    initial: varchar("initial", { length: 10 }),
    authorUserId: varchar("author_user_id", { length: 36 }).references(() => users.id, { onDelete: "set null", onUpdate: "cascade" }),
  },
  (table) => [
    check("reviews_rating_check", sql`${table.rating} between 1 and 5`),
    check("reviews_helpful_count_check", sql`${table.helpfulCount} >= 0`),
    index("reviews_status_created_idx").on(table.status, table.createdAt),
    index("reviews_season_idx").on(table.seasonId),
    index("reviews_city_idx").on(table.city),
    index("reviews_author_user_idx").on(table.authorUserId),
  ],
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type SessionRow = typeof sessions.$inferSelect;
export type SeasonRow = typeof seasons.$inferSelect;
export type NewSeasonRow = typeof seasons.$inferInsert;
export type ReviewRow = typeof reviews.$inferSelect;
export type NewReviewRow = typeof reviews.$inferInsert;
export type UserRoleRow = typeof userRoles.$inferSelect;
