"use client";

import SportCard from "@/src/components/admin/sports/SportCard";
import { DeleteConfirmationDialog } from "@/src/components/admin/sports/DeleteConfirmationDialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { useSports } from "@/src/hooks/useSports";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useAllTeams } from "@/src/hooks/useAllTeams";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SportDetail from "@/src/components/admin/sports/SportDetail";
import { useState, useMemo } from "react";
import { Search, Plus, Trophy, Users, Filter, Target, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const Dashboard = () => {
  const router = useRouter();
  const { sports, deleteSport, isDeleteLoading } = useSports();
  const { allMatches } = useAllMatches();
  const { allTeams } = useAllTeams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "masculine" | "feminine" | "mixte"
  >("all");
  const [filterMatches, setFilterMatches] = useState<
    "all" | "with_matches" | "without_matches"
  >("all");
  const [filterTeams, setFilterTeams] = useState<
    "all" | "with_teams" | "without_teams"
  >("all");

  const matchCountBySport = useMemo(() => {
    const map = new Map<string, number>();
    if (!allMatches) return map;
    for (const match of allMatches) {
      map.set(match.sport_id, (map.get(match.sport_id) || 0) + 1);
    }
    return map;
  }, [allMatches]);

  const teamCountBySport = useMemo(() => {
    const map = new Map<string, number>();
    if (!allTeams) return map;
    for (const team of allTeams) {
      map.set(team.sport_id, (map.get(team.sport_id) || 0) + 1);
    }
    return map;
  }, [allTeams]);
  const [sportToDelete, setSportToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParam = useSearchParams();
  const sportId = searchParam.get("sport_id");
  const sport = sports?.find((s) => s.id === sportId);

  const filteredSports = useMemo(() => {
    if (!sports) return [];

    return sports.filter((sport) => {
      const matchesSearch = sport.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && sport.active) ||
        (filterStatus === "inactive" && !sport.active);
      const matchesCategory =
        filterCategory === "all" ||
        (filterCategory === "masculine" &&
          sport.sport_category === "masculine") ||
        (filterCategory === "feminine" &&
          sport.sport_category === "feminine") ||
        (filterCategory === "mixte" && sport.sport_category === null);
      const sportMatchCount = matchCountBySport.get(sport.id) || 0;
      const matchesMatchFilter =
        filterMatches === "all" ||
        (filterMatches === "with_matches" && sportMatchCount > 0) ||
        (filterMatches === "without_matches" && sportMatchCount === 0);
      const sportTeamCount = teamCountBySport.get(sport.id) || 0;
      const matchesTeamFilter =
        filterTeams === "all" ||
        (filterTeams === "with_teams" && sportTeamCount > 0) ||
        (filterTeams === "without_teams" && sportTeamCount === 0);

      return matchesSearch && matchesStatus && matchesCategory && matchesMatchFilter && matchesTeamFilter;
    });
  }, [sports, searchQuery, filterStatus, filterCategory, filterMatches, matchCountBySport, filterTeams, teamCountBySport]);

  const stats = useMemo(() => {
    if (!sports) return { total: 0, active: 0, masculine: 0, feminine: 0, withoutMatches: 0, withoutTeams: 0 };

    return {
      total: sports.length,
      active: sports.filter((s) => s.active).length,
      masculine: sports.filter((s) => s.sport_category === "masculine").length,
      feminine: sports.filter((s) => s.sport_category === "feminine").length,
      withoutMatches: sports.filter((s) => !matchCountBySport.get(s.id)).length,
      withoutTeams: sports.filter((s) => !teamCountBySport.get(s.id)).length,
    };
  }, [sports, matchCountBySport, teamCountBySport]);

  const handleDeleteSport = () => {
    if (sportToDelete) {
      deleteSport(sportToDelete, () => {
        setSportToDelete(null);
        setIsDeleteDialogOpen(false);
      });
    }
  };

  return (
    <div className="flex w-full flex-col">
      {sport ? (
        <SportDetail
          sport={sport}
          onEdit={() => {
            router.push(`/admin/sports/edit?sport_id=${sport.id}`);
          }}
          onDelete={() => {
            setSportToDelete(sport.id);
            setIsDeleteDialogOpen(true);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Header with title and action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sports</h1>
              <p className="text-muted-foreground">
                Gérez les sports disponibles pour la compétition
              </p>
            </div>
            <Link href="/admin/sports/create">
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un sport
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
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
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium text-muted-foreground">
                  Actifs
                </span>
              </div>
              <div className="text-2xl font-bold">{stats.active}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-400" />
                <span className="text-sm font-medium text-muted-foreground">
                  Masculins
                </span>
              </div>
              <div className="text-2xl font-bold">{stats.masculine}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-300" />
                <span className="text-sm font-medium text-muted-foreground">
                  Féminins
                </span>
              </div>
              <div className="text-2xl font-bold">{stats.feminine}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-200" />
                <span className="text-sm font-medium text-muted-foreground">
                  Mixtes
                </span>
              </div>
              <div className="text-2xl font-bold">
                {stats.total - stats.masculine - stats.feminine}
              </div>
            </div>
            <div
              className={`border rounded-lg p-4 ${stats.withoutMatches > 0 ? "bg-amber-50 border-amber-300" : "bg-card"}`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`h-4 w-4 ${stats.withoutMatches > 0 ? "text-amber-600" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${stats.withoutMatches > 0 ? "text-amber-800" : "text-muted-foreground"}`}
                >
                  Sans matchs
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${stats.withoutMatches > 0 ? "text-amber-800" : ""}`}
              >
                {stats.withoutMatches}
              </div>
            </div>
            <div
              className={`border rounded-lg p-4 ${stats.withoutTeams > 0 ? "bg-amber-50 border-amber-300" : "bg-card"}`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`h-4 w-4 ${stats.withoutTeams > 0 ? "text-amber-600" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${stats.withoutTeams > 0 ? "text-amber-800" : "text-muted-foreground"}`}
                >
                  Sans équipes
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${stats.withoutTeams > 0 ? "text-amber-800" : ""}`}
              >
                {stats.withoutTeams}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un sport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Statut
                    {(filterStatus !== "all" ||
                      filterMatches !== "all" ||
                      filterTeams !== "all") && (
                      <Badge variant="secondary" className="ml-1">
                        {[
                          filterStatus === "active"
                            ? "Actifs"
                            : filterStatus === "inactive"
                              ? "Inactifs"
                              : null,
                          filterMatches === "without_matches"
                            ? "Sans matchs"
                            : filterMatches === "with_matches"
                              ? "Avec matchs"
                              : null,
                          filterTeams === "without_teams"
                            ? "Sans équipes"
                            : filterTeams === "with_teams"
                              ? "Avec équipes"
                              : null,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Activation</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    Tous
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Actifs uniquement
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                    Inactifs uniquement
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Matchs</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterMatches("all")}>
                    Tous
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterMatches("with_matches")}
                  >
                    Avec matchs
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterMatches("without_matches")}
                  >
                    Sans matchs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Équipes</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterTeams("all")}>
                    Toutes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterTeams("with_teams")}
                  >
                    Avec équipes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterTeams("without_teams")}
                  >
                    Sans équipes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Catégorie
                    {filterCategory !== "all" && (
                      <Badge variant="secondary" className="ml-1">
                        {filterCategory === "masculine"
                          ? "Masculins"
                          : filterCategory === "feminine"
                            ? "Féminins"
                            : filterCategory === "mixte"
                              ? "Mixtes"
                              : filterCategory}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                    Toutes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterCategory("masculine")}
                  >
                    Masculins uniquement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterCategory("feminine")}
                  >
                    Féminins uniquement
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory("mixte")}>
                    Mixtes uniquement
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results info */}
          {searchQuery || filterStatus !== "all" || filterCategory !== "all" || filterMatches !== "all" || filterTeams !== "all" ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {filteredSports.length} sport(s) trouvé(s)
                {searchQuery && ` pour "${searchQuery}"`}
                {filterMatches === "without_matches" && " sans matchs"}
                {filterMatches === "with_matches" && " avec matchs"}
                {filterTeams === "without_teams" && " sans équipes"}
                {filterTeams === "with_teams" && " avec équipes"}
              </span>
              {(filterStatus !== "all" || filterCategory !== "all" || filterMatches !== "all" || filterTeams !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                    setFilterCategory("all");
                    setFilterMatches("all");
                    setFilterTeams("all");
                  }}
                  className="h-auto p-1 text-xs"
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : null}

          {/* Sports Grid */}
          {filteredSports && filteredSports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSports
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((sport) => (
                  <SportCard
                    key={sport.id}
                    sport={sport}
                    matchCount={matchCountBySport.get(sport.id) ?? 0}
                    teamCount={teamCountBySport.get(sport.id) ?? 0}
                    onClick={() => {
                      router.push(`/admin/sports?sport_id=${sport.id}`);
                    }}
                    onEdit={() => {
                      router.push(`/admin/sports/edit?sport_id=${sport.id}`);
                    }}
                    onDelete={() => {
                      setSportToDelete(sport.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ||
                filterStatus !== "all" ||
                filterCategory !== "all"
                  ? "Aucun sport trouvé"
                  : "Aucun sport enregistré"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ||
                filterStatus !== "all" ||
                filterCategory !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par ajouter votre premier sport"}
              </p>
              {!searchQuery &&
                filterStatus === "all" &&
                filterCategory === "all" && (
                  <Link href="/admin/sports/create">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter un sport
                    </Button>
                  </Link>
                )}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le sport"
        description={`Êtes-vous sûr de vouloir supprimer ce sport ? Cette action est irréversible et supprimera également tous les quotas associés.`}
        onConfirm={handleDeleteSport}
        onCancel={() => {
          setSportToDelete(null);
          setIsDeleteDialogOpen(false);
        }}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default Dashboard;
