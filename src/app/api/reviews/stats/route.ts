import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await new DrizzleReviewRepository().getStats());
  } catch (error) {
    return apiErrorResponse(error);
  }
}
