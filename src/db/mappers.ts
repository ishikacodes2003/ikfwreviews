import type { Review, Season } from "@/lib/reviews/types";
import type { NewReviewRow, NewSeasonRow, ReviewRow, SeasonRow } from "./schema";

export function seasonFromRow(row: SeasonRow): Season {
  return {
    id: row.id,
    name: row.name,
    shortName: row.shortName ?? undefined,
    active: row.active,
    sortOrder: row.sortOrder,
  };
}

export function seasonToRow(season: Season): NewSeasonRow {
  return {
    id: season.id,
    name: season.name,
    shortName: season.shortName || null,
    active: season.active,
    sortOrder: season.sortOrder ?? 0,
  };
}

export function reviewFromRow(row: ReviewRow, seasonName?: string | null): Review {
  return {
    id: row.id,
    parentName: row.parentName,
    name: row.parentName,
    city: row.city,
    rating: row.rating as Review["rating"],
    seasonId: row.seasonId,
    season: seasonName ?? undefined,
    childExperienceHighlight: row.childExperienceHighlight,
    reviewText: row.reviewText,
    text: row.reviewText,
    createdAt: row.createdAt.toISOString(),
    verified: row.verified,
    helpfulCount: row.helpfulCount,
    images: Array.isArray(row.images) ? row.images : typeof row.images === "string" ? (() => { try { const parsed = JSON.parse(row.images); return Array.isArray(parsed) ? parsed : []; } catch { return []; } })() : [],
    status: row.status,
    eventName: row.eventName ?? undefined,
    initial: row.initial ?? row.parentName.charAt(0).toUpperCase(),
    authorUserId: row.authorUserId,
  };
}

export function reviewToRow(review: Review): NewReviewRow {
  const parentName = review.parentName || review.name || "Anonymous Parent";
  return {
    id: review.id,
    parentName,
    city: review.city || null,
    rating: review.rating,
    seasonId: review.seasonId,
    childExperienceHighlight: review.childExperienceHighlight || null,
    reviewText: review.reviewText || review.text || "",
    createdAt: new Date(review.createdAt),
    verified: review.verified,
    helpfulCount: review.helpfulCount,
    images: Array.isArray(review.images) ? review.images : [],
    status: review.status,
    eventName: review.eventName || null,
    initial: review.initial || parentName.charAt(0).toUpperCase(),
    authorUserId: review.authorUserId || null,
  };
}
