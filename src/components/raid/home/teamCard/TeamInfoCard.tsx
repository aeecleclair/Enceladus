import { cn } from "@/lib/utils";

import { JSX } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type InfoAccent =
  "default" | "emerald" | "amber" | "orange" | "sky" | "violet" | "rose";

const accentClasses: Record<InfoAccent, { border: string; value: string }> = {
  default: { border: "border-border/70", value: "" },
  emerald: {
    border: "border-emerald-500/30",
    value: "text-emerald-700 dark:text-emerald-400",
  },
  amber: {
    border: "border-amber-500/30",
    value: "text-amber-700 dark:text-amber-400",
  },
  orange: {
    border: "border-orange-500/30",
    value: "text-orange-700 dark:text-orange-400",
  },
  sky: {
    border: "border-sky-500/30",
    value: "text-sky-700 dark:text-sky-400",
  },
  violet: {
    border: "border-violet-500/30",
    value: "text-violet-700 dark:text-violet-400",
  },
  rose: {
    border: "border-rose-500/30",
    value: "text-rose-700 dark:text-rose-400",
  },
};

export interface TeamInfo {
  title: string;
  value: string;
  description: string;
  unit?: JSX.Element;
  accent?: InfoAccent;
}

interface TeamInfoCardProps {
  info: TeamInfo;
  isLoaded: boolean;
}

export const TeamInfoCard = ({ info, isLoaded }: TeamInfoCardProps) => {
  const accent = accentClasses[info.accent ?? "default"];
  return (
    <Card
      key={info.title}
      className={cn("bg-card/95 shadow-sm", accent.border)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {isLoaded ? (
            <span>{info.title}</span>
          ) : (
            <Skeleton className="w-24 h-5" />
          )}
        </CardTitle>
        {info.unit &&
          (isLoaded ? (
            info.unit
          ) : (
            <Skeleton className="w-4 h-4 text-muted-foreground" />
          ))}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold tracking-tight", accent.value)}>
          {isLoaded ? info.value : <Skeleton className="w-37.5 h-6" />}
        </div>

        {isLoaded ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {info.description}
          </p>
        ) : (
          <Skeleton className="w-30 h-4 mt-1" />
        )}
      </CardContent>
    </Card>
  );
};
