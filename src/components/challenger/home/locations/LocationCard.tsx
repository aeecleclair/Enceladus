"use client";

import {
  LocationComplete,
  Match,
  MatchComplete,
} from "../../../api/hyperionSchemas";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import {
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Navigation,
  Trophy,
  Users,
  School,
} from "lucide-react";

interface LocationCardProps {
  location: LocationComplete;
  nextMatch?: MatchComplete;
  totalMatches: number;
  sports?: Array<{ id: string; name: string; sport_category?: string | null }>;
  schools?: Array<{ id: string; name: string }>;
}

export function LocationCard({
  location,
  nextMatch,
  totalMatches,
  sports = [],
  schools = [],
}: LocationCardProps) {
  // Helper function to open map application
  const openMap = (location: { name: string; address?: string | null }) => {
    const query = location.address
      ? `${location.name}, ${location.address}`
      : location.name;

    // Try to open in Google Maps (works on most devices)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    // For mobile devices, try to open native map apps first
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile) {
      // iOS: Try Apple Maps first, fallback to Google Maps
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const appleMapsUrl = `maps://maps.apple.com/?q=${encodeURIComponent(query)}`;
        window.open(appleMapsUrl, "_blank");
        // Fallback to Google Maps if Apple Maps doesn't open
        setTimeout(() => {
          window.open(googleMapsUrl, "_blank");
        }, 1000);
      } else {
        // Android: Try Google Maps app, fallback to web
        window.open(googleMapsUrl, "_blank");
      }
    } else {
      // Desktop: Open Google Maps in new tab
      window.open(googleMapsUrl, "_blank");
    }
  };

  // Helper functions to get names
  const getSportName = (sportId: string) => {
    return sports.find((sport) => sport.id === sportId)?.name || "Sport";
  };

  const getSchoolName = (schoolId: string) => {
    return schools.find((school) => school.id === schoolId)?.name || "École";
  };

  const getTeamName = (teamId: string) => {
    // For now, return team ID as name since we don't have team data in this context
    return `Équipe ${teamId.slice(-8)}`;
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    return {
      date: date.toLocaleDateString("fr-FR", dateOptions),
      time: date.toLocaleDateString("fr-FR", timeOptions),
    };
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="line-clamp-1">{location.name}</span>
        </CardTitle>
        {location.description && (
          <CardDescription className="line-clamp-2">
            {location.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Address */}
        {location.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Navigation className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{location.address}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {totalMatches} match{totalMatches > 1 ? "s" : ""}
            </span>
          </div>
          {location.latitude && location.longitude && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        {/* Next Match */}
        {nextMatch && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Prochain match
                </span>
              </div>

              <div className="ml-6 space-y-2">
                <h4 className="font-medium text-sm line-clamp-1">
                  {nextMatch.name}
                </h4>

                {nextMatch.date && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDateTime(nextMatch.date).date}</span>
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(nextMatch.date).time}</span>
                  </div>
                )}

                {/* Teams */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {getTeamName(nextMatch.team1_id)}
                  </span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="font-medium">
                    {getTeamName(nextMatch.team2_id)}
                  </span>
                </div>

                {/* Sport Badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700"
                  >
                    <Trophy className="h-3 w-3" />
                    {getSportName(nextMatch.sport_id)}
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openMap(location)}
          className="flex items-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          Itinéraire
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => openMap(location)}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Ouvrir la carte
        </Button>
      </CardFooter>
    </Card>
  );
}
