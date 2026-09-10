import "server-only";

import { eq } from "drizzle-orm";
import { getDb, isDatabaseInCooldown, markDatabaseFailure, type Database } from "@/db";
import { reviewFromRow, reviewToRow } from "@/db/mappers";
import { reviews, seasons } from "@/db/schema";
import { reviews as seedReviews } from "@/data/reviews";
import { memoryReviewRepository } from "./memoryReviewRepository";
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

export class DrizzleReviewRepository implements ReviewRepository {
  private database: Database | null;

  constructor(database?: Database | null) {
    this.database = database !== undefined ? database : getDb();
  }

  private canQueryDb(): boolean {
    return Boolean(this.database && !isDatabaseInCooldown());
  }

  async getAllReviews(includeHidden = false): Promise<Review[]> {
    if (this.canQueryDb()) {
      try {
        const rows = await this.database!
          .select({ review: reviews, seasonName: seasons.name })
          .from(reviews)
          .leftJoin(seasons, eq(reviews.seasonId, seasons.id));

        return rows
          .map(({ review, seasonName }) => reviewFromRow(review, seasonName))
          .filter((review) => includeHidden || review.status === "published");
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to hardcoded reviews due to database error.");
      }
    }
    return memoryReviewRepository.getAllReviews(includeHidden);
  }

  async getReviews(options: ReviewFilterOptions = {}): Promise<PaginatedResult<Review>> {
    const { page = 1, pageSize = 10 } = options;
    const list = filterAndSortReviews(await this.getAllReviews(true), options);
    return paginateReviews(list, page, pageSize);
  }

  async getReviewById(id: string): Promise<Review | null> {
    if (this.canQueryDb()) {
      try {
        const [row] = await this.database!
          .select({ review: reviews, seasonName: seasons.name })
          .from(reviews)
          .leftJoin(seasons, eq(reviews.seasonId, seasons.id))
          .where(eq(reviews.id, id))
          .limit(1);
        if (row) return reviewFromRow(row.review, row.seasonName);
        return memoryReviewRepository.getReviewById(id);
      } catch (error) {
        markDatabaseFailure(error);
        console.error(`Falling back to hardcoded reviews for review ID "${id}" due to database error.`);
      }
    }
    return memoryReviewRepository.getReviewById(id);
  }

  async getStats(): Promise<ReviewStats> {
    return calculateReviewStats(await this.getAllReviews(false), false);
  }

  async getCities(): Promise<CityStat[]> {
    return calculateCityDistribution(await this.getAllReviews(false), false);
  }

  async createReview(review: Review): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!.insert(reviews).values(reviewToRow(review));
        await memoryReviewRepository.createReview(review);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory review storage for created review.");
      }
    }
    await memoryReviewRepository.createReview(review);
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<void> {
    if (this.canQueryDb()) {
      try {
        const existing = await this.getReviewById(id);
        if (!existing) throw new Error("Review not found");
        const merged = { ...existing, ...updates, id };
        await this.database!.update(reviews).set(reviewToRow(merged)).where(eq(reviews.id, id));
        await memoryReviewRepository.updateReview(id, updates);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory review storage for updated review.");
      }
    }
    await memoryReviewRepository.updateReview(id, updates);
  }

  async deleteReview(id: string): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!.delete(reviews).where(eq(reviews.id, id));
        await memoryReviewRepository.deleteReview(id);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory review storage for deleted review.");
      }
    }
    await memoryReviewRepository.deleteReview(id);
  }

  async resetToSeedData(): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!.transaction(async (tx) => {
          await tx.delete(reviews);
          await tx.insert(reviews).values(seedReviews.map(reviewToRow));
        });
        await memoryReviewRepository.resetToSeedData();
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory review storage for seed reset.");
      }
    }
    await memoryReviewRepository.resetToSeedData();
  }

  async importReviews(items: Review[]): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!.transaction(async (tx) => {
          await tx.delete(reviews);
          if (items.length) await tx.insert(reviews).values(items.map(reviewToRow));
        });
        await memoryReviewRepository.importReviews(items);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory review storage for imported reviews.");
      }
    }
    await memoryReviewRepository.importReviews(items);
  }
}
