import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const includeInactive = request.nextUrl.searchParams.get("includeInactive") === "true";
    return NextResponse.json(await new DrizzleSeasonRepository().getSeasons(includeInactive));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
