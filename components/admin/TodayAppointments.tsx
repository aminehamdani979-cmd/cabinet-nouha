"use client";

import { Calendar, Clock, Users } from "lucide-react";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { useAdminAppointments } from "@/hooks/useAdmin";
import { getTodayDateString, formatLongDateFr } from "@/lib/utils";

export function TodayAppointments() {
  const today = getTodayDateString();
  const { appointments, loading, error, updateStatus } = useAdminAppointments({
    date: today,
  });

  const pendingCount = appointments.filter((a) => a.status === "pending" || a.status === "confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/15">
            <Calendar className="h-5 w-5 text-champagne-dark" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-charcoal capitalize">
              {formatLongDateFr(today)}
            </h2>
            <p className="text-sm text-charcoal-muted">Rendez-vous du jour</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-beige/40 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-charcoal">
              {appointments.length}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-charcoal-muted">
              <Users className="h-3.5 w-3.5" />
              Total
            </p>
          </div>
          <div className="rounded-xl bg-beige/40 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-charcoal">
              {pendingCount}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-charcoal-muted">
              <Clock className="h-3.5 w-3.5" />
              À Venir
            </p>
          </div>
          <div className="rounded-xl bg-beige/40 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-charcoal">
              {completedCount}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-charcoal-muted">
              <Calendar className="h-3.5 w-3.5" />
              Terminés
            </p>
          </div>
        </div>
      </div>

      <AppointmentsTable
        appointments={appointments}
        loading={loading}
        error={error}
        emptyMessage="Aucun rendez-vous prévu pour aujourd'hui."
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
