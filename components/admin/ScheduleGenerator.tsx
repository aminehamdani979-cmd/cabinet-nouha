"use client";

import { useState } from "react";
import { Loader2, CalendarPlus, Trash2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminSlots } from "@/hooks/useAdmin";
import { getTodayDateString, formatTime, cn } from "@/lib/utils";

const QUICK_TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const WEEKDAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
];

function addDaysToDateString(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ScheduleGenerator() {
  const today = getTodayDateString();
  const { addSlots } = useAdminSlots();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(() => addDaysToDateString(today, 27));
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([
    "09:00:00", "10:00:00", "11:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00",
  ]);
  const [customTime, setCustomTime] = useState("");

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedDates, setFailedDates] = useState<string[]>([]);

  const toggleWeekday = (value: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(value) ? prev.filter((w) => w !== value) : [...prev, value]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const addCustomTime = () => {
    if (!customTime) return;
    const formatted = customTime.length === 5 ? `${customTime}:00` : customTime;
    if (!selectedTimes.includes(formatted)) {
      setSelectedTimes((prev) => [...prev, formatted]);
    }
    setCustomTime("");
  };

  const handleGenerate = async () => {
    setFormError(null);
    setSuccessMessage(null);
    setFailedDates([]);

    if (!startDate || !endDate) {
      setFormError("Veuillez sélectionner une date de début et une date de fin.");
      return;
    }
    if (endDate < startDate) {
      setFormError("La date de fin doit être après la date de début.");
      return;
    }
    if (selectedWeekdays.length === 0) {
      setFormError("Veuillez sélectionner au moins un jour de la semaine.");
      return;
    }
    if (selectedTimes.length === 0) {
      setFormError("Veuillez sélectionner au moins un horaire.");
      return;
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setFormError("Format de date invalide.");
      return;
    }

    const maxDays = 366;
    const dayCount = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
    if (dayCount > maxDays) {
      setFormError(`La période ne peut pas dépasser ${maxDays} jours.`);
      return;
    }

    const weekdaySet = new Set(selectedWeekdays);
    const normalizedTimes = selectedTimes
      .map((t) => (t.length === 5 ? `${t}:00` : t))
      .sort((a, b) => a.localeCompare(b));

    // Build the list of matching dates for the selected weekdays
    const matchingDates: string[] = [];
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);

      const weekday = d.getDay(); // 0 = Sunday ... 6 = Saturday
      if (!weekdaySet.has(weekday)) continue;

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      matchingDates.push(`${year}-${month}-${day}`);
    }

    if (matchingDates.length === 0) {
      setSuccessMessage("Aucune date ne correspond aux jours sélectionnés dans cette période.");
      return;
    }

    setGenerating(true);
    setProgress({ current: 0, total: matchingDates.length });

    const failures: string[] = [];

    // Loop through each matching date and reuse the existing addSlots logic
    // (POST /api/admin/slots, which upserts with ignoreDuplicates and never
    // touches booked slots). Sequential to keep ordered progress feedback.
    for (let i = 0; i < matchingDates.length; i++) {
      const date = matchingDates[i];
      const result = await addSlots(date, normalizedTimes);

      if (!result.success) {
        failures.push(date);
      }

      setProgress({ current: i + 1, total: matchingDates.length });
    }

    setGenerating(false);
    setProgress(null);
    setFailedDates(failures);

    const successCount = matchingDates.length - failures.length;

    if (failures.length === 0) {
      setSuccessMessage(
        `Planning généré avec succès pour ${successCount} date${successCount !== 1 ? "s" : ""}.`
      );
    } else if (successCount > 0) {
      setSuccessMessage(
        `Planning généré pour ${successCount} date${successCount !== 1 ? "s" : ""}. ${failures.length} date${failures.length !== 1 ? "s" : ""} ont échoué.`
      );
    } else {
      setFormError("Aucune date n'a pu être traitée. Veuillez réessayer.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury md:p-8">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Générer le Planning Récurrent
        </h3>
        <p className="mt-1 text-sm text-charcoal-muted">
          Définissez les jours d&apos;ouverture et les horaires types pour une période donnée
          (semaines ou mois). Un créneau sera créé pour chaque date correspondante via le
          système existant — les créneaux déjà existants ne sont pas dupliqués, et les
          rendez-vous déjà réservés ne sont jamais affectés.
        </p>

        {/* Date range */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
              Date de Début
            </label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal transition-colors focus:border-champagne focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
              Date de Fin
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal transition-colors focus:border-champagne focus:outline-none"
            />
          </div>
        </div>

        {/* Weekdays */}
        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
            Jours Travaillés
          </label>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const isSelected = selectedWeekdays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleWeekday(day.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-champagne bg-champagne text-charcoal"
                      : "border-champagne/25 text-charcoal hover:border-champagne hover:bg-champagne/10"
                  )}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
            Horaires
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_TIMES.map((time) => {
              const isSelected = selectedTimes.includes(`${time}:00`);
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => toggleTime(`${time}:00`)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-champagne bg-champagne text-charcoal"
                      : "border-champagne/25 text-charcoal hover:border-champagne hover:bg-champagne/10"
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {time}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2 sm:max-w-xs">
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="w-full rounded-lg border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal transition-colors focus:border-champagne focus:outline-none"
            />
            <button
              type="button"
              onClick={addCustomTime}
              className="flex items-center justify-center rounded-lg border border-champagne/30 px-4 transition-colors hover:border-champagne hover:bg-champagne/10"
            >
              <CalendarPlus className="h-4 w-4 text-champagne-dark" />
            </button>
          </div>

          {selectedTimes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTimes
                .slice()
                .sort((a, b) => a.localeCompare(b))
                .map((time) => (
                  <span
                    key={time}
                    className="flex items-center gap-2 rounded-full bg-champagne/15 px-3 py-1.5 text-xs font-medium text-charcoal"
                  >
                    {formatTime(time)}
                    <button onClick={() => toggleTime(time)} aria-label={`Retirer ${time}`}>
                      <Trash2 className="h-3 w-3 text-charcoal-muted hover:text-red-500" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>

        {formError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {failedDates.length > 0 && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="font-medium">Échec pour les dates suivantes :</p>
            <p className="mt-1">{failedDates.join(", ")}</p>
          </div>
        )}

        {generating && progress && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-beige/40 px-4 py-3 text-sm text-charcoal">
            <Loader2 className="h-4 w-4 animate-spin text-champagne-dark" />
            Génération en cours... ({progress.current} / {progress.total})
          </div>
        )}

        <Button
          onClick={handleGenerate}
          variant="secondary"
          size="md"
          disabled={generating}
          className="mt-5"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <CalendarPlus className="h-4 w-4" />
              Générer le Planning
            </>
          )}
        </Button>
      </div>
    </div>
  );
}