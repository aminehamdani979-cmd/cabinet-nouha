"use client";

import { useState, useEffect, useCallback } from "react";
import { AvailableSlot, Appointment, BlockedDate, AppointmentStatus } from "@/types/booking";

// ----------------------------------------------------------------------------
// useAdminSlots
// ----------------------------------------------------------------------------
interface UseAdminSlotsResult {
  slots: AvailableSlot[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addSlots: (slotDate: string, slotTimes: string[]) => Promise<{ success: boolean; error?: string }>;
  removeSlot: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useAdminSlots(): UseAdminSlotsResult {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/slots", { cache: "no-store" });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Erreur de chargement.");
        return;
      }
      setSlots(data.slots || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les créneaux.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSlots = useCallback(
    async (slotDate: string, slotTimes: string[]) => {
      try {
        const res = await fetch("/api/admin/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slot_date: slotDate, slot_times: slotTimes }),
        });
        const data = await res.json();
        if (!data.success) {
          return { success: false, error: data.error };
        }
        await refresh();
        return { success: true };
      } catch (err) {
        console.error(err);
        return { success: false, error: "Erreur réseau." };
      }
    },
    [refresh]
  );

  const removeSlot = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!data.success) {
          return { success: false, error: data.error };
        }
        await refresh();
        return { success: true };
      } catch (err) {
        console.error(err);
        return { success: false, error: "Erreur réseau." };
      }
    },
    [refresh]
  );

  return { slots, loading, error, refresh, addSlots, removeSlot };
}

// ----------------------------------------------------------------------------
// useAdminAppointments
// ----------------------------------------------------------------------------
interface AppointmentFilters {
  status?: AppointmentStatus | "all";
  date?: string;
  search?: string;
}

interface UseAdminAppointmentsResult {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateStatus: (id: string, status: AppointmentStatus) => Promise<{ success: boolean; error?: string }>;
}

export function useAdminAppointments(filters: AppointmentFilters): UseAdminAppointmentsResult {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "all") params.set("status", filters.status);
      if (filters.date) params.set("date", filters.date);
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`/api/admin/appointments?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Erreur de chargement.");
        return;
      }
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les rendez-vous.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.date, filters.search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateStatus = useCallback(
    async (id: string, status: AppointmentStatus) => {
      try {
        const res = await fetch("/api/admin/appointments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        const data = await res.json();
        if (!data.success) {
          return { success: false, error: data.error };
        }
        await refresh();
        return { success: true };
      } catch (err) {
        console.error(err);
        return { success: false, error: "Erreur réseau." };
      }
    },
    [refresh]
  );

  return { appointments, loading, error, refresh, updateStatus };
}

// ----------------------------------------------------------------------------
// useAdminBlockedDates
// ----------------------------------------------------------------------------
interface UseAdminBlockedDatesResult {
  blockedDates: BlockedDate[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addBlockedDate: (date: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  removeBlockedDate: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useAdminBlockedDates(): UseAdminBlockedDatesResult {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blocked-dates", { cache: "no-store" });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Erreur de chargement.");
        return;
      }
      setBlockedDates(data.blockedDates || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les dates bloquées.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBlockedDate = useCallback(
    async (date: string, reason?: string) => {
      try {
        const res = await fetch("/api/admin/blocked-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blocked_date: date, reason }),
        });
        const data = await res.json();
        if (!data.success) {
          return { success: false, error: data.error };
        }
        await refresh();
        return { success: true };
      } catch (err) {
        console.error(err);
        return { success: false, error: "Erreur réseau." };
      }
    },
    [refresh]
  );

  const removeBlockedDate = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/blocked-dates?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!data.success) {
          return { success: false, error: data.error };
        }
        await refresh();
        return { success: true };
      } catch (err) {
        console.error(err);
        return { success: false, error: "Erreur réseau." };
      }
    },
    [refresh]
  );

  return { blockedDates, loading, error, refresh, addBlockedDate, removeBlockedDate };
}
