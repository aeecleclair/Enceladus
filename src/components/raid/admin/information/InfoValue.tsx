import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InfoValueProps {
  value: ReactNode;
  placeholder: string;
  /** When true, render the muted placeholder instead of the value. */
  isEmpty: boolean;
  className?: string;
}

/**
 * Consistent display of a "big value or muted placeholder" used on every
 * info / price / date tile in the admin information page.
 */
export const InfoValue = ({
  value,
  placeholder,
  isEmpty,
  className,
}: InfoValueProps) => {
  if (isEmpty) {
    return (
      <div
        className={cn(
          "text-base font-medium text-muted-foreground",
          className,
        )}
      >
        {placeholder}
      </div>
    );
  }
  return (
    <div className={cn("text-2xl font-bold tracking-tight", className)}>
      {value}
    </div>
  );
};
