import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseSeason } from "@/lib/api/validation";
import { authorizeAdminRequest } from "@/lib/auth/server";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const unauthorized = await authorizeAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await new DrizzleSeasonRepository().getSeasons(true));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await authorizeAdminRequest(request, true);
  if (unauthorized) return unauthorized;
  try {
    const season = parseSeason(await request.json());
    await new DrizzleSeasonRepository().createSeason(season);
    return NextResponse.json(season, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
