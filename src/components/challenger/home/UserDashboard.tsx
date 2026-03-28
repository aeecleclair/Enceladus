"use client";

import { useState, useMemo, useEffect } from "react";
import { Activity, Calendar, Star } from "lucide-react";
import { MatchCarouselSection } from "./dashboard/MatchCarouselSection";
import { Badge } from "../ui/badge";
import {
  CompetitionEdition,
  CompetitionUser,
  MatchComplete,
} from "@/src/api/hyperionSchemas";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useSports } from "@/src/hooks/useSports";
import { useLocations } from "@/src/hooks/useLocations";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { usePodiums } from "@/src/hooks/usePodiums";
import { useVolunteer } from "@/src/hooks/useVolunteer";
import { useVolunteerShifts } from "@/src/hooks/useVolunteerShifts";
import { useFavoriteMatches } from "@/src/hooks/useFavoriteMatches";
import UserVolunteerShiftDetail from "./volunteer-shifts/UserVolunteerShiftDetail";
import MatchDetailDialog from "./matches/MatchDetailDialog";
import SchoolStandingsDialog from "./standings/SchoolStandingsDialog";
import { VolunteerShiftsSection } from "./dashboard/VolunteerShiftsSection";
import { StandingsSection } from "./dashboard/StandingsSection";

interface UserDashboardProps {
  edition: CompetitionEdition;
  meCompetition?: CompetitionUser | null;
}

export const UserDashboard = ({
  edition,
  meCompetition,
}: UserDashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<{
    id: string;
    name: string;
    totalPoints: number;
    rank: number;
  } | null>(null);

  const { allMatches } = useAllMatches();
  const { sports } = useSports();
  const { sportSchools } = useSportSchools();
  const { locations } = useLocations();
  const { meParticipant } = useParticipant();
  const { globalPodium } = usePodiums();
  const { volunteer } = useVolunteer();
  const isVolunteer = volunteer && volunteer.length > 0;
  const { volunteerShifts } = useVolunteerShifts();
  const { favorites, toggleFavorite, isFavorite } = useFavoriteMatches();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const processedData = useMemo(() => {
    if (!allMatches || !sports || !sportSchools || !locations) {
      return {
        liveMatches: [] as MatchComplete[],
        todayMatches: [] as MatchComplete[],
        participantUpcomingMatches: [] as MatchComplete[],
        volunteerNextShifts: [],
      };
    }

    const now = new Date();
    const today = now.toDateString();

    const todaysMatches = allMatches.filter(
      (match) => match.date && new Date(match.date).toDateString() === today,
    );

    const liveMatches = todaysMatches.filter(
      (match) => !match.ended && match.date && new Date(match.date) <= now,
    );

    const todayMatches = todaysMatches
      .filter((match) => match.date && new Date(match.date) > now)
      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

    // Participant upcoming matches
    let participantUpcomingMatches: MatchComplete[] = [];
    if (meParticipant?.team_id) {
      participantUpcomingMatches = allMatches
        .filter(
          (match) =>
            (match.team1_id === meParticipant.team_id ||
              match.team2_id === meParticipant.team_id) &&
            match.date &&
            new Date(match.date) > now,
        )
        .sort(
          (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime(),
        )
        .slice(0, 3);
    }

    // Volunteer next shifts — user's registered shifts only
    let volunteerNextShifts: any[] = [];
    if (volunteer && volunteer.length > 0 && volunteerShifts) {
      const registeredIds = new Set(volunteer.map((reg) => reg.shift_id));
      volunteerNextShifts = volunteerShifts
        .filter(
          (shift) =>
            registeredIds.has(shift.id) &&
            shift.start_time &&
            new Date(shift.start_time) > now,
        )
        .sort(
          (a, b) =>
            new Date(a.start_time!).getTime() -
            new Date(b.start_time!).getTime(),
        )
        .slice(0, 3)
        .map((shift) => ({
          id: shift.id,
          name: shift.name || "Créneau bénévole",
          start: shift.start_time!,
          end: shift.end_time,
          location: shift.location ?? null,
        }));
    }

    return {
      liveMatches,
      todayMatches,
      participantUpcomingMatches,
      volunteerNextShifts,
    };
  }, [
    allMatches,
    sports,
    sportSchools,
    locations,
    meParticipant,
    volunteer,
    volunteerShifts,
  ]);

  const displayFavorites: MatchComplete[] = favorites
    .map((id) => allMatches?.find((m) => m.id === id))
    .filter((m): m is MatchComplete => !!m);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{edition?.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Activity className="h-3 w-3 mr-1" />
              En cours
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              •{" "}
              {currentTime.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Personal section */}
      {(displayFavorites.length > 0 ||
        isVolunteer ||
        meCompetition?.is_athlete) && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
            Pour moi
          </p>
          <MatchCarouselSection
            title={`Mes Matchs favoris (${displayFavorites.length})`}
            icon={<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
            matches={displayFavorites}
            sports={sports}
            currentTime={currentTime}
            onSelectMatch={setSelectedMatchId}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            sort
            emptyState={
              <div className="text-center py-4">
                <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Aucun favori — ajoutez des matchs depuis le programme
                </p>
              </div>
            }
          />
          {isVolunteer && (
            <VolunteerShiftsSection
              shifts={processedData.volunteerNextShifts}
              currentTime={currentTime}
              onSelectShift={setSelectedShiftId}
            />
          )}
        </div>
      )}

      {/* Public section */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
          En ce moment
        </p>
        <MatchCarouselSection
          title={`Matchs en Direct (${processedData.liveMatches.length})`}
          icon={<Activity className="h-4 w-4 text-red-500" />}
          matches={processedData.liveMatches}
          sports={sports}
          currentTime={currentTime}
          onSelectMatch={setSelectedMatchId}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          emptyState={
            <div className="text-center py-4">
              <Activity className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucun match en cours
              </p>
            </div>
          }
        />
        <MatchCarouselSection
          title={`Programme du Jour (${processedData.todayMatches.length})`}
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
          matches={processedData.todayMatches}
          sports={sports}
          currentTime={currentTime}
          onSelectMatch={setSelectedMatchId}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          emptyState={
            <div className="text-center py-4">
              <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucun match programmé aujourd&apos;hui
              </p>
            </div>
          }
        />
      </div>

      <StandingsSection
        globalPodium={globalPodium}
        sportSchools={sportSchools}
        onSelectSchool={setSelectedSchool}
      />

      {selectedShiftId && (
        <UserVolunteerShiftDetail
          shiftId={selectedShiftId}
          onClose={() => setSelectedShiftId(null)}
        />
      )}
      {selectedMatchId && (
        <MatchDetailDialog
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
      {selectedSchool && (
        <SchoolStandingsDialog
          schoolId={selectedSchool.id}
          schoolName={selectedSchool.name}
          totalPoints={selectedSchool.totalPoints}
          rank={selectedSchool.rank}
          onClose={() => setSelectedSchool(null)}
        />
      )}
    </div>
  );
};
