import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const season = await new DrizzleSeasonRepository().getSeasonById(id);
    if (!season || !season.active) {
      return NextResponse.json({ error: "Season not found." }, { status: 404 });
    }
    return NextResponse.json(season);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
