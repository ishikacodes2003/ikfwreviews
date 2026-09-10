import type { RatingValue, Review, ReviewStatus, Season } from "@/lib/reviews/types";
import { ApiError } from "./errors";

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "Expected a JSON object.");
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${field} is required.`);
  }
  return value.trim();
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function rating(value: unknown): RatingValue {
  if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > 5) {
    throw new ApiError(400, "rating must be an integer from 1 to 5.");
  }
  return Number(value) as RatingValue;
}

function status(value: unknown): ReviewStatus {
  if (value !== "published" && value !== "hidden") {
    throw new ApiError(400, "status must be published or hidden.");
  }
  return value;
}

export function parseReview(value: unknown, publicSubmission = false): Review {
  const input = record(value);
  const parentName = requiredString(input.parentName ?? input.name, "parentName");
  const reviewText = requiredString(input.reviewText ?? input.text, "reviewText");
  const createdAt = publicSubmission ? new Date() : new Date(String(input.createdAt || ""));
  if (!publicSubmission && Number.isNaN(createdAt.getTime())) {
    throw new ApiError(400, "createdAt must be a valid ISO timestamp.");
  }

  return {
    id: publicSubmission ? `rev-${crypto.randomUUID()}` : requiredString(input.id, "id"),
    parentName,
    name: parentName,
    city: optionalString(input.city),
    rating: rating(input.rating),
    seasonId: requiredString(input.seasonId, "seasonId"),
    childExperienceHighlight: optionalString(input.childExperienceHighlight),
    reviewText,
    text: reviewText,
    createdAt: createdAt.toISOString(),
    verified: publicSubmission ? true : input.verified !== false,
    helpfulCount:
      publicSubmission || !Number.isInteger(input.helpfulCount)
        ? 0
        : Math.max(0, Number(input.helpfulCount)),
    images:
      !publicSubmission && Array.isArray(input.images)
        ? input.images.filter((item): item is string => typeof item === "string")
        : [],
    status: publicSubmission ? "published" : status(input.status ?? "published"),
    eventName: optionalString(input.eventName) ?? "India Kids Fashion Week",
    initial: optionalString(input.initial) ?? parentName.charAt(0).toUpperCase(),
  };
}

export function parseReviewPatch(value: unknown): Partial<Review> {
  const input = record(value);
  const output: Partial<Review> = {};
  if ("parentName" in input || "name" in input) {
    output.parentName = requiredString(input.parentName ?? input.name, "parentName");
  }
  if ("reviewText" in input || "text" in input) {
    output.reviewText = requiredString(input.reviewText ?? input.text, "reviewText");
  }
  if ("city" in input) output.city = optionalString(input.city);
  if ("rating" in input) output.rating = rating(input.rating);
  if ("seasonId" in input) output.seasonId = requiredString(input.seasonId, "seasonId");
  if ("childExperienceHighlight" in input) {
    output.childExperienceHighlight = optionalString(input.childExperienceHighlight);
  }
  if ("verified" in input) output.verified = Boolean(input.verified);
  if ("helpfulCount" in input) {
    if (!Number.isInteger(input.helpfulCount) || Number(input.helpfulCount) < 0) {
      throw new ApiError(400, "helpfulCount must be a non-negative integer.");
    }
    output.helpfulCount = Number(input.helpfulCount);
  }
  if ("images" in input) {
    if (!Array.isArray(input.images) || input.images.some((item) => typeof item !== "string")) {
      throw new ApiError(400, "images must be an array of strings.");
    }
    output.images = input.images as string[];
  }
  if ("status" in input) output.status = status(input.status);
  if ("eventName" in input) output.eventName = optionalString(input.eventName) ?? undefined;
  if ("initial" in input) output.initial = optionalString(input.initial) ?? undefined;
  if ("createdAt" in input) {
    const date = new Date(String(input.createdAt));
    if (Number.isNaN(date.getTime())) throw new ApiError(400, "createdAt is invalid.");
    output.createdAt = date.toISOString();
  }
  return output;
}

export function parseSeason(value: unknown): Season {
  const input = record(value);
  const sortOrder = input.sortOrder === undefined ? 0 : Number(input.sortOrder);
  if (!Number.isInteger(sortOrder)) throw new ApiError(400, "sortOrder must be an integer.");
  return {
    id: requiredString(input.id, "id"),
    name: requiredString(input.name, "name"),
    shortName: optionalString(input.shortName) ?? undefined,
    active: input.active !== false,
    sortOrder,
  };
}

export function parseSeasonPatch(value: unknown): Partial<Season> {
  const input = record(value);
  const output: Partial<Season> = {};
  if ("name" in input) output.name = requiredString(input.name, "name");
  if ("shortName" in input) output.shortName = optionalString(input.shortName) ?? undefined;
  if ("active" in input) output.active = Boolean(input.active);
  if ("sortOrder" in input) {
    const sortOrder = Number(input.sortOrder);
    if (!Number.isInteger(sortOrder)) throw new ApiError(400, "sortOrder must be an integer.");
    output.sortOrder = sortOrder;
  }
  return output;
}

export function parseImport(value: unknown): { reviews: Review[]; seasons: Season[] } {
  const input = record(value);
  if (!Array.isArray(input.reviews) || !Array.isArray(input.seasons)) {
    throw new ApiError(400, "Import data must contain reviews and seasons arrays.");
  }
  return {
    reviews: input.reviews.map((item) => parseReview(item, false)),
    seasons: input.seasons.map(parseSeason),
  };
}
