import { requestJson } from "@/lib/api/client";
import type {
  CityStat,
  PaginatedResult,
  Review,
  ReviewFilterOptions,
  ReviewRepository,
  ReviewStats,
} from "./types";

export class ApiReviewRepository implements ReviewRepository {
  constructor(private readonly admin = false) {}

  private baseUrl(): string {
    return this.admin ? "/api/admin/reviews" : "/api/reviews";
  }

  async getAllReviews(includeHidden = false): Promise<Review[]> {
    const url = this.admin
      ? this.baseUrl()
      : `${this.baseUrl()}?includeHidden=${includeHidden ? "true" : "false"}`;
    return requestJson<Review[]>(url);
  }

  async getReviews(options: ReviewFilterOptions = {}): Promise<PaginatedResult<Review>> {
    const params = new URLSearchParams({ paginated: "true" });
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) params.set(key, String(value));
    }
    return requestJson<PaginatedResult<Review>>(`${this.baseUrl()}?${params}`);
  }

  async getReviewById(id: string): Promise<Review | null> {
    return requestJson<Review | null>(`${this.baseUrl()}/${encodeURIComponent(id)}`);
  }

  async getStats(): Promise<ReviewStats> {
    return requestJson<ReviewStats>("/api/reviews/stats");
  }

  async getCities(): Promise<CityStat[]> {
    return requestJson<CityStat[]>("/api/reviews/cities");
  }

  async createReview(review: Review): Promise<void> {
    await requestJson(this.baseUrl(), { method: "POST", body: JSON.stringify(review) });
  }

  async updateReview(id: string, review: Partial<Review>): Promise<void> {
    if (!this.admin) throw new Error("Public reviews cannot be edited");
    await requestJson(`${this.baseUrl()}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(review),
    });
  }

  async deleteReview(id: string): Promise<void> {
    if (!this.admin) throw new Error("Public reviews cannot be deleted");
    await requestJson(`${this.baseUrl()}/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  async resetToSeedData(): Promise<void> {
    if (!this.admin) throw new Error("Admin access required");
    await requestJson("/api/admin/reset", { method: "POST", body: "{}" });
  }

  async importReviews(): Promise<void> {
    throw new Error("Use the transactional admin import endpoint");
  }
}
