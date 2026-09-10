import { reviews as seedReviews } from "@/data/reviews";
import {
  calculateCityDistribution,
  calculateReviewStats,
  filterAndSortReviews,
  paginateReviews,
} from "./stats";
import type {
  CityStat,
  PaginatedResult,
  Review,
  ReviewFilterOptions,
  ReviewRepository,
  ReviewStats,
} from "./types";

export class MemoryReviewRepository implements ReviewRepository {
  private reviews: Review[];

  constructor(initialData: Review[] = seedReviews) {
    this.reviews = initialData.map((item) => ({ ...item, images: [...item.images] }));
  }

  async getAllReviews(includeHidden = false): Promise<Review[]> {
    return this.reviews
      .filter((review) => includeHidden || review.status === "published")
      .map((item) => ({ ...item, images: [...item.images] }));
  }

  async getReviews(options: ReviewFilterOptions = {}): Promise<PaginatedResult<Review>> {
    const { page = 1, pageSize = 10 } = options;
    const list = filterAndSortReviews(await this.getAllReviews(true), options);
    return paginateReviews(list, page, pageSize);
  }

  async getReviewById(id: string): Promise<Review | null> {
    const found = this.reviews.find((r) => r.id === id);
    if (!found) return null;
    return { ...found, images: [...found.images] };
  }

  async getStats(): Promise<ReviewStats> {
    return calculateReviewStats(await this.getAllReviews(false), false);
  }

  async getCities(): Promise<CityStat[]> {
    return calculateCityDistribution(await this.getAllReviews(false), false);
  }

  async createReview(review: Review): Promise<void> {
    const existingIndex = this.reviews.findIndex((r) => r.id === review.id);
    const clone = { ...review, images: [...(review.images || [])] };
    if (existingIndex >= 0) {
      this.reviews[existingIndex] = clone;
    } else {
      this.reviews.unshift(clone);
    }
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<void> {
    const index = this.reviews.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error("Review not found");
    }
    const current = this.reviews[index];
    this.reviews[index] = {
      ...current,
      ...updates,
      id,
      images: updates.images ? [...updates.images] : [...current.images],
    };
  }

  async deleteReview(id: string): Promise<void> {
    this.reviews = this.reviews.filter((r) => r.id !== id);
  }

  async resetToSeedData(): Promise<void> {
    this.reviews = seedReviews.map((item) => ({ ...item, images: [...item.images] }));
  }

  async importReviews(items: Review[]): Promise<void> {
    this.reviews = items.map((item) => ({ ...item, images: [...(item.images || [])] }));
  }
}

export const memoryReviewRepository = new MemoryReviewRepository();
