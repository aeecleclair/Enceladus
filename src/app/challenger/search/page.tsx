"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";

import { UpcomingMatches } from "../../components/home/matches/UpcomingMatches";
import { PastMatches } from "../../components/home/matches/PastMatches";
import { AppSidebar } from "@/src/components/home/appSideBar/AppSidebar";

import { useSports } from "../../hooks/useSports";
import { useSchools } from "../../hooks/useSchools";
import { useSchoolSportTeams } from "../../hooks/useSchoolSportTeams";
import { useSportMatches } from "../../hooks/useSportMatches";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useLocations } from "@/src/hooks/useLocations";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useAllTeams } from "@/src/hooks/useAllTeams";
import { useSportTeams } from "@/src/hooks/useSportTeams";
import { useSchoolTeams } from "@/src/hooks/useSchoolTeams";

interface FilterState {
  sport: string;
  school: string;
  sportCategory: string;
  team: string;
  location: string;
  search: string;
}

const FILTER_DEFAULTS: FilterState = {
  sport: "all",
  school: "all",
  sportCategory: "all",
  team: "all",
  location: "all",
  search: "",
};

const SPORT_CATEGORY_LABELS = {
  all: "Toutes les catégories",
  masculine: "Masculin",
  feminine: "Féminin",
  mixed: "Mixte",
} as const;

export default function SearchPage() {
  const { sports } = useSports();
  const { sportSchools: schools } = useSportSchools();
  const { locations } = useLocations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FilterState>(FILTER_DEFAULTS);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters: Partial<FilterState> = {};

    const sportParam = searchParams.get("sport");
    const schoolParam = searchParams.get("school");
    const sportCategoryParam = searchParams.get("sportCategory");
    const teamParam = searchParams.get("team");
    const locationParam = searchParams.get("location");
    const searchParam = searchParams.get("search");

    if (sportParam) urlFilters.sport = sportParam;
    if (schoolParam) urlFilters.school = schoolParam;
    if (sportCategoryParam) urlFilters.sportCategory = sportCategoryParam;
    if (teamParam) urlFilters.team = teamParam;
    if (locationParam) urlFilters.location = locationParam;
    if (searchParam) urlFilters.search = searchParam;

    // Only update if we have URL parameters
    if (Object.keys(urlFilters).length > 0) {
      setFilters((prev) => ({ ...prev, ...urlFilters }));
    }
  }, [searchParams]);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };

        // Update URL parameters
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([filterKey, filterValue]) => {
          if (filterValue !== "all" && filterValue !== "") {
            params.set(filterKey, filterValue);
          }
        });

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(newUrl, { scroll: false });

        return newFilters;
      });
    },
    [router, pathname],
  );

  const resetFilters = useCallback(() => {
    setFilters(FILTER_DEFAULTS);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const { allMatches } = useAllMatches();

  const { allTeams: teams } = useAllTeams();

  // Fetch sport-specific teams when only sport is selected
  const { sportTeams } = useSportTeams({
    sportId:
      filters.sport !== "all" && filters.school === "all"
        ? filters.sport
        : undefined,
  });

  // Fetch school-specific teams when only school is selected
  const { schoolTeams } = useSchoolTeams({
    schoolId:
      filters.school !== "all" && filters.sport === "all"
        ? filters.school
        : undefined,
  });

  // Determine which teams to use based on filters
  const availableTeams = useMemo(() => {
    // If both sport and school are selected, use filtered allTeams
    if (filters.sport !== "all" && filters.school !== "all") {
      return (
        teams
          ?.filter((team) => team.school_id === filters.school)
          ?.filter((team) => team.sport_id === filters.sport) ?? []
      );
    }

    // If only sport is selected, use sportTeams
    if (filters.sport !== "all" && filters.school === "all") {
      return sportTeams ?? [];
    }

    // If only school is selected, use schoolTeams
    if (filters.school !== "all" && filters.sport === "all") {
      return schoolTeams ?? [];
    }

    // Neither selected, return empty array
    return [];
  }, [filters.school, filters.sport, teams, sportTeams, schoolTeams]);

  useEffect(() => {
    if (filters.team !== "all" && availableTeams.length === 0) {
      updateFilter("team", "all");
    }
  }, [availableTeams.length, filters.team, updateFilter]);

  useEffect(() => {
    if (
      (filters.school !== "all" || filters.sport !== "all") &&
      filters.team === "all" &&
      availableTeams.length === 1
    ) {
      updateFilter("team", availableTeams[0].id);
    }
  }, [
    filters.school,
    filters.sport,
    filters.team,
    availableTeams,
    updateFilter,
  ]);

  const filteredMatches = useMemo(() => {
    if (!allMatches || !sports) return [];

    let result =
      allMatches
        ?.filter((match) =>
          filters.school !== "all"
            ? match.team1.school_id === filters.school ||
              match.team2.school_id === filters.school
            : true,
        )
        ?.filter((match) =>
          filters.sport !== "all" ? match.sport_id === filters.sport : true,
        )
        ?.filter((match) =>
          filters.location !== "all"
            ? match.location?.id === filters.location
            : true,
        ) ?? [];

    // Filter by team if selected
    if (filters.team !== "all") {
      result = result.filter(
        (match) =>
          match.team1_id === filters.team || match.team2_id === filters.team,
      );
    }

    // Filter by sport category
    if (filters.sportCategory !== "all") {
      const categoryValue =
        filters.sportCategory === "mixed" ? null : filters.sportCategory;
      const categorySportIds = sports
        .filter((sport) => sport.active)
        .filter((sport) => sport.sport_category === categoryValue)
        .map((sport) => sport.id);

      result = result.filter((match) =>
        categorySportIds.includes(match.sport_id),
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (match) =>
          match.name?.toLowerCase().includes(searchLower) ||
          match.team1?.name?.toLowerCase().includes(searchLower) ||
          match.team2?.name?.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [allMatches, filters, sports]);

  const currentDate = useMemo(() => new Date(), []);

  const ongoingMatches = useMemo(() => {
    return filteredMatches
      .filter(
        (match) =>
          match.date &&
          new Date(match.date) <= currentDate &&
          !match.ended,
      )
      .sort(
        (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime(),
      );
  }, [filteredMatches, currentDate]);

  const upcomingMatches = useMemo(() => {
    return filteredMatches
      .filter((match) => match.date && new Date(match.date) > currentDate)
      .sort(
        (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime(),
      );
  }, [filteredMatches, currentDate]);

  const pastMatches = useMemo(() => {
    return filteredMatches  
      .filter(
        (match) =>
          match.date &&
          new Date(match.date) <= currentDate &&
          match.ended,
      )
      .sort(
        (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime(),
      );
  }, [filteredMatches, currentDate]);

  const computedValues = useMemo(() => {
    const allFiltersDefault = Object.values(filters).every(
      (v) => v === "all" || v === "",
    );
    const hasActiveFilters = !allFiltersDefault;
    const teamSelected = filters.team !== "all";
    const showTeamFilter =
      availableTeams.length > 1 &&
      (filters.school !== "all" || filters.sport !== "all");

    return {
      allFiltersDefault,
      hasActiveFilters,
      teamSelected,
      showTeamFilter,
    };
  }, [filters, availableTeams.length]);

  const displayNames = useMemo(() => {
    const sportName =
      computedValues.teamSelected || filters.sport === "all"
        ? "Tous les sports"
        : sports?.find((s) => s.id === filters.sport)?.name ||
          "Tous les sports";

    const schoolName =
      computedValues.teamSelected || filters.school === "all"
        ? "Toutes les écoles"
        : schools?.find((s) => s.school_id === filters.school)?.school.name ||
          "Toutes les écoles";

    const teamName = (() => {
      if (filters.team === "all") return "Toutes les équipes";
      const team =
        teams?.find((t) => t.id === filters.team) ||
        availableTeams.find((t) => t.id === filters.team);
      return team?.name || "Équipe inconnue";
    })();

    const locationName = (() => {
      if (filters.location === "all") return "Tous les lieux";
      const location = locations?.find((l) => l.id === filters.location);
      return location?.name || "Lieu inconnu";
    })();

    return {
      sport: sportName,
      school: schoolName,
      sportCategory:
        SPORT_CATEGORY_LABELS[
          filters.sportCategory as keyof typeof SPORT_CATEGORY_LABELS
        ],
      team: teamName,
      location: locationName,
    };
  }, [
    filters,
    sports,
    schools,
    teams,
    availableTeams,
    locations,
    computedValues.teamSelected,
  ]);

  const badgeVisibility = useMemo(() => {
    if (computedValues.teamSelected) {
      return {
        sport: false,
        school: false,
        sportCategory: false,
        team: false,
      };
    }

    return {
      sport:
        computedValues.allFiltersDefault ||
        (filters.school !== "all" && filters.sport === "all"),
      school:
        computedValues.allFiltersDefault ||
        (filters.sport !== "all" && filters.school === "all"),
      sportCategory:
        computedValues.allFiltersDefault ||
        (computedValues.hasActiveFilters && filters.sportCategory === "all"),
      team: false,
      location:
        computedValues.allFiltersDefault ||
        (computedValues.hasActiveFilters && filters.location === "all"),
    };
  }, [filters, computedValues]);

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.sport !== "all")
      active.push({ key: "sport", label: `Sport: ${displayNames.sport}` });
    if (filters.school !== "all")
      active.push({ key: "school", label: `École: ${displayNames.school}` });
    if (filters.sportCategory !== "all")
      active.push({
        key: "sportCategory",
        label: `Catégorie: ${displayNames.sportCategory}`,
      });
    if (filters.team !== "all")
      active.push({ key: "team", label: displayNames.team });
    if (filters.location !== "all")
      active.push({ key: "location", label: `Lieu: ${displayNames.location}` });
    if (filters.search)
      active.push({ key: "search", label: `Recherche: "${filters.search}"` });
    return active;
  }, [filters, displayNames]);

  const hasActiveFilters = computedValues.hasActiveFilters;
  const showTeamFilter = computedValues.showTeamFilter;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="flex flex-col relative overflow-auto h-full m-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Rechercher les Matchs
                </h1>
                <p className="text-muted-foreground">
                  Recherchez tous les matchs par sport et école
                  {hasActiveFilters && " • Filtres appliqués"}
                </p>
              </div>
            </div>

            {/* Filters Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres de recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Search Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rechercher</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nom d'équipe ou de match..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Sport Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sport</label>
                    <Select
                      value={filters.sport}
                      onValueChange={(value) => updateFilter("sport", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les sports</SelectItem>
                        {sports
                          ?.filter((sport) => sport.active)
                          .map((sport) => (
                            <SelectItem key={sport.id} value={sport.id}>
                              {sport.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* School Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">École</label>
                    <Select
                      value={filters.school}
                      onValueChange={(value) => updateFilter("school", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une école" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les écoles</SelectItem>
                        {schools
                          ?.filter((school) => school.active)
                          .map((school) => (
                            <SelectItem
                              key={school.school_id}
                              value={school.school_id}
                            >
                              {formatSchoolName(school.school.name)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sport Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Catégorie</label>
                    <Select
                      value={filters.sportCategory}
                      onValueChange={(value) =>
                        updateFilter("sportCategory", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Toutes les catégories
                        </SelectItem>
                        <SelectItem value="masculine">Masculin</SelectItem>
                        <SelectItem value="feminine">Féminin</SelectItem>
                        <SelectItem value="mixed">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lieu</label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => updateFilter("location", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un lieu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les lieux</SelectItem>
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Team Filter - Conditional */}
                  {showTeamFilter && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Équipe</label>
                      <Select
                        value={filters.team}
                        onValueChange={(value) => updateFilter("team", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une équipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            Toutes les équipes
                          </SelectItem>
                          {availableTeams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">
                      Filtres actifs:
                    </span>
                    {activeFilters.map(({ key, label }) => (
                      <Badge key={key} variant="secondary" className="gap-1">
                        {label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateFilter(
                              key as keyof FilterState,
                              key === "search" ? "" : "all",
                            )
                          }
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ongoing Matches */}
            {ongoingMatches.length > 0 && (
              <div>
                <UpcomingMatches
                  matches={ongoingMatches}
                  userTeamId={undefined}
                  showSportBadge={badgeVisibility.sport}
                  showSchoolBadges={badgeVisibility.school}
                  showSportCategoryBadges={badgeVisibility.sportCategory}
                  showTeamBadges={badgeVisibility.team}
                  sports={sports}
                  schools={schools}
                  teams={teams}
                  title="En cours"
                />
              </div>
            )}

            {/* Upcoming Matches */}
            <div>
              <UpcomingMatches
                matches={upcomingMatches}
                userTeamId={undefined}
                showSportBadge={badgeVisibility.sport}
                showSchoolBadges={badgeVisibility.school}
                showSportCategoryBadges={badgeVisibility.sportCategory}
                showTeamBadges={badgeVisibility.team}
                sports={sports}
                schools={schools}
                teams={teams}
              />
            </div>

            {/* Past Matches - shown when a team is selected OR when school+sport has only one team */}
            {pastMatches.length > 0 && (
              <div>
                <PastMatches
                  matches={pastMatches}
                  userTeamId={undefined}
                  showSportBadge={badgeVisibility.sport}
                  showSchoolBadges={badgeVisibility.school}
                  showSportCategoryBadges={badgeVisibility.sportCategory}
                  showTeamBadges={badgeVisibility.team}
                  sports={sports}
                  schools={schools}
                  teams={teams}
                />
              </div>
            )}

            {/* No Results */}
            {filteredMatches.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Essayez de modifier vos critères de recherche pour trouver
                    des matchs.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
