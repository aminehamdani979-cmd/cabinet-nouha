import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns today's date as YYYY-MM-DD in local time.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns a YYYY-MM-DD string for a given Date object (local time).
 */
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats HH:MM:SS -> HH:MM for display.
 */
export function formatTime(time: string): string {
  return time.slice(0, 5);
}

/**
 * Formats a YYYY-MM-DD date into a long French display format,
 * e.g. "Vendredi 20 Juin 2026".
 */
export function formatLongDateFr(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formats a YYYY-MM-DD date into a short French display format,
 * e.g. "20 Juin 2026".
 */
export function formatShortDateFr(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Validates a Moroccan phone number (loosely) — accepts formats like
 * 0612345678, +212612345678, 212612345678 with optional spaces/dashes.
 */
export function isValidMoroccanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^(\+212|0)([5-7])([0-9]{8})$/.test(cleaned);
}

/**
 * Groups available slots by date.
 */
export function groupSlotsByDate<T extends { slot_date: string }>(
  slots: T[]
): Record<string, T[]> {
  return slots.reduce((acc, slot) => {
    if (!acc[slot.slot_date]) {
      acc[slot.slot_date] = [];
    }
    acc[slot.slot_date].push(slot);
    return acc;
  }, {} as Record<string, T[]>);
}
