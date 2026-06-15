import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

/**
 * GET /api/admin/blocked-dates
 * Returns all blocked dates, ordered chronologically.
 */
export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("blocked_date", { ascending: true });

    if (error) throw error;

    return NextResponse.json(
      { success: true, blockedDates: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/admin/blocked-dates] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de charger les dates bloquées." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blocked-dates
 * Body: { blocked_date: string, reason?: string }
 *
 * Blocking a date does NOT delete existing available_slots for that date;
 * it simply hides the date from the public booking calendar entirely.
 * Admins should remove or leave existing slots as needed.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blocked_date, reason } = body as {
      blocked_date?: string;
      reason?: string;
    };

    if (!blocked_date) {
      return NextResponse.json(
        { success: false, error: "La date est requise." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("blocked_dates")
      .upsert(
        { blocked_date, reason: reason || null },
        { onConflict: "blocked_date" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, blockedDate: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/blocked-dates] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de bloquer cette date." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blocked-dates?id=<uuid>
 * Unblocks a previously blocked date.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "L'identifiant est requis." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/blocked-dates] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de débloquer cette date." },
      { status: 500 }
    );
  }
}
