import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

/**
 * GET /api/admin/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns all slots (booked and unbooked) within a date range, ordered.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const supabase = createAdminSupabaseClient();

    let query = supabase
      .from("available_slots")
      .select("*")
      .order("slot_date", { ascending: true })
      .order("slot_time", { ascending: true });

    if (from) query = query.gte("slot_date", from);
    if (to) query = query.lte("slot_date", to);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, slots: data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/slots] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de charger les créneaux." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/slots
 * Creates one or more available slots.
 *
 * Body (single):  { slot_date: string, slot_time: string }
 * Body (bulk):    { slot_date: string, slot_times: string[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slot_date, slot_time, slot_times } = body as {
      slot_date?: string;
      slot_time?: string;
      slot_times?: string[];
    };

    if (!slot_date) {
      return NextResponse.json(
        { success: false, error: "La date est requise." },
        { status: 400 }
      );
    }

    const times: string[] = slot_times && slot_times.length > 0
      ? slot_times
      : slot_time
      ? [slot_time]
      : [];

    if (times.length === 0) {
      return NextResponse.json(
        { success: false, error: "Au moins un horaire est requis." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const rows = times.map((t) => ({
      slot_date,
      slot_time: t,
      is_booked: false,
    }));

    const { data, error } = await supabase
      .from("available_slots")
      .upsert(rows, { onConflict: "slot_date,slot_time", ignoreDuplicates: true })
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, slots: data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/slots] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de créer le(s) créneau(x)." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/slots?id=<uuid>
 * Removes a slot. Fails gracefully if the slot is currently booked
 * (it should be cancelled via the appointment instead).
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "L'identifiant du créneau est requis." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: slot, error: fetchError } = await supabase
      .from("available_slots")
      .select("is_booked")
      .eq("id", id)
      .single();

    if (fetchError || !slot) {
      return NextResponse.json(
        { success: false, error: "Créneau introuvable." },
        { status: 404 }
      );
    }

    if (slot.is_booked) {
      return NextResponse.json(
        {
          success: false,
          error: "Ce créneau est réservé. Annulez le rendez-vous correspondant avant de le supprimer.",
        },
        { status: 409 }
      );
    }

    const { error: deleteError } = await supabase
      .from("available_slots")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/slots] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de supprimer le créneau." },
      { status: 500 }
    );
  }
}
