import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const review = await new DrizzleReviewRepository().getReviewById(id);
    if (!review || review.status !== "published") {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json(review);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
