import { CreateAppointmentPayload } from "@/types/booking";

export const WHATSAPP_NUMBER = "212708835156"; // international format, no + or spaces

/**
 * Formats a YYYY-MM-DD date string into a readable French date,
 * e.g. "2026-06-20" -> "20/06/2026".
 */
export function formatDateForMessage(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Formats a HH:MM:SS or HH:MM time string into "HH:MM".
 */
export function formatTimeForMessage(timeStr: string): string {
  return timeStr.slice(0, 5);
}

/**
 * Builds the pre-filled WhatsApp message for a new booking and returns a
 * complete wa.me URL ready for redirection.
 */
export function buildWhatsAppBookingUrl(payload: CreateAppointmentPayload): string {
  const message = `Bonjour Cabinet Nouha,

Je souhaite réserver un rendez-vous.

Nom :
${payload.first_name} ${payload.last_name}

Téléphone :
${payload.phone}

Service :
${payload.service}

Date :
${formatDateForMessage(payload.appointment_date)}

Heure :
${formatTimeForMessage(payload.appointment_time)}

Message :
${payload.notes && payload.notes.trim().length > 0 ? payload.notes.trim() : "—"}

Merci.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
