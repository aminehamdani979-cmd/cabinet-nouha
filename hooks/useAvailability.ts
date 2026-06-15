"use client";

import { useState, useEffect, useCallback } from "react";
import { AvailableSlot, AvailabilityResponse } from "@/types/booking";

interface UseAvailabilityResult {
  slots: AvailableSlot[];
  blockedDates: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Fetches available slots and blocked dates from the public availability API.
 * Used by the booking calendar to determine which dates/times can be selected.
 */
export function useAvailability(): UseAvailabilityResult {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/availability", {
        cache: "no-store",
      });
      const data: AvailabilityResponse = await res.json();

      if (!data.success) {
        setError(data.error || "Erreur de chargement.");
        return;
      }

      setSlots(data.slots || []);
      setBlockedDates(data.blockedDates || []);
    } catch (err) {
      console.error("useAvailability error:", err);
      setError("Impossible de charger les disponibilités. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return { slots, blockedDates, loading, error, refresh: fetchAvailability };
}
