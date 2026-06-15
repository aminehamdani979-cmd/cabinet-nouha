"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  CalendarDays,
  CalendarX,
  CalendarPlus,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab = "today" | "upcoming" | "search" | "slots" | "planning" | "blocked";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  onLogout: () => void;
}

const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "today", label: "Aujourd'hui", icon: CalendarClock },
  { id: "upcoming", label: "À Venir", icon: CalendarDays },
  { id: "search", label: "Recherche", icon: Search },
  { id: "slots", label: "Horaires", icon: LayoutDashboard },
  { id: "planning", label: "Planning", icon: CalendarPlus },
  { id: "blocked", label: "Dates Bloquées", icon: CalendarX },
];

export function AdminHeader({ activeTab, onChangeTab, onLogout }: AdminHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-charcoal shadow-luxury">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <div>
          <h1 className="font-display text-xl font-semibold text-ivory">
            Cabinet <span className="text-champagne-light">Nouha</span>
          </h1>
          <p className="text-[10px] uppercase tracking-luxury text-ivory/40">
            Administration
          </p>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-champagne text-charcoal"
                    : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
          <button
            onClick={onLogout}
            className="ml-2 flex items-center gap-2 rounded-full border border-ivory/15 px-4 py-2 text-sm font-medium text-ivory/70 transition-colors hover:border-red-400/40 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-full border border-ivory/15 p-2 text-ivory lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ivory/10 px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onChangeTab(tab.id);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-champagne text-charcoal"
                      : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
            <button
              onClick={onLogout}
              className="mt-2 flex items-center gap-3 rounded-lg border border-ivory/15 px-4 py-3 text-sm font-medium text-ivory/70 transition-colors hover:border-red-400/40 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}