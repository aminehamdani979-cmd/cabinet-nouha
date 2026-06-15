// ============================================================================
// CABINET NOUHA - SHARED TYPES
// ============================================================================

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface AvailableSlot {
  id: string;
  slot_date: string; // YYYY-MM-DD
  slot_time: string; // HH:MM:SS
  is_booked: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  service: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM:SS
  notes: string | null;
  status: AppointmentStatus;
  slot_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentPayload {
  first_name: string;
  last_name: string;
  phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  slot_id: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  appointment?: Appointment;
  whatsappUrl?: string;
  error?: string;
}

export interface AvailabilityResponse {
  success: boolean;
  slots?: AvailableSlot[];
  blockedDates?: string[];
  error?: string;
}

// Service catalog used by the booking form & services section
export const SERVICES = [
  "Microblading",
  "Maquillage Permanent",
  "Design des Sourcils",
  "Extensions de Cils",
  "Soins du Visage",
  "Soins de la Peau",
  "Rehaussement de Cils",
  "Consultation",
] as const;

export type ServiceName = (typeof SERVICES)[number];
