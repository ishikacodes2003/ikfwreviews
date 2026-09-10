import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function apiErrorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  if (code === "23503") {
    return NextResponse.json(
      { error: "This record is still referenced by other data and cannot be changed." },
      { status: 409 },
    );
  }
  if (code === "23505") {
    return NextResponse.json({ error: "A record with this ID already exists." }, { status: 409 });
  }

  console.error(error);
  return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
}
