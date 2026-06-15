"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { useAdminAppointments } from "@/hooks/useAdmin";
import { AppointmentStatus } from "@/types/booking";

const statusOptions: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En Attente" },
  { value: "confirmed", label: "Confirmé" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

export function AppointmentSearch() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");

  const { appointments, loading, error, updateStatus } = useAdminAppointments({
    search: search.trim() || undefined,
    status,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-ivory p-6 shadow-luxury">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Rechercher des Rendez-vous
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, prénom ou téléphone..."
              className="w-full rounded-lg border border-charcoal/15 bg-ivory py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-charcoal/35 transition-colors focus:border-champagne focus:outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AppointmentStatus | "all")}
            className="w-full rounded-lg border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal transition-colors focus:border-champagne focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AppointmentsTable
        appointments={appointments}
        loading={loading}
        error={error}
        emptyMessage="Aucun rendez-vous ne correspond à votre recherche."
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
