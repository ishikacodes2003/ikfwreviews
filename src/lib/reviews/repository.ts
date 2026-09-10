import type { ReviewRepository } from "./types";
import { ApiReviewRepository } from "./apiReviewRepository";

let defaultRepository: ReviewRepository | null = null;
let adminRepository: ReviewRepository | null = null;

/** Returns the browser-safe repository backed by the application's API routes. */
export function getReviewRepository(): ReviewRepository {
  if (!defaultRepository) {
    defaultRepository = new ApiReviewRepository(false);
  }
  return defaultRepository;
}

export function getAdminReviewRepository(): ReviewRepository {
  if (!adminRepository) adminRepository = new ApiReviewRepository(true);
  return adminRepository;
}
