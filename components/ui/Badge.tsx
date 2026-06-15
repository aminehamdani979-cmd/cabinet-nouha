import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "light" | "dark" | "outline";
  className?: string;
}

export function Badge({ icon: Icon, children, variant = "light", className }: BadgeProps) {
  const variants = {
    light: "bg-ivory/90 text-charcoal border border-champagne/30",
    dark: "bg-charcoal/90 text-ivory border border-champagne/30",
    outline: "bg-transparent text-champagne-dark border border-champagne/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider backdrop-blur-sm",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-champagne-dark" strokeWidth={2} />}
      {children}
    </span>
  );
}
