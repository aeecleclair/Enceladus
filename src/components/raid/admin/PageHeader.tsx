"use client";

import { cn } from "@/lib/utils";

import { ReactNode } from "react";

import { LucideIcon } from "lucide-react";

type AccentColor =
  | "primary"
  | "emerald"
  | "amber"
  | "orange"
  | "sky"
  | "teal"
  | "violet";

const accentStyles: Record<AccentColor, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  orange: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  teal: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
};

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  accent?: AccentColor;
  children?: ReactNode;
}

export const PageHeader = ({
  icon: Icon,
  title,
  description,
  accent = "primary",
  children,
}: PageHeaderProps) => {
  return (
    <section className="mb-4 rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              accentStyles[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </section>
  );
};
