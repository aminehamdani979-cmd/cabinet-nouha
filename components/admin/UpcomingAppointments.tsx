"use client";

import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { useAdminAppointments } from "@/hooks/useAdmin";
import { getTodayDateString } from "@/lib/utils";

export function UpcomingAppointments() {
  const today = getTodayDateString();

  const { appointments, loading, error, updateStatus } = useAdminAppointments({});

  // Filter to future appointments (excluding today's, shown in the "Today" tab)
  // and exclude cancelled appointments from the default upcoming view.
  const upcoming = useMemo(() => {
    return appointments.filter(
      (a) => a.appointment_date > today && a.status !== "cancelled"
    );
  }, [appointments, today]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/15">
            <CalendarDays className="h-5 w-5 text-champagne-dark" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-charcoal">
              Rendez-vous à Venir
            </h2>
            <p className="text-sm text-charcoal-muted">
              {upcoming.length} rendez-vous{upcoming.length !== 1 ? "s" : ""} planifié
              {upcoming.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <AppointmentsTable
        appointments={upcoming}
        loading={loading}
        error={error}
        emptyMessage="Aucun rendez-vous à venir."
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
