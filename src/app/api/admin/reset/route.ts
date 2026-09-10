import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { reviewToRow, seasonToRow } from "@/db/mappers";
import { reviews, seasons } from "@/db/schema";
import { reviews as seedReviews } from "@/data/reviews";
import { initialSeasons } from "@/data/seasons";
import { apiErrorResponse } from "@/lib/api/errors";
import { authorizeAdminRequest } from "@/lib/auth/server";

import { memoryReviewRepository } from "@/lib/reviews/memoryReviewRepository";
import { memorySeasonRepository } from "@/lib/seasons/memorySeasonRepository";

export async function POST(request: NextRequest) {
  const unauthorized = await authorizeAdminRequest(request, true);
  if (unauthorized) return unauthorized;
  try {
    const db = getDb();
    if (db) {
      await db.transaction(async (tx) => {
        await tx.delete(reviews);
        await tx.delete(seasons);
        await tx.insert(seasons).values(initialSeasons.map(seasonToRow));
        await tx.insert(reviews).values(seedReviews.map(reviewToRow));
      });
    }
    await memoryReviewRepository.resetToSeedData();
    await memorySeasonRepository.resetToSeedData();
    return NextResponse.json({ reviews: seedReviews.length, seasons: initialSeasons.length });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
