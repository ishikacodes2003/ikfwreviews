import type { SeasonRepository } from "./types";
import { ApiSeasonRepository } from "./apiSeasonRepository";

let defaultSeasonRepository: SeasonRepository | null = null;
let adminSeasonRepository: SeasonRepository | null = null;

/** Returns the browser-safe repository backed by the application's API routes. */
export function getSeasonRepository(): SeasonRepository {
  if (!defaultSeasonRepository) {
    defaultSeasonRepository = new ApiSeasonRepository(false);
  }
  return defaultSeasonRepository;
}

export function getAdminSeasonRepository(): SeasonRepository {
  if (!adminSeasonRepository) adminSeasonRepository = new ApiSeasonRepository(true);
  return adminSeasonRepository;
}
