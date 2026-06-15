"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, AlertCircle, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminBlockedDates } from "@/hooks/useAdmin";
import { getTodayDateString, formatShortDateFr } from "@/lib/utils";

export function BlockedDatesManager() {
  const { blockedDates, loading, error, addBlockedDate, removeBlockedDate } = useAdminBlockedDates();

  const [date, setDate] = useState(getTodayDateString());
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    if (!date) {
      setFormError("Veuillez sélectionner une date.");
      return;
    }

    setSubmitting(true);
    const result = await addBlockedDate(date, reason.trim() || undefined);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error || "Erreur lors du blocage de la date.");
      return;
    }

    setReason("");
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    const result = await removeBlockedDate(id);
    setRemovingId(null);
    if (!result.success) {
      alert(result.error || "Erreur lors du déblocage de la date.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Add blocked date form */}
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury md:p-8">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Bloquer une Date
        </h3>
        <p className="mt-1 text-sm text-charcoal-muted">
          Les dates bloquées n&apos;apparaîtront pas dans le calendrier de réservation public.
        </p>

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
              Raison (optionnel)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : Congé, Jour férié..."
              className="w-full rounded-lg border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 transition-colors focus:border-champagne focus:outline-none"
            />
          </div>
        </div>

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
              Blocage en cours...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Bloquer cette Date
            </>
          )}
        </Button>
      </div>

      {/* Blocked dates list */}
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury md:p-8">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Dates Bloquées
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

        {!loading && !error && blockedDates.length === 0 && (
          <p className="mt-6 text-sm text-charcoal-muted">Aucune date bloquée pour le moment.</p>
        )}

        {!loading && !error && blockedDates.length > 0 && (
          <div className="mt-6 space-y-2">
            {blockedDates.map((bd) => (
              <div
                key={bd.id}
                className="flex items-center justify-between rounded-lg bg-beige/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <CalendarX className="h-4 w-4 text-champagne-dark" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {formatShortDateFr(bd.blocked_date)}
                    </p>
                    {bd.reason && (
                      <p className="text-xs text-charcoal-muted">{bd.reason}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(bd.id)}
                  disabled={removingId === bd.id}
                  className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  {removingId === bd.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Débloquer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
