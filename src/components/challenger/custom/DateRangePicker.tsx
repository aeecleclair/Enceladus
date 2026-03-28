"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange: (startDate?: Date, endDate?: Date) => void;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
  label?: string;
  id?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  className,
  fromDate,
  toDate,
  label = "Période de l'édition",
  id = "dateRange",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      if (startDate && endDate) {
        return { from: startDate, to: endDate };
      } else if (startDate) {
        return { from: startDate, to: undefined };
      }
      // Default to current date if no dates provided
      return undefined;
    },
  );

  React.useEffect(() => {
    if (startDate && endDate) {
      setDateRange({ from: startDate, to: endDate });
    } else if (startDate) {
      setDateRange({ from: startDate, to: undefined });
    } else {
      setDateRange(undefined);
    }
  }, [startDate, endDate]);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange(range?.from, range?.to);

    // Close popover when both dates are selected
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return "Sélectionnez une période";
    }

    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "dd/MM/yyyy", { locale: fr })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: fr })}`;
    }

    return `À partir du ${format(dateRange.from, "dd/MM/yyyy", { locale: fr })}`;
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Label htmlFor={id} className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-full justify-between font-normal"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {formatDateRange()}
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            locale={fr}
            fromDate={fromDate}
            toDate={toDate}
            captionLayout="dropdown-buttons"
            className="rounded-lg border-0 shadow-none"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
