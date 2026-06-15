"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-luxury",
            align === "center" ? "justify-center" : "justify-start",
            light ? "text-champagne-light" : "text-champagne-dark"
          )}
        >
          {align === "center" && <span className="h-px w-8 bg-champagne/60" />}
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-champagne/60" />}
        </div>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl",
          light ? "text-ivory" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            light ? "text-ivory/70" : "text-charcoal-muted"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
