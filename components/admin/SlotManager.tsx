"use client";

import { useState, useMemo } from "react";
import { Loader2, Plus, Trash2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminSlots } from "@/hooks/useAdmin";
import { getTodayDateString, formatShortDateFr, formatTime, groupSlotsByDate, cn } from "@/lib/utils";

const QUICK_TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export function SlotManager() {
  const { slots, loading, error, addSlots, removeSlot } = useAdminSlots();

  const [date, setDate] = useState(getTodayDateString());
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const groupedSlots = useMemo(() => groupSlotsByDate(slots), [slots]);
  const sortedDates = useMemo(
    () => Object.keys(groupedSlots).sort((a, b) => a.localeCompare(b)),
    [groupedSlots]
  );

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

  const handleSubmit = async () => {
    setFormError(null);

    if (!date) {
      setFormError("Veuillez sélectionner une date.");
      return;
    }
    if (selectedTimes.length === 0) {
      setFormError("Veuillez sélectionner au moins un horaire.");
      return;
    }

    setSubmitting(true);
    const normalizedTimes = selectedTimes.map((t) => (t.length === 5 ? `${t}:00` : t));
    const result = await addSlots(date, normalizedTimes);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error || "Erreur lors de la création des créneaux.");
      return;
    }

    setSelectedTimes([]);
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    const result = await removeSlot(id);
    setRemovingId(null);
    if (!result.success) {
      alert(result.error || "Erreur lors de la suppression du créneau.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Add slots form */}
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury md:p-8">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Ajouter des Horaires Disponibles
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
              Date
            </label>
            <input
              type="date"
              value={date}
              min={getTodayDateString()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal transition-colors focus:border-champagne focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
              Ajouter un horaire personnalisé
            </label>
            <div className="flex gap-2">
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
                <Plus className="h-4 w-4 text-champagne-dark" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
            Horaires Rapides
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_TIMES.map((time) => {
              const isSelected = selectedTimes.includes(time) || selectedTimes.includes(`${time}:00`);
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
        </div>

        {selectedTimes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedTimes.map((time) => (
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

        {formError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {formError}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          variant="secondary"
          size="md"
          disabled={submitting}
          className="mt-5"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Ajouter les horaires
            </>
          )}
        </Button>
      </div>

      {/* Existing slots list */}
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury md:p-8">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Horaires Existants
        </h3>

        {loading && (
          <div className="mt-6 flex items-center gap-3 text-charcoal-muted">
            <Loader2 className="h-5 w-5 animate-spin text-champagne-dark" />
            <p className="text-sm">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && sortedDates.length === 0 && (
          <p className="mt-6 text-sm text-charcoal-muted">Aucun créneau créé pour le moment.</p>
        )}

        {!loading && !error && sortedDates.length > 0 && (
          <div className="mt-6 space-y-5">
            {sortedDates.map((dateKey) => (
              <div key={dateKey}>
                <h4 className="mb-2 text-sm font-semibold text-charcoal">
                  {formatShortDateFr(dateKey)}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSlots[dateKey]
                    .sort((a, b) => a.slot_time.localeCompare(b.slot_time))
                    .map((slot) => (
                      <span
                        key={slot.id}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                          slot.is_booked
                            ? "border-champagne/30 bg-champagne/10 text-charcoal-muted"
                            : "border-charcoal/10 text-charcoal"
                        )}
                      >
                        <Clock className="h-3 w-3 text-champagne-dark" />
                        {formatTime(slot.slot_time)}
                        {slot.is_booked ? (
                          <span className="text-[10px] uppercase text-champagne-dark">Réservé</span>
                        ) : (
                          <button
                            onClick={() => handleRemove(slot.id)}
                            disabled={removingId === slot.id}
                            aria-label={`Supprimer le créneau ${formatTime(slot.slot_time)}`}
                          >
                            {removingId === slot.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3 text-charcoal-muted hover:text-red-500" />
                            )}
                          </button>
                        )}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
