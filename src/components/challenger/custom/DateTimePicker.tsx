"use client";

import * as React from "react";
import { Clock2Icon, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
  fromDate: Date;
  toDate: Date;
  timeLabel?: string;
  timeId?: string;
  id?: string;
}

export function DateTimePicker({
  date,
  setDate,
  fromDate,
  toDate,
  timeLabel = "Heure du match",
  timeId = "match-time",
  id = "datetime",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (date) {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        newDate.setSeconds(date.getSeconds());
      } else {
        newDate.setHours(14);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
      }
      setDate(newDate);
    } else {
      setDate(undefined);
    }
  };

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    const currentDate = date || new Date();
    const newDate = new Date(currentDate);

    if (type === "hours") {
      newDate.setHours(parseInt(value, 10));
    } else if (type === "minutes") {
      newDate.setMinutes(parseInt(value, 10));
      newDate.setSeconds(0);
    }

    setDate(newDate);
  };

  const formatTime = (date?: Date): string => {
    if (!date) return "14:00:00";

    return format(date, "HH:mm:ss", { locale: fr });
  };

  const formatDateTime = () => {
    if (!date) {
      return "Sélectionnez une date et heure";
    }

    const dateStr = format(date, "dd/MM/yyyy", { locale: fr });
    const timeStr = format(date, "HH:mm", { locale: fr });
    return `${dateStr} à ${timeStr}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          className="w-full justify-between font-normal h-11"
        >
          <div className="flex items-center gap-2">{formatDateTime()}</div>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Card className="w-fit py-4 border-0 shadow-none">
          <CardContent className="px-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={fr}
              captionLayout="dropdown-buttons"
              fromDate={fromDate}
              toDate={toDate}
              initialFocus
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-6 border-t px-4 !pt-4">
            <div className="flex w-full flex-col gap-3">
              <Label htmlFor={timeId}>{timeLabel}</Label>
              <div className="flex w-full items-center gap-2">
                <div className="flex-1">
                  <Label
                    htmlFor={`${timeId}-hours`}
                    className="text-xs text-muted-foreground"
                  >
                    Heures
                  </Label>
                  <Select
                    value={
                      date ? date.getHours().toString().padStart(2, "0") : "14"
                    }
                    onValueChange={(value) => handleTimeChange("hours", value)}
                  >
                    <SelectTrigger id={`${timeId}-hours`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}h
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label
                    htmlFor={`${timeId}-minutes`}
                    className="text-xs text-muted-foreground"
                  >
                    Minutes
                  </Label>
                  <Select
                    value={
                      date
                        ? (Math.round(date.getMinutes() / 5) * 5).toString()
                        : "0"
                    }
                    onValueChange={(value) =>
                      handleTimeChange("minutes", value)
                    }
                  >
                    <SelectTrigger id={`${timeId}-minutes`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const minutes = i * 5;
                        return (
                          <SelectItem key={minutes} value={minutes.toString()}>
                            {minutes.toString().padStart(2, "0")}min
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
