import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";
import { AvailabilityResponse } from "@/types/booking";

/**
 * GET /api/booking/availability
 *
 * Returns all future available (non-booked) slots and all blocked dates.
 * Used by the public booking calendar to determine which dates/times can
 * be selected by visitors.
 *
 * Optional query params:
 *  - from: YYYY-MM-DD (defaults to today)
 *  - to: YYYY-MM-DD (defaults to 60 days from today)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const today = getTodayDateString();
    const from = searchParams.get("from") || today;

    const defaultTo = new Date();
    defaultTo.setDate(defaultTo.getDate() + 60);
    const to =
      searchParams.get("to") || defaultTo.toISOString().split("T")[0];

    const supabase = createAdminSupabaseClient();

    const [slotsResult, blockedResult] = await Promise.all([
      supabase
        .from("available_slots")
        .select("*")
        .eq("is_booked", false)
        .gte("slot_date", from)
        .lte("slot_date", to)
        .order("slot_date", { ascending: true })
        .order("slot_time", { ascending: true }),
      supabase
        .from("blocked_dates")
        .select("blocked_date")
        .gte("blocked_date", from)
        .lte("blocked_date", to),
    ]);

    if (slotsResult.error) {
      throw slotsResult.error;
    }
    if (blockedResult.error) {
      throw blockedResult.error;
    }

    const response: AvailabilityResponse = {
      success: true,
      slots: slotsResult.data || [],
      blockedDates: (blockedResult.data || []).map((b) => b.blocked_date),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/booking/availability] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Impossible de charger les disponibilités.",
      } satisfies AvailabilityResponse,
      { status: 500 }
    );
  }
}
