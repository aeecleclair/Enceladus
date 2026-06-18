"use client";

import { cn } from "@/lib/utils";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  date?: Date;
  defaultDate?: Date;
  fromMonth?: Date;
  toMonth?: Date;
  setDate: (date?: Date) => void;
}

export function DatePicker({
  date,
  setDate,
  defaultDate,
  fromMonth,
  toMonth,
}: DatePickerProps) {
  const year = new Date().getFullYear();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: fr })
          ) : (
            <span>Sélectionner une date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={fr}
          captionLayout="dropdown"
          startMonth={fromMonth ?? new Date(1900, 0)}
          endMonth={toMonth ?? new Date(year + 10, 11)}
          defaultMonth={defaultDate}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
