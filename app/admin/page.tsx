"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminHeader, AdminTab } from "@/components/admin/AdminHeader";
import { TodayAppointments } from "@/components/admin/TodayAppointments";
import { UpcomingAppointments } from "@/components/admin/UpcomingAppointments";
import { AppointmentSearch } from "@/components/admin/AppointmentSearch";
import { SlotManager } from "@/components/admin/SlotManager";
import { ScheduleGenerator } from "@/components/admin/ScheduleGenerator";
import { BlockedDatesManager } from "@/components/admin/BlockedDatesManager";

type AuthState = "checking" | "authenticated" | "unauthenticated";

export default function AdminDashboardPage() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [activeTab, setActiveTab] = useState<AdminTab>("today");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const data = await res.json();
        setAuthState(data.authenticated ? "authenticated" : "unauthenticated");
      } catch (err) {
        console.error(err);
        setAuthState("unauthenticated");
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (err) {
      console.error(err);
    } finally {
      setAuthState("unauthenticated");
    }
  };

  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <Loader2 className="h-6 w-6 animate-spin text-champagne" />
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <AdminLogin onSuccess={() => setAuthState("authenticated")} />;
  }

  return (
    <div className="min-h-screen bg-beige/30">
      <AdminHeader activeTab={activeTab} onChangeTab={setActiveTab} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        {activeTab === "today" && <TodayAppointments />}
        {activeTab === "upcoming" && <UpcomingAppointments />}
        {activeTab === "search" && <AppointmentSearch />}
        {activeTab === "slots" && <SlotManager />}
        {activeTab === "planning" && <ScheduleGenerator />}
        {activeTab === "blocked" && <BlockedDatesManager />}
      </main>
    </div>
  );
}