"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Fragment } from "react";

export type RegisterStepId = "identity" | "confirm";

export interface RegisterStep {
  id: RegisterStepId;
  label: string;
}

interface RegisterStepsProps {
  steps: RegisterStep[];
  currentStep: RegisterStepId;
}

export const RegisterSteps = ({ steps, currentStep }: RegisterStepsProps) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Étapes de l'inscription" className="w-full">
      <ol className="flex items-start">
        {steps.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === steps.length - 1;
          return (
            <Fragment key={step.id}>
              <li className="flex flex-col items-center gap-2 min-w-0">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isDone &&
                      "border-emerald-600/70 bg-emerald-600/15 text-emerald-700 dark:border-emerald-500/70 dark:text-emerald-400",
                    isCurrent &&
                      "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500",
                    !isDone &&
                      !isCurrent &&
                      "border-border bg-background text-muted-foreground",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isDone ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-center text-xs font-medium leading-tight",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </li>
              {!isLast && (
                <div
                  className={cn(
                    "mt-4 h-0.5 flex-1 self-start transition-colors min-w-4",
                    i < currentIndex
                      ? "bg-emerald-600 dark:bg-emerald-500"
                      : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
