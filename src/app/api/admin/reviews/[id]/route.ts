import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseReviewPatch } from "@/lib/api/validation";
import { authorizeAdminRequest } from "@/lib/auth/server";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await authorizeAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await context.params;
    const review = await new DrizzleReviewRepository().getReviewById(id);
    if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });
    return NextResponse.json(review);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await authorizeAdminRequest(request, true);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await context.params;
    await new DrizzleReviewRepository().updateReview(id, parseReviewPatch(await request.json()));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await authorizeAdminRequest(request, true);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await context.params;
    await new DrizzleReviewRepository().deleteReview(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
