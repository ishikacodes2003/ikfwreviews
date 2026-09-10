import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseSeasonPatch } from "@/lib/api/validation";
import { authorizeAdminRequest } from "@/lib/auth/server";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await authorizeAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await context.params;
    const season = await new DrizzleSeasonRepository().getSeasonById(id);
    if (!season) return NextResponse.json({ error: "Season not found." }, { status: 404 });
    return NextResponse.json(season);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await authorizeAdminRequest(request, true);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await context.params;
    await new DrizzleSeasonRepository().updateSeason(id, parseSeasonPatch(await request.json()));
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
    await new DrizzleSeasonRepository().deleteSeason(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
