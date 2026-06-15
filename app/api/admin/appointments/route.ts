import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { AppointmentStatus } from "@/types/booking";

/**
 * GET /api/admin/appointments
 *
 * Query params:
 *  - status: filter by status (pending | confirmed | completed | cancelled)
 *  - date: filter by exact appointment_date (YYYY-MM-DD) — useful for "today"
 *  - from / to: date range filter
 *  - search: case-insensitive search across first_name, last_name, phone
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search");

    const supabase = createAdminSupabaseClient();

    let query = supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (status) {
      query = query.eq("status", status);
    }
    if (date) {
      query = query.eq("appointment_date", date);
    }
    if (from) {
      query = query.gte("appointment_date", from);
    }
    if (to) {
      query = query.lte("appointment_date", to);
    }
    if (search) {
      const term = search.trim();
      query = query.or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,phone.ilike.%${term}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(
      { success: true, appointments: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/admin/appointments] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de charger les rendez-vous." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/appointments
 *
 * Body: { id: string, status: AppointmentStatus }
 *
 * Updates an appointment's status. If the new status is "cancelled",
 * the corresponding available_slots row (if any) is freed up again
 * (is_booked = false) so the slot becomes bookable.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body as { id?: string; status?: AppointmentStatus };

    const validStatuses: AppointmentStatus[] = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!id || !status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Identifiant et statut valides requis." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { success: false, error: "Rendez-vous introuvable." },
        { status: 404 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // If cancelled, free up the slot again
    if (status === "cancelled" && appointment.slot_id) {
      const { error: slotError } = await supabase
        .from("available_slots")
        .update({ is_booked: false })
        .eq("id", appointment.slot_id);

      if (slotError) {
        console.error(
          "[PATCH /api/admin/appointments] Failed to free slot:",
          slotError
        );
        // Non-fatal: appointment status was still updated successfully.
      }
    }

    return NextResponse.json(
      { success: true, appointment: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/admin/appointments] Error:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de mettre à jour le rendez-vous." },
      { status: 500 }
    );
  }
}
