"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { AvailableSlot } from "@/types/booking";
import { cn, toDateString, formatTime, formatShortDateFr } from "@/lib/utils";

interface BookingCalendarProps {
  slots: AvailableSlot[];
  blockedDates: string[];
  selectedDate: string | null;
  selectedSlot: AvailableSlot | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: AvailableSlot) => void;
}

const MONTH_NAMES_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const WEEKDAY_NAMES_FR = ["L", "M", "M", "J", "V", "S", "D"];

/**
 * Normalizes any slot_date value returned by Supabase into a strict
 * YYYY-MM-DD string. Postgres `date` columns are returned as "2026-06-20",
 * but if the column is a `timestamp`/`timestamptz` (or supabase-js applies
 * any timezone conversion), the value may arrive as
 * "2026-06-20T00:00:00+00:00" or similar. Taking the first 10 characters
 * normalizes both cases to a comparable YYYY-MM-DD string.
 */
function normalizeDateString(value: string): string {
  return value.slice(0, 10);
}

export function BookingCalendar({
  slots,
  blockedDates,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}: BookingCalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(today);
    d.setDate(1);
    return d;
  });

  // Build a set of normalized (YYYY-MM-DD) dates that have at least one available slot
  const datesWithSlots = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => set.add(normalizeDateString(s.slot_date)));
    return set;
  }, [slots]);

  // Normalize blocked dates the same way for consistent comparison
  const blockedSet = useMemo(
    () => new Set(blockedDates.map((d) => normalizeDateString(d))),
    [blockedDates]
  );

  // Slots for the currently selected date (compare using normalized dates)
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots
      .filter((s) => normalizeDateString(s.slot_date) === selectedDate)
      .sort((a, b) => a.slot_time.localeCompare(b.slot_time));
  }, [slots, selectedDate]);

  // Calendar grid generation
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday = 0 ... Sunday = 6
    const firstWeekday = (firstDay.getDay() + 6) % 7;

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) {
      days.push(null);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  }, [viewDate]);

  const canGoPrevious = useMemo(() => {
    const prevMonth = new Date(viewDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1, 1);
    const lastDayOfPrev = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0);
    return lastDayOfPrev >= today;
  }, [viewDate, today]);

  const goToPreviousMonth = () => {
    if (!canGoPrevious) return;
    setViewDate((d) => {
      const next = new Date(d);
      next.setMonth(next.getMonth() - 1, 1);
      return next;
    });
  };

  const goToNextMonth = () => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setMonth(next.getMonth() + 1, 1);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Calendar grid */}
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={!canGoPrevious}
            aria-label="Mois précédent"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-champagne/30 transition-colors",
              canGoPrevious
                ? "hover:border-champagne hover:text-champagne-dark"
                : "cursor-not-allowed opacity-30"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {MONTH_NAMES_FR[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h3>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Mois suivant"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne/30 transition-colors hover:border-champagne hover:text-champagne-dark"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {WEEKDAY_NAMES_FR.map((d, i) => (
            <div key={i} className="text-xs font-medium uppercase tracking-wide text-charcoal-muted">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} />;

            const dateStr = toDateString(date);
            const isPast = date < today;
            const isBlocked = blockedSet.has(dateStr);
            const hasSlots = datesWithSlots.has(dateStr);
            const isSelectable = !isPast && !isBlocked && hasSlots;
            const isSelected = selectedDate === dateStr;
            const isToday = toDateString(today) === dateStr;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={!isSelectable}
                onClick={() => isSelectable && onSelectDate(dateStr)}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                  isSelectable
                    ? "cursor-pointer text-charcoal hover:bg-champagne/15"
                    : "cursor-not-allowed text-charcoal/25",
                  isSelected && "bg-champagne text-charcoal shadow-gold",
                  isToday && !isSelected && "ring-1 ring-champagne/50"
                )}
              >
                {date.getDate()}
                {hasSlots && !isPast && !isBlocked && !isSelected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-champagne" />
                )}
              </button>
            );
          })}
        </div>

       <div className="mt-6 rounded-lg bg-champagne/10 border border-champagne/20 p-3">
  <p className="text-sm text-charcoal-muted">
    Sélectionnez une date pour voir les horaires disponibles.
  </p>
</div>
      </div>

      {/* Time slots */}
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Horaires Disponibles
        </h3>
        <p className="mt-1 text-sm text-charcoal-muted">
          {selectedDate
            ? formatShortDateFr(selectedDate)
            : "Sélectionnez une date pour voir les créneaux disponibles."}
        </p>

        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6"
            >
              {slotsForSelectedDate.length === 0 ? (
                <p className="rounded-lg bg-beige/40 p-4 text-sm text-charcoal-muted">
                  Aucun créneau disponible pour cette date.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {slotsForSelectedDate.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => onSelectSlot(slot)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all duration-200",
                          isSelected
                            ? "border-champagne bg-champagne text-charcoal shadow-gold"
                            : "border-champagne/25 text-charcoal hover:border-champagne hover:bg-champagne/10"
                        )}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(slot.slot_time)}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}