"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Locale,
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  getMonth,
  isSameDay,
  isSameHour,
  isSameMonth,
  isToday,
  setHours,
  setMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import {
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type View = "day" | "week" | "month" | "year";

type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (date: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEmptySlotClick?: (date: Date, hour?: number) => void;
  enableHotkeys?: boolean;
  today: Date;
};

const Context = createContext<ContextType>({} as ContextType);

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  subtitle?: string;
  color?: string;
  metadata?: {
    registeredCount?: number;
    maxVolunteers?: number;
    location?: string | null;
    type?: string;
    shiftId?: string;
    isRegistered?: boolean;
    team1?: string;
    team2?: string;
    sportName?: string;
  };
};

type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEmptySlotClick?: (date: Date, hour?: number) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = enUS,
  enableHotkeys = true,
  view: _defaultMode = "month",
  onEventClick,
  onEmptySlotClick,
  events: defaultEvents = [],
  onChangeView,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  return (
    <Context.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events: defaultEvents,
        setEvents: () => {},
        locale,
        enableHotkeys,
        onEventClick,
        onEmptySlotClick,
        onChangeView,
        today: new Date(),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    view: View;
  }
>(({ children, view, ...props }) => {
  const { view: currentView, setView, onChangeView } = useCalendar();

  return (
    <Button
      aria-current={currentView === view}
      size="sm"
      variant="ghost"
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}
    >
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = "CalendarViewTrigger";

const EventGroup = ({
  events,
  hour,
}: {
  events: CalendarEvent[];
  hour: Date;
}) => {
  const { onEventClick, onEmptySlotClick } = useCalendar();

  // Only render events that START within this hour on the SAME day
  const hourEvents = events
    .filter((event) => {
      const hourStart = hour;
      const hourEnd = addHours(hour, 1);

      // Only show events that start within this hour AND on the same day
      return (
        isSameDay(event.start, hour) &&
        event.start >= hourStart &&
        event.start < hourEnd
      );
    })
    .map((event, index) => {
      const hourStart = hour;

      // Calculate position within the hour where the event starts
      const startMinutesFromHour = differenceInMinutes(event.start, hourStart);
      const totalDurationMinutes = differenceInMinutes(event.end, event.start);

      const startPosition = (startMinutesFromHour / 60) * 100; // Percentage from top of hour
      const height = Math.max((totalDurationMinutes / 60) * 100, 8); // Height based on full duration

      return {
        ...event,
        startPosition,
        height,
        index,
      };
    });

  const handleEmptySpaceClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onEmptySlotClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const minutes = Math.floor((y / rect.height) * 60);
      const clickedTime = setHours(hour, hour.getHours());
      clickedTime.setMinutes(minutes);
      onEmptySlotClick(clickedTime, hour.getHours());
    }
  };

  // If no events start in this hour, render empty hour slot
  if (hourEvents.length === 0) {
    return (
      <div
        className="h-20 border-t last:border-b cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={handleEmptySpaceClick}
      />
    );
  }

  // Calculate positions for overlapping events
  const eventWidth =
    hourEvents.length > 1 ? `${95 / hourEvents.length}%` : "95%";

  return (
    <div
      className="h-20 border-t last:border-b relative cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={handleEmptySpaceClick}
    >
      {hourEvents.map((event, idx) => {
        const leftPosition =
          hourEvents.length > 1
            ? `${(idx * 95) / hourEvents.length + 2}%`
            : "2%";

        return (
          <div
            key={event.id}
            className={cn(
              "absolute cursor-pointer z-10 transition-all duration-200 hover:z-20 hover:shadow-lg overflow-hidden",
              "font-bold border-l-4 rounded p-2 text-xs bg-card",
            )}
            style={{
              top: `${event.startPosition}%`,
              height: `${event.height}%`,
              left: leftPosition,
              width: eventWidth,
              minHeight: "16px",
              backgroundColor: event.color ? `${event.color}30` : "#f1f5f930", // 30 for 30% opacity
              borderLeftColor: event.color || "#64748b",
              color: event.color || "#475569",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick && onEventClick(event);
            }}
            title={`${event.title}${event.subtitle ? ` - ${event.subtitle}` : ""} - ${format(event.start, "HH:mm")} à ${format(event.end, "HH:mm")}`}
          >
            <div className="p-1 h-full flex flex-col justify-between">
              <div className="flex-1 min-h-0">
                <div className="truncate text-[12px] font-bold leading-tight">
                  {event.title}
                </div>
                {event.subtitle && (
                  <div className="truncate text-[8px] text-muted-foreground/80 mt-0.5">
                    {event.subtitle}
                  </div>
                )}
              </div>

              {/* Time display */}
              <div className="flex justify-between text-[8px] text-muted-foreground/70 leading-none">
                <span>{format(event.start, "HH:mm")}</span>
                {event.height > 25 && <span>{format(event.end, "HH:mm")}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CalendarDayView = () => {
  const { view, events, date } = useCalendar();

  if (view !== "day") return null;

  const hours = [...Array(24)].map((_, i) => setHours(startOfDay(date), i));

  return (
    <div className="flex relative pt-2 h-full">
      <TimeTable />
      <div className="flex-1">
        {hours.map((hour) => (
          <EventGroup key={hour.toString()} hour={hour} events={events} />
        ))}
      </div>
    </div>
  );
};

const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }

    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: 1 }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  if (view !== "week") return null;

  return (
    <div className="flex flex-col relative h-full">
      <div className="flex sticky top-0 bg-card z-10 border-b mb-3">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              "text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center",
              [5, 6].includes(i) && "text-muted-foreground/50",
            )}
          >
            {format(date, "E", { locale })}
            <span
              className={cn(
                "h-6 grid place-content-center",
                isToday(date) &&
                  "bg-primary text-primary-foreground rounded-full size-6",
              )}
            >
              {format(date, "d")}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid grid-cols-7 flex-1">
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn(
                  "h-full text-sm text-muted-foreground border-l first:border-l-0",
                  [5, 6].includes(i) && "bg-muted/50",
                )}
                key={hours[0].toString()}
              >
                {hours.map((hour) => (
                  <EventGroup
                    key={hour.toString()}
                    hour={hour}
                    events={events}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CalendarMonthView = () => {
  const { date, view, events, locale, onEventClick } = useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== "month") return null;

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 gap-px sticky top-0 bg-background border-b">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "mb-2 text-right text-sm text-muted-foreground pr-2",
              [5, 6].includes(i) && "text-muted-foreground/50",
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-px">
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) => {
            // Show events that either start on this date or span across this date
            return (
              isSameDay(event.start, _date) ||
              isWithinInterval(_date, {
                start: startOfDay(event.start),
                end: endOfDay(event.end),
              })
            );
          });

          return (
            <div
              className={cn(
                "ring-1 p-2 text-sm text-muted-foreground ring-border",
                !isSameMonth(date, _date) && "text-muted-foreground/50",
              )}
              key={_date.toString()}
            >
              <span
                className={cn(
                  "size-6 grid place-items-center rounded-full mb-1 sticky top-0",
                  isToday(_date) && "bg-primary text-primary-foreground",
                )}
              >
                {format(_date, "d")}
              </span>

              {currentEvents.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="px-1 rounded text-sm flex items-center gap-1 cursor-pointer hover:bg-muted/50"
                    onClick={() => onEventClick && onEventClick(event)}
                  >
                    <div
                      className="shrink-0 size-2 rounded-full"
                      style={{
                        backgroundColor: event.color || "#64748b",
                      }}
                    ></div>
                    <span className="flex-1 truncate">{event.title}</span>
                    <time className="tabular-nums text-muted-foreground/50 text-xs">
                      {format(event.start, "HH:mm")}
                    </time>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      return getDaysInMonth(setMonth(date, i));
    });
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== "year") return null;

  return (
    <div className="grid grid-cols-4 gap-10 overflow-auto h-full">
      {months.map((days, i) => (
        <div key={days[0].toString()}>
          <span className="text-xl">{i + 1}</span>

          <div className="grid grid-cols-7 gap-2 my-5">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums">
            {days.map((_date) => {
              return (
                <div
                  key={_date.toString()}
                  className={cn(
                    getMonth(_date) !== i && "text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "aspect-square grid place-content-center size-full tabular-nums",
                      isSameDay(today, _date) &&
                        getMonth(_date) === i &&
                        "bg-primary text-primary-foreground rounded-full",
                    )}
                  >
                    {format(_date, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === "day") {
      setDate(addDays(date, 1));
    } else if (view === "week") {
      setDate(addWeeks(date, 1));
    } else if (view === "month") {
      setDate(addMonths(date, 1));
    } else if (view === "year") {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = "CalendarNextTrigger";

const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view } = useCalendar();

  const prev = useCallback(() => {
    if (view === "day") {
      setDate(subDays(date, 1));
    } else if (view === "week") {
      setDate(subWeeks(date, 1));
    } else if (view === "month") {
      setDate(subMonths(date, 1));
    } else if (view === "year") {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = "CalendarPrevTrigger";

const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, today } = useCalendar();

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = "CalendarTodayTrigger";

const CalendarCurrentDate = ({ locale = enUS }) => {
  const { date, view } = useCalendar();

  // Safety check to prevent undefined date errors
  if (!date) {
    return null;
  }

  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {format(date, view === "day" ? "dd MMMM yyyy" : "MMMM yyyy", {
        locale: locale,
      })}
    </time>
  );
};

const TimeTable = () => {
  const now = new Date();

  return (
    <div className="pr-2 w-12">
      {Array.from(Array(25).keys()).map((hour) => {
        return (
          <div
            className="text-right relative text-xs text-muted-foreground/50 h-20 last:h-0"
            key={hour}
          >
            {now.getHours() === hour && (
              <div
                className="absolute z- left-full translate-x-2 w-dvw h-[2px] bg-gray-500"
                style={{
                  top: `${(now.getMinutes() / 60) * 100}%`,
                }}
              >
                <div className="size-2 rounded-full bg-gray-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            )}
            <p className="top-0 -translate-y-1/2">
              {hour === 24 ? 0 : hour}:00
            </p>
          </div>
        );
      })}
    </div>
  );
};

const getDaysInMonth = (date: Date) => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: 1,
  });

  let currentDate = startOfWeekForMonth;
  const calendar = [];

  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

const generateWeekdays = (locale: Locale) => {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
    daysOfWeek.push(format(date, "E", { locale }));
  }
  return daysOfWeek;
};

export {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
};
