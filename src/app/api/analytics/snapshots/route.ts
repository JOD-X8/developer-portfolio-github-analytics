import { NextRequest, NextResponse } from "next/server";
import { getHistoricalAnalyticsData, parseDaysQueryParam } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = parseDaysQueryParam(searchParams.get("days"));

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid days parameter. Must be a positive integer." },
        { status: 400 }
      );
    }

    const data = await getHistoricalAnalyticsData(validation.days);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    // Let Next.js internal prerender interrupts bubble up
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("[API Error] Failed to fetch snapshots:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching historical analytics." },
      { status: 500 }
    );
  }
}
