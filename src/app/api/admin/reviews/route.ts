import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseReview } from "@/lib/api/validation";
import { authorizeAdminRequest } from "@/lib/auth/server";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const unauthorized = await authorizeAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await new DrizzleReviewRepository().getAllReviews(true));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await authorizeAdminRequest(request, true);
  if (unauthorized) return unauthorized;
  try {
    const review = parseReview(await request.json());
    await new DrizzleReviewRepository().createReview(review);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
