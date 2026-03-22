"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  date?: Date;
  defaultDate?: Date;
  fromMonth?: Date;
  toMonth?: Date;
  minDate?: Date;
  maxDate?: Date;
  withTime?: boolean;
  setDate: (date?: Date) => void;
}

export function DatePicker({
  date,
  setDate,
  defaultDate,
  fromMonth,
  toMonth,
  minDate,
  maxDate,
  withTime = false,
}: DatePickerProps) {
  const year = new Date().getFullYear();
  const [open, setOpen] = React.useState(false);

  const getTimeValue = (value?: Date) => {
    if (!value) return "";
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const mergeDateAndTime = (baseDate: Date, timeValue: string) => {
    const [hours, minutes] = timeValue.split(":").map(Number);
    const nextDate = new Date(baseDate);
    nextDate.setHours(Number.isNaN(hours) ? 0 : hours, Number.isNaN(minutes) ? 0 : minutes, 0, 0);
    return nextDate;
  };

  const handleDateSelect = (selectedDate?: Date) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    if (!withTime) {
      setDate(selectedDate);
      return;
    }

    const currentTime = getTimeValue(date) || getTimeValue(defaultDate) || "00:00";
    setDate(mergeDateAndTime(selectedDate, currentTime));
    if (!withTime) {
      setOpen(false);
    }
  };

  const isDateOutOfRange = React.useCallback(
    (day: Date) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);

      if (minDate) {
        const minStart = new Date(minDate);
        minStart.setHours(0, 0, 0, 0);
        if (dayStart < minStart) return true;
      }

      if (maxDate) {
        const maxStart = new Date(maxDate);
        maxStart.setHours(0, 0, 0, 0);
        if (dayStart > maxStart) return true;
      }

      return false;
    },
    [minDate, maxDate]
  );

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const baseDate = date ?? defaultDate ?? new Date();
    setDate(mergeDateAndTime(baseDate, value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, withTime ? "PPP HH:mm" : "PPP", { locale: fr })
          ) : (
            <span>Sélectionner une date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={fr}
          captionLayout="dropdown"
          startMonth={fromMonth ?? new Date(1900, 0)}
          endMonth={toMonth ?? new Date(year + 10, 11)}
          defaultMonth={defaultDate}
          disabled={isDateOutOfRange}
          autoFocus
        />
        {withTime ? (
          <div className="border-t p-3">
            <Input
              type="time"
              value={getTimeValue(date) || getTimeValue(defaultDate) || "00:00"}
              onChange={handleTimeChange}
              step={60}
            />
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
