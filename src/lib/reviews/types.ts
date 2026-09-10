export type RatingValue = 1 | 2 | 3 | 4 | 5;

export type ReviewStatus = "published" | "hidden";

export interface Season {
  id: string;
  name: string;
  shortName?: string;
  active: boolean;
  sortOrder?: number;
}

export interface Review {
  id: string;
  parentName: string;
  name?: string; // Compatibility alias with parentName
  city?: string | null;
  rating: RatingValue;
  seasonId: string;
  season?: string; // Resolved human-readable season name
  childExperienceHighlight?: string | null;
  reviewText: string;
  text?: string; // Compatibility alias with reviewText
  createdAt: string; // ISO 8601 string, e.g. "2026-08-14T10:30:00Z"
  verified: boolean;
  helpfulCount: number;
  images: string[];
  status: ReviewStatus;
  eventName?: string;
  initial?: string;
  authorUserId?: string | null;
}

export interface RatingDistributionItem {
  stars: RatingValue;
  count: number;
  percent: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: RatingDistributionItem[];
}

export interface CityStat {
  city: string;
  count: number;
}

export type ReviewSortOption =
  | "Most Recent"
  | "Oldest"
  | "Most Helpful"
  | "Highest Rating"
  | "Lowest Rating";

export type RatingFilterOption =
  | "All Ratings"
  | "5 Stars"
  | "4 Stars"
  | "3 Stars"
  | "2 Stars"
  | "1 Star";

export interface ReviewFilterOptions {
  city?: string;
  season?: string;
  seasonId?: string;
  rating?: RatingFilterOption | string;
  sort?: ReviewSortOption | string;
  verifiedOnly?: boolean;
  status?: "published" | "hidden" | "all";
  includeHidden?: boolean;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export interface ReviewRepository {
  getAllReviews(includeHidden?: boolean): Promise<Review[]>;
  getReviews(options?: ReviewFilterOptions): Promise<PaginatedResult<Review>>;
  getReviewById(id: string): Promise<Review | null>;
  getStats(): Promise<ReviewStats>;
  getCities(): Promise<CityStat[]>;
  createReview(review: Review): Promise<void>;
  updateReview(id: string, review: Partial<Review>): Promise<void>;
  deleteReview(id: string): Promise<void>;
  resetToSeedData(): Promise<void>;
  importReviews(reviews: Review[]): Promise<void>;
}

export interface SeasonRepository {
  getSeasons(includeInactive?: boolean): Promise<Season[]>;
  getSeasonById(id: string): Promise<Season | null>;
  createSeason(season: Season): Promise<void>;
  updateSeason(id: string, season: Partial<Season>): Promise<void>;
  deleteSeason(id: string): Promise<void>;
  resetToSeedData(): Promise<void>;
  importSeasons(seasons: Season[]): Promise<void>;
}
