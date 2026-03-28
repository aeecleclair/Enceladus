"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "../../ui/carousel";
import { MatchComplete } from "@/src/api/hyperionSchemas";
import { MatchCarouselCard } from "./MatchCarouselCard";

interface MatchCarouselSectionProps {
  title: string;
  icon: ReactNode;
  matches: MatchComplete[];
  sports: Array<{ id: string; name: string }> | undefined;
  currentTime: Date;
  onSelectMatch: (id: string) => void;
  sort?: boolean;
  emptyState?: ReactNode;
  isFavorite?: (id: string) => boolean;
  toggleFavorite?: (id: string) => void;
}

export const MatchCarouselSection = ({
  title,
  icon,
  matches,
  sports,
  currentTime,
  onSelectMatch,
  sort = false,
  emptyState,
  isFavorite,
  toggleFavorite,
}: MatchCarouselSectionProps) => {
  if (matches.length === 0) {
    if (!emptyState) return null;
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>{emptyState}</CardContent>
      </Card>
    );
  }

  const items = sort
    ? matches.slice().sort((a, b) => {
        const aLive = !a.ended && !!a.date && new Date(a.date) <= currentTime;
        const bLive = !b.ended && !!b.date && new Date(b.date) <= currentTime;
        const aPast = a.ended;
        const bPast = b.ended;
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        if (!aPast && bPast) return -1;
        if (aPast && !bPast) return 1;
        return (a.date ?? "").localeCompare(b.date ?? "");
      })
    : matches;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="px-0 sm:px-12">
          <Carousel opts={{ align: "start", loop: false, dragFree: true }}>
            <CarouselContent className="px-2 items-stretch">
              {items.map((match) => {
                const sportName =
                  sports?.find((s) => s.id === match.sport_id)?.name ?? "Sport";
                return (
                  <MatchCarouselCard
                    key={match.id}
                    match={match}
                    sportName={sportName}
                    currentTime={currentTime}
                    onSelect={onSelectMatch}
                    isFavorite={isFavorite?.(match.id)}
                    onToggleFavorite={
                      toggleFavorite ? () => toggleFavorite(match.id) : undefined
                    }
                  />
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
};
