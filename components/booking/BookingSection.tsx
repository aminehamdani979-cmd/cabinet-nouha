"use client";

import { useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingForm } from "@/components/booking/BookingForm";
import { useAvailability } from "@/hooks/useAvailability";
import { AvailableSlot } from "@/types/booking";

export function BookingSection() {
  const { slots, blockedDates, loading, error, refresh } = useAvailability();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleBookingSuccess = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
    // Refresh availability shortly after to remove the now-booked slot
    setTimeout(() => refresh(), 500);
  };

  return (
    <section id="booking" className="bg-charcoal py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Réservation en Ligne"
          title="Réservez Votre Moment de Luxe"
          description="Choisissez une date et un horaire disponibles, complétez vos informations, et confirmez votre rendez-vous en quelques secondes."
          light
        />

        {loading && (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-ivory/5 p-12 text-ivory/60">
            <Loader2 className="h-6 w-6 animate-spin text-champagne" />
            <p className="text-sm">Chargement des disponibilités...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-ivory/5 p-12 text-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-sm text-ivory/70">{error}</p>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-full border border-champagne/40 px-5 py-2.5 text-sm font-medium text-champagne-light transition-colors hover:bg-champagne/10"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            <BookingCalendar
              slots={slots}
              blockedDates={blockedDates}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelectDate={handleSelectDate}
              onSelectSlot={setSelectedSlot}
            />

            <BookingForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSuccess={handleBookingSuccess}
            />
          </div>
        )}
      </div>
    </section>
  );
}
