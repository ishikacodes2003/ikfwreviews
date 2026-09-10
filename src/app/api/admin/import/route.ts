import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { reviewToRow, seasonToRow } from "@/db/mappers";
import { reviews, seasons } from "@/db/schema";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseImport } from "@/lib/api/validation";
import { authorizeAdminRequest } from "@/lib/auth/server";

import { memoryReviewRepository } from "@/lib/reviews/memoryReviewRepository";
import { memorySeasonRepository } from "@/lib/seasons/memorySeasonRepository";

export async function POST(request: NextRequest) {
  const unauthorized = await authorizeAdminRequest(request, true);
  if (unauthorized) return unauthorized;
  try {
    const data = parseImport(await request.json());
    const db = getDb();
    if (db) {
      await db.transaction(async (tx) => {
        await tx.delete(reviews);
        await tx.delete(seasons);
        if (data.seasons.length) await tx.insert(seasons).values(data.seasons.map(seasonToRow));
        if (data.reviews.length) await tx.insert(reviews).values(data.reviews.map(reviewToRow));
      });
    }
    if (data.reviews.length) await memoryReviewRepository.importReviews(data.reviews);
    if (data.seasons.length) await memorySeasonRepository.importSeasons(data.seasons);
    return NextResponse.json({
      importedReviews: data.reviews.length,
      importedSeasons: data.seasons.length,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
