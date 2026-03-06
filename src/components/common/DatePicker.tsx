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
import { before } from "node:test";

interface DatePickerProps {
  date?: Date;
  defaultDate?: Date;
  fromMonth?: Date;
  toMonth?: Date;
  setDate: (date?: Date) => void;
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  defaultDate,
  fromMonth,
  toMonth,
  placeholder,
}: DatePickerProps) {
  const year = new Date().getFullYear();
  return (
    <Popover>
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
            format(date, "PPP", { locale: fr })
          ) : (
            <span>{placeholder || "Sélectionner une date"}</span>
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
