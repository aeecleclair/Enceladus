"use client";

import { MapPin, ExternalLink, Star } from "lucide-react";
import { CarouselItem } from "../../ui/carousel";
import { MatchComplete } from "@/src/api/hyperionSchemas";
import {
  openMap,
  getTimeBadgeClass,
  getTimeElapsed,
  getTimeUntilEvent,
} from "./matchUtils";

interface MatchCarouselCardProps {
  match: MatchComplete;
  sportName: string;
  currentTime: Date;
  onSelect: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const MatchCarouselCard = ({
  match,
  sportName,
  currentTime,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: MatchCarouselCardProps) => {
  const isLive =
    !match.ended && !!match.date && new Date(match.date) <= currentTime;
  const isPast = match.ended;
  const location = match.location;

  return (
    <CarouselItem key={match.id} className="basis-[300px]">
      <div
        className={`rounded-xl p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors flex flex-col gap-3 my-5 mx-2 min-h-[190px] ${isLive ? "border-2 border-red-500 animate-border-pulse" : "border"}`}
        onClick={() => onSelect(match.id)}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {sportName}
          </span>
          <div className="flex items-center gap-1.5">
            {isLive ? (
              <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE · {match.date ? getTimeElapsed(match.date, currentTime) : ""}
              </span>
            ) : isPast ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                Terminé
              </span>
            ) : (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTimeBadgeClass(match.date, currentTime)}`}
              >
                {match.date ? getTimeUntilEvent(match.date, currentTime) : ""}
              </span>
            )}
            <button
              className="p-0.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
              }}
            >
              <Star
                className={`h-3.5 w-3.5 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between flex-1">
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <span className={`font-semibold text-sm leading-tight text-center ${match.winner_id === match.team1_id ? "text-green-600" : ""}`}>
              {match.team1.name}
            </span>
            <span className={`text-2xl font-black tabular-nums ${match.winner_id === match.team1_id ? "text-green-600" : "text-gray-900"}`}>
              {isLive || isPast ? match.score_team1 ?? "-" : "-"}
            </span>
          </div>
          <span className="text-muted-foreground font-medium text-sm flex-shrink-0">
            {isLive || isPast ? "–" : "vs"}
          </span>
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <span className={`font-semibold text-sm leading-tight text-center ${match.winner_id === match.team2_id ? "text-green-600" : ""}`}>
              {match.team2.name}
            </span>
            <span className={`text-2xl font-black tabular-nums ${match.winner_id === match.team2_id ? "text-green-600" : "text-gray-900"}`}>
              {isLive || isPast ? match.score_team2 ?? "-" : "-"}
            </span>
          </div>
        </div>
        {location && (
          <button
            className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground bg-slate-50 hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors w-full"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              openMap(location);
            }}
          >
            <MapPin className="h-3 w-3 flex-shrink-0 text-blue-400" />
            <span className="truncate flex-1 text-left">{location.name}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </button>
        )}
      </div>
    </CarouselItem>
  );
};
