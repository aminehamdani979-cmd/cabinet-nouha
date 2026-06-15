import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { buildWhatsAppBookingUrl } from "@/lib/whatsapp";
import { isValidMoroccanPhone } from "@/lib/utils";
import {
  CreateAppointmentPayload,
  CreateAppointmentResponse,
} from "@/types/booking";

/**
 * POST /api/booking/create
 *
 * Flow:
 *  1. Validate the incoming payload.
 *  2. Verify the requested slot still exists and is not booked.
 *  3. Insert a new row into `appointments`.
 *  4. Mark the corresponding `available_slots` row as booked.
 *  5. Generate a pre-filled WhatsApp message + redirect URL.
 *  6. Return the appointment + WhatsApp URL to the client.
 *
 * If marking the slot as booked fails after the appointment was created,
 * the appointment insert is rolled back (deleted) to avoid inconsistent state.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateAppointmentPayload>;

    // ---- Validation -------------------------------------------------------
    const requiredFields: (keyof CreateAppointmentPayload)[] = [
      "first_name",
      "last_name",
      "phone",
      "service",
      "appointment_date",
      "appointment_time",
      "slot_id",
    ];

    for (const field of requiredFields) {
      const value = body[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return NextResponse.json(
          {
            success: false,
            error: `Le champ "${field}" est requis.`,
          } satisfies CreateAppointmentResponse,
          { status: 400 }
        );
      }
    }

    if (!isValidMoroccanPhone(body.phone!)) {
      return NextResponse.json(
        {
          success: false,
          error: "Veuillez fournir un numéro de téléphone marocain valide.",
        } satisfies CreateAppointmentResponse,
        { status: 400 }
      );
    }

    const payload: CreateAppointmentPayload = {
      first_name: body.first_name!.trim(),
      last_name: body.last_name!.trim(),
      phone: body.phone!.trim(),
      service: body.service!.trim(),
      appointment_date: body.appointment_date!,
      appointment_time: body.appointment_time!,
      notes: body.notes?.trim() || undefined,
      slot_id: body.slot_id!,
    };

    const supabase = createAdminSupabaseClient();

    // ---- Step 1: Verify slot is still available ---------------------------
    const { data: slot, error: slotError } = await supabase
      .from("available_slots")
      .select("*")
      .eq("id", payload.slot_id)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        {
          success: false,
          error: "Le créneau sélectionné n'existe plus. Veuillez en choisir un autre.",
        } satisfies CreateAppointmentResponse,
        { status: 404 }
      );
    }

    if (slot.is_booked) {
      return NextResponse.json(
        {
          success: false,
          error: "Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez en choisir un autre.",
        } satisfies CreateAppointmentResponse,
        { status: 409 }
      );
    }

    // ---- Step 2: Insert appointment ---------------------------------------
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone: payload.phone,
        service: payload.service,
        appointment_date: payload.appointment_date,
        appointment_time: payload.appointment_time,
        notes: payload.notes || null,
        status: "pending",
        slot_id: payload.slot_id,
      })
      .select()
      .single();

    if (appointmentError || !appointment) {
      console.error("[POST /api/booking/create] Insert appointment error:", appointmentError);
      return NextResponse.json(
        {
          success: false,
          error: "Une erreur est survenue lors de la création du rendez-vous.",
        } satisfies CreateAppointmentResponse,
        { status: 500 }
      );
    }

    // ---- Step 3: Mark slot as booked ---------------------------------------
    const { error: updateSlotError } = await supabase
      .from("available_slots")
      .update({ is_booked: true })
      .eq("id", payload.slot_id)
      .eq("is_booked", false); // optimistic concurrency guard

    if (updateSlotError) {
      console.error("[POST /api/booking/create] Update slot error:", updateSlotError);

      // Roll back the appointment to avoid an orphaned booking on a slot
      // that could not be marked as occupied.
      await supabase.from("appointments").delete().eq("id", appointment.id);

      return NextResponse.json(
        {
          success: false,
          error: "Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez en choisir un autre.",
        } satisfies CreateAppointmentResponse,
        { status: 409 }
      );
    }

    // ---- Step 4: Build WhatsApp redirect URL --------------------------------
    const whatsappUrl = buildWhatsAppBookingUrl(payload);

    return NextResponse.json(
      {
        success: true,
        appointment,
        whatsappUrl,
      } satisfies CreateAppointmentResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/booking/create] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Une erreur inattendue est survenue. Veuillez réessayer.",
      } satisfies CreateAppointmentResponse,
      { status: 500 }
    );
  }
}
