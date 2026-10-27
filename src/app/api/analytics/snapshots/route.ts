import { NextRequest, NextResponse } from "next/server";
import { getHistoricalAnalyticsData } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : undefined;

    const data = await getHistoricalAnalyticsData(days);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch historical analytics";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
