"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Phone, Clock, Calendar, Tag } from "lucide-react";
import { Appointment, AppointmentStatus } from "@/types/booking";
import { formatShortDateFr, formatTime, cn } from "@/lib/utils";

interface AppointmentsTableProps {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<{ success: boolean; error?: string }>;
}

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "En Attente",
  confirmed: "Confirmé",
  completed: "Terminé",
  cancelled: "Annulé",
};

export function AppointmentsTable({
  appointments,
  loading,
  error,
  emptyMessage = "Aucun rendez-vous trouvé.",
  onUpdateStatus,
}: AppointmentsTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, status: AppointmentStatus) => {
    setUpdatingId(id);
    await onUpdateStatus(id, status);
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-ivory p-12 text-charcoal-muted shadow-luxury">
        <Loader2 className="h-6 w-6 animate-spin text-champagne-dark" />
        <p className="text-sm">Chargement des rendez-vous...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-700 shadow-luxury">
        {error}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl bg-ivory p-12 text-center text-sm text-charcoal-muted shadow-luxury">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appt) => (
        <div
          key={appt.id}
          className="rounded-2xl bg-ivory p-5 shadow-luxury md:p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  {appt.first_name} {appt.last_name}
                </h3>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    statusStyles[appt.status]
                  )}
                >
                  {statusLabels[appt.status]}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-charcoal-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-champagne-dark" />
                  {formatShortDateFr(appt.appointment_date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-champagne-dark" />
                  {formatTime(appt.appointment_time)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-champagne-dark" />
                  {appt.service}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-champagne-dark" />
                  {appt.phone}
                </span>
              </div>

              {appt.notes && (
                <p className="mt-3 rounded-lg bg-beige/40 p-3 text-sm text-charcoal-muted">
                  {appt.notes}
                </p>
              )}
            </div>

            <div className="flex flex-shrink-0 gap-2">
              {appt.status !== "completed" && appt.status !== "cancelled" && (
                <>
                  <button
                    onClick={() => handleUpdate(appt.id, "completed")}
                    disabled={updatingId === appt.id}
                    className="flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                  >
                    {updatingId === appt.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Terminé
                  </button>
                  <button
                    onClick={() => handleUpdate(appt.id, "cancelled")}
                    disabled={updatingId === appt.id}
                    className="flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    {updatingId === appt.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
