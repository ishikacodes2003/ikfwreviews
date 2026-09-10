import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseReview } from "@/lib/api/validation";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import type { ReviewFilterOptions } from "@/lib/reviews/types";
import { getCurrentUser, rejectCrossOriginRequest } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

function optionsFrom(request: NextRequest): ReviewFilterOptions {
  const query = request.nextUrl.searchParams;
  return {
    city: query.get("city") || undefined,
    seasonId: query.get("seasonId") || undefined,
    rating: query.get("rating") || undefined,
    sort: query.get("sort") || undefined,
    verifiedOnly: query.get("verifiedOnly") === "true",
    status: "published",
    searchQuery: query.get("searchQuery") || undefined,
    page: Number(query.get("page")) || 1,
    pageSize: Number(query.get("pageSize")) || 10,
  };
}

export async function GET(request: NextRequest) {
  try {
    const repository = new DrizzleReviewRepository();
    if (request.nextUrl.searchParams.get("paginated") === "true") {
      return NextResponse.json(await repository.getReviews(optionsFrom(request)));
    }
    return NextResponse.json(await repository.getAllReviews(false));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const crossOrigin = rejectCrossOriginRequest(request);
    if (crossOrigin) return crossOrigin;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to submit a review." }, { status: 401 });
    }

    const review = {
      ...parseReview(await request.json(), true),
      authorUserId: user.id,
    };
    await new DrizzleReviewRepository().createReview(review);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
