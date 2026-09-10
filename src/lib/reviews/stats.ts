import type {
  CityStat,
  RatingDistributionItem,
  RatingValue,
  Review,
  ReviewFilterOptions,
  ReviewStats,
  PaginatedResult,
  Season,
} from "./types";

export const PREDEFINED_CITIES = [
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Bangalore",
  "Pune",
  "Ahmedabad",
  "Chandigarh",
  "Kolkata",
  "Jaipur",
  "Chennai",
  "Nagpur",
  "Lucknow",
  "Indore",
  "Surat",
  "Goa",
] as const;

/**
 * Resolves human-readable season name from seasonId
 */
export function resolveSeasonName(seasonId: string, seasons: Season[] = []): string {
  const match = seasons.find((s) => s.id === seasonId);
  if (match) return match.name;

  // Fallback pattern matching
  const numMatch = seasonId.match(/season-(\d+)/i);
  if (numMatch) {
    return `India Kids Fashion Week - Season ${numMatch[1]}`;
  }
  return seasonId;
}

/**
 * Calculates total reviews, overall average rating, and star distribution
 * Defaults to only published reviews unless explicitly overridden
 */
export function calculateReviewStats(reviews: Review[], includeHidden: boolean = false): ReviewStats {
  const targetReviews = includeHidden ? reviews : reviews.filter((r) => r.status === "published");
  const totalReviews = targetReviews.length;

  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      distribution: [
        { stars: 5, count: 0, percent: 0 },
        { stars: 4, count: 0, percent: 0 },
        { stars: 3, count: 0, percent: 0 },
        { stars: 2, count: 0, percent: 0 },
        { stars: 1, count: 0, percent: 0 },
      ],
    };
  }

  const totalScore = targetReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = Number((totalScore / totalReviews).toFixed(1));

  const starsList: RatingValue[] = [5, 4, 3, 2, 1];
  const distribution: RatingDistributionItem[] = starsList.map((stars) => {
    const count = targetReviews.filter((r) => r.rating === stars).length;
    const percent = Math.round((count / totalReviews) * 100);
    return { stars, count, percent };
  });

  return {
    totalReviews,
    averageRating,
    distribution,
  };
}

/**
 * Computes city counts dynamically from published reviews
 */
export function calculateCityDistribution(reviews: Review[], includeHidden: boolean = false): CityStat[] {
  const targetReviews = includeHidden ? reviews : reviews.filter((r) => r.status === "published");
  const countsMap = new Map<string, number>();

  for (const city of PREDEFINED_CITIES) {
    countsMap.set(city, 0);
  }

  for (const review of targetReviews) {
    if (review.city) {
      countsMap.set(review.city, (countsMap.get(review.city) || 0) + 1);
    }
  }

  const cityStats: CityStat[] = [
    { city: "All Cities", count: targetReviews.length },
  ];

  for (const [city, count] of countsMap.entries()) {
    cityStats.push({ city, count });
  }

  return cityStats;
}

/**
 * Filters and sorts reviews according to the specified options
 */
export function filterAndSortReviews(
  reviews: Review[],
  options: ReviewFilterOptions = {}
): Review[] {
  const {
    city = "All Cities",
    season = "All Seasons",
    seasonId,
    rating = "All Ratings",
    sort = "Most Recent",
    verifiedOnly = false,
    status,
    includeHidden = false,
    searchQuery = "",
  } = options;

  let filtered = [...reviews];

  // Status filter: by default public views only show "published"
  if (status === "published") {
    filtered = filtered.filter((r) => r.status === "published");
  } else if (status === "hidden") {
    filtered = filtered.filter((r) => r.status === "hidden");
  } else if (status === "all" || includeHidden) {
    // Keep both published and hidden
  } else {
    // Default public behavior
    filtered = filtered.filter((r) => r.status === "published");
  }

  // City filter
  if (city && city !== "All Cities") {
    filtered = filtered.filter((r) => (r.city || "").toLowerCase() === city.toLowerCase());
  }

  // Season filter
  if (seasonId && seasonId !== "all") {
    filtered = filtered.filter((r) => r.seasonId === seasonId);
  } else if (season && season !== "All Seasons") {
    const norm = season.toLowerCase().replace(/[^a-z0-9]/g, "");
    filtered = filtered.filter((r) => {
      const rSeason = r.season || "";
      const rId = r.seasonId || "";
      const rNorm = rSeason.toLowerCase().replace(/[^a-z0-9]/g, "");
      const rIdNorm = rId.toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        rNorm === norm ||
        rNorm.includes(norm) ||
        norm.includes(rNorm) ||
        rIdNorm === norm ||
        rIdNorm.includes(norm) ||
        norm.includes(rIdNorm)
      );
    });
  }

  // Rating filter
  if (rating && rating !== "All Ratings") {
    if (rating === "5 Stars" || rating === "5") {
      filtered = filtered.filter((r) => r.rating === 5);
    } else if (rating === "4 Stars" || rating === "4") {
      filtered = filtered.filter((r) => r.rating === 4);
    } else if (rating === "3 Stars" || rating === "3") {
      filtered = filtered.filter((r) => r.rating === 3);
    } else if (rating === "2 Stars" || rating === "2") {
      filtered = filtered.filter((r) => r.rating === 2);
    } else if (rating === "1 Star" || rating === "1") {
      filtered = filtered.filter((r) => r.rating === 1);
    }
  }

  // Verified only filter
  if (verifiedOnly) {
    filtered = filtered.filter((r) => r.verified);
  }

  // Text search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((r) => {
      const pName = (r.parentName || r.name || "").toLowerCase();
      const text = (r.reviewText || r.text || "").toLowerCase();
      const cityStr = (r.city || "").toLowerCase();
      const seasonStr = (r.season || "").toLowerCase();
      const highlight = (r.childExperienceHighlight || "").toLowerCase();
      return (
        pName.includes(q) ||
        text.includes(q) ||
        cityStr.includes(q) ||
        seasonStr.includes(q) ||
        highlight.includes(q)
      );
    });
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sort) {
      case "Oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "Most Helpful":
        return b.helpfulCount - a.helpfulCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "Highest Rating":
        return b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "Lowest Rating":
        return a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "Most Recent":
      case "Newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return filtered;
}

/**
 * Paginates an array of reviews
 */
export function paginateReviews(
  reviews: Review[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResult<Review> {
  const totalCount = reviews.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);
  const items = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return {
    items,
    totalCount,
    page: currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
  };
}

/**
 * Deterministically formats ISO date strings into readable relative dates
 * e.g. "2 days ago", "1 week ago", "2 months ago"
 */
export function formatRelativeDate(
  isoDateString: string,
  referenceDate?: Date
): string {
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return isoDateString;

  // Use fixed base date (August 2026) if not provided, ensuring consistency between server & client
  const now = referenceDate ? referenceDate.getTime() : new Date("2026-08-16T12:00:00Z").getTime();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths <= 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}
