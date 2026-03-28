"use client";

import React from "react";
import { useSports } from "@/src/hooks/useSports";
import { MapPin, Calendar, Clock, Search, ChevronRight, Trophy } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  LocationComplete,
  Match,
  MatchComplete,
} from "@/src/api/hyperionSchemas";

interface LocationInfoMarkerProps {
  location: LocationComplete;
  hasMatches: boolean;
  totalMatches: number;
  nextMatch?: MatchComplete;
  upcomingMatches?: MatchComplete[];
  sports?: any[];
}

export function LocationInfoMarker({
  location,
  hasMatches,
  totalMatches,
  nextMatch,
  upcomingMatches = [],
  sports,
}: LocationInfoMarkerProps) {
  const openInMaps = () => {
    if (location.latitude && location.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
        "_blank",
      );
    }
  };

  const navigateToSearchWithLocation = () => {
    const params = new URLSearchParams();
    params.set("location", location.id);
    window.location.href = `/search?${params.toString()}`;
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.round(
      (date.getTime() - now.getTime()) / (1000 * 60),
    );

    let timeDisplay = "";
    if (diffMinutes < 0) timeDisplay = "Passé";
    else if (diffMinutes < 60) timeDisplay = `${diffMinutes}min`;
    else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      timeDisplay =
        minutes === 0
          ? `${hours}h`
          : `${hours}h${minutes.toString().padStart(2, "0")}`;
    }

    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeUntil: timeDisplay,
    };
  };

  // Compute sports breakdown for this location
  const sportBreakdown = React.useMemo(() => {
    if (!upcomingMatches.length || !Array.isArray(sports)) return null;
    const counts = new Map<string, number>();
    for (const m of upcomingMatches) {
      counts.set(m.sport_id, (counts.get(m.sport_id) || 0) + 1);
    }
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const allSports = sorted
      .map(([id, count]) => ({
        sport: sports.find((s: any) => s.id === id),
        count,
      }))
      .filter((s) => s.sport);
    return {
      isSingleSport: allSports.length === 1,
      allSports,
      dominantSport: allSports[0]?.sport,
      uniqueCount: allSports.length,
    };
  }, [upcomingMatches, sports]);

  const [isOpen, setIsOpen] = React.useState(false);
  const markerRef = React.useRef<HTMLDivElement>(null);

  // Close info card on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        markerRef.current &&
        !markerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);
  return (
    <div
      ref={markerRef}
      className="relative flex flex-col items-center select-none"
      style={{ minWidth: 60 }}
    >
      {/* Info card, only when open */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          {/* Bottom triangle for popup anchor */}
          <div className="absolute left-1/2 top-full transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          </div>
          <div className="w-[300px] bg-white rounded-2xl shadow-xl border overflow-hidden">
            {/* Header — inspired by reference card */}
            <div className="p-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2.5 rounded-xl shrink-0">
                  <MapPin className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight">
                    {location.name}
                  </h3>
                  {(location.address || location.description) && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {location.address || location.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Sports + stats */}
              {hasMatches && sportBreakdown && (
                <div className="mt-3 pt-3 border-t space-y-1">
                  {sportBreakdown.allSports.map(({ sport, count }) => (
                    <div
                      key={sport.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-700 font-medium">{sport.name}</span>
                      <span className="text-muted-foreground">
                        {count} match{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Next match */}
            {nextMatch && (() => {
              const now = new Date();
              const matchDate = new Date(nextMatch.date!);
              const diffMinutes = Math.round(
                (matchDate.getTime() - now.getTime()) / (1000 * 60),
              );
              const urgency =
                diffMinutes <= 15 ? "urgent" : diffMinutes <= 60 ? "soon" : "normal";
              const timeUntil =
                diffMinutes < 0
                  ? "Passé"
                  : diffMinutes < 60
                    ? `${diffMinutes}min`
                    : (() => {
                        const h = Math.floor(diffMinutes / 60);
                        const m = diffMinutes % 60;
                        return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, "0")}`;
                      })();
              const sportObj = Array.isArray(sports)
                ? sports.find((s: any) => s.id === nextMatch.sport_id)
                : null;

              return (
                <div className="mx-4 mb-3 rounded-xl bg-slate-50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                      Prochain match
                    </span>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 font-mono text-white ${
                        urgency === "urgent"
                          ? "bg-red-500"
                          : urgency === "soon"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    >
                      <Clock className="h-2.5 w-2.5 mr-0.5" />
                      {timeUntil}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-semibold">{nextMatch.team1?.name}</span>
                    <span className="text-muted-foreground text-xs">vs</span>
                    <span className="font-semibold">{nextMatch.team2?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {sportObj && !sportBreakdown?.isSingleSport && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 bg-blue-50 border-blue-200 text-blue-700"
                      >
                        {sportObj.name}
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {matchDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      {" • "}
                      {matchDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Upcoming matches list */}
            {upcomingMatches.length > 1 && (
              <div className="px-4 pb-3">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  À venir ({upcomingMatches.length})
                </span>
                <div className="mt-1.5 space-y-0.5 max-h-24 overflow-y-auto">
                  {upcomingMatches.slice(1, 4).map((match) => {
                    const matchDate = formatMatchDate(match.date!);
                    const sport = sports?.find((s: any) => s.id === match.sport_id);
                    return (
                      <div
                        key={match.id}
                        className="flex items-center gap-1.5 text-[11px] py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-muted-foreground whitespace-nowrap font-mono text-[10px]">
                          {matchDate.time}
                        </span>
                        <span className="font-medium truncate">{match.team1?.name}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-medium truncate">{match.team2?.name}</span>
                        {sport && !sportBreakdown?.isSingleSport && (
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1 py-0 ml-auto shrink-0 bg-blue-50 border-blue-200 text-blue-700"
                          >
                            {sport.name}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
                {upcomingMatches.length > 4 && (
                  <button
                    onClick={navigateToSearchWithLocation}
                    className="w-full text-[10px] text-muted-foreground hover:text-primary transition-colors text-center pt-1"
                  >
                    +{upcomingMatches.length - 4} autres
                  </button>
                )}
              </div>
            )}

            {/* Footer actions */}
            <div className="flex gap-2 p-4 pt-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateToSearchWithLocation}
                className="flex-1 text-xs bg-slate-50 hover:bg-slate-100"
              >
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Voir les matchs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const query = location.address
                    ? `${location.name}, ${location.address}`
                    : location.name;
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                    "_blank",
                  );
                }}
                className="flex-1 text-xs bg-slate-50 hover:bg-slate-100"
              >
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                Naviguer
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Pin */}
      <div
        className="cursor-pointer absolute left-1/2 bottom-0 -translate-x-1/2 z-[3]"
        onClick={() => setIsOpen((open) => !open)}
      >
        {hasMatches ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 bg-white rounded-full shadow-lg border pl-1.5 pr-2 py-1 hover:shadow-xl transition-shadow">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {totalMatches}
              </span>
              {sportBreakdown && (
                <span className="text-[10px] font-medium text-slate-700 whitespace-nowrap">
                  {sportBreakdown.isSingleSport
                    ? sportBreakdown.dominantSport?.name
                    : `${sportBreakdown.uniqueCount} sports`}
                </span>
              )}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 bg-white rounded-full shadow-lg border pl-1 pr-2 py-1">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                Aucun match
              </span>
            </div>
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
