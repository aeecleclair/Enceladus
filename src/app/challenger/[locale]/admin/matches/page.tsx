"use client";

import MatchCard from "@/components/challenger/admin/matches/MatchCard";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useCompetitionUsers } from "@/hooks/challenger/useCompetitionUsers";
import { useSportMatches } from "@/hooks/challenger/useSportMatches";
import { useSports } from "@/hooks/challenger/useSports";
import { useRouter } from "@/i18n/navigation";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  Search,
  Trophy,
} from "lucide-react";

const MatchesDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sports } = useSports();
  const { competitionUsers } = useCompetitionUsers();

  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const [selectedSportId, setSelectedSportId] = useState<string>(
    searchParams.get("sport_id") || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "scheduled" | "finished" | "ongoing"
  >("all");

  // Function to update URL with current sport selection
  const updateURL = useCallback(
    (sportId: string) => {
      const params = new URLSearchParams();
      if (sportId) params.set("sport_id", sportId);

      const query = params.toString();
      const newUrl = query ? `/admin/matches?${query}` : "/admin/matches";
      router.replace(newUrl);
    },
    [router],
  );

  // Enhanced sport change handler that updates URL
  const handleSportChange = useCallback(
    (sportId: string) => {
      setSelectedSportId(sportId);
      updateURL(sportId);
    },
    [updateURL],
  );

  const { sportMatches, refetchSportMatches, deleteMatch, isDeleteLoading } =
    useSportMatches({
      sportId: selectedSportId || undefined,
    });

  if (sports && sports.length > 0 && !selectedSportId) {
    setSelectedSportId(sports[0].id);
  }

  useEffect(() => {
    if (selectedSportId) {
      updateURL(selectedSportId);
    }
  }, [selectedSportId, updateURL]);

  const filteredMatches = useMemo(() => {
    if (!sportMatches) return [];

    const filteringResult = sportMatches.filter((match) => {
      const matchesSearch = match.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "scheduled" &&
          !match.score_team1 &&
          !match.score_team2) ||
        (filterStatus === "finished" &&
          (match.score_team1 !== null || match.score_team2 !== null)) ||
        (filterStatus === "ongoing" &&
          match.date &&
          new Date(match.date) <= new Date() &&
          !match.score_team1 &&
          !match.score_team2);

      return matchesSearch && matchesStatus;
    });
    return filteringResult.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });
  }, [sportMatches, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    if (!sportMatches)
      return { total: 0, scheduled: 0, finished: 0, ongoing: 0 };

    return {
      total: sportMatches.length,
      scheduled: sportMatches.filter((m) => !m.score_team1 && !m.score_team2)
        .length,
      finished: sportMatches.filter(
        (m) => m.score_team1 !== null || m.score_team2 !== null,
      ).length,
      ongoing: sportMatches.filter(
        (m) =>
          m.date &&
          new Date(m.date) <= new Date() &&
          !m.score_team1 &&
          !m.score_team2,
      ).length,
    };
  }, [sportMatches]);

  const handleDelete = (id: string) => {
    setDeleteMatchId(id);
  };

  const confirmDelete = () => {
    if (deleteMatchId) {
      deleteMatch(deleteMatchId, () => {
        setDeleteMatchId(null);
      });
    }
  };

  // Refetch matches when selected sport changes
  useEffect(() => {
    if (selectedSportId) {
      refetchSportMatches();
    }
  }, [selectedSportId, refetchSportMatches]);

  return (
    <div className="flex w-full flex-col">
      <div className="space-y-6">
        {/* Header with title and action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Matchs</h1>
            <p className="text-muted-foreground">
              Gérez les matchs de la compétition
            </p>
          </div>
          <Link
            href={
              selectedSportId
                ? `/admin/matches/create?sport_id=${selectedSportId}`
                : "/admin/matches/create"
            }
          >
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un match
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Total
              </span>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Programmés
              </span>
            </div>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">
                Terminés
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.finished}
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">
                En cours
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.ongoing}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un match..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedSportId} onValueChange={handleSportChange}>
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Sélectionnez un sport" />
              </SelectTrigger>
              <SelectContent>
                {sports
                  ?.filter((sport) => sport.active)
                  ?.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Statut
                  {filterStatus !== "all" && (
                    <Badge variant="secondary" className="ml-1">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  Tous les matchs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>
                  Programmés
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("finished")}>
                  Terminés
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("ongoing")}>
                  En cours
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4">
          {!selectedSportId ? (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-gray-500">
                Sélectionnez un sport pour voir les matchs
              </p>
            </div>
          ) : filteredMatches && filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onEdit={() => {
                    router.push(`/admin/matches/edit?match_id=${match.id}`);
                  }}
                  onDelete={() => handleDelete(match.id)}
                  competitionUsers={competitionUsers}
                />
              ))}
            </div>
          ) : sportMatches && sportMatches.length > 0 ? (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-gray-500">
                Aucun match trouvé avec les filtres appliqués
              </p>
            </div>
          ) : sportMatches && sportMatches.length === 0 ? (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-gray-500">Aucun match trouvé pour ce sport</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-50 w-full" />
                ))}
            </div>
          )}
        </div>
      </div>

      <WarningDialog
        isOpened={!!deleteMatchId}
        callback={confirmDelete}
        title="Supprimer le match"
        description="Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible."
        validateLabel="Supprimer"
        setIsOpened={() => setDeleteMatchId(null)}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default MatchesDashboard;
