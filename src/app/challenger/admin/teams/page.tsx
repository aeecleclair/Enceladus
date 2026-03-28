"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import TeamCard from "@/src/components/admin/teams/TeamCard";
import { TeamsForm } from "@/src/components/admin/teams/TeamsForm";
import { WarningDialog } from "@/src/components/custom/WarningDialog";
import {
  Plus,
  Search,
  Trophy,
  Shield,
  Users,
  Filter,
  Table,
  Grid,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamFormSchema, TeamFormValues } from "@/src/forms/team";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { toast } from "@/src/components/ui/use-toast";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useAllTeams } from "@/src/hooks/useAllTeams";
import { useSportTeams } from "@/src/hooks/useSportTeams";
import { useSchoolTeams } from "@/src/hooks/useSchoolTeams";

const TeamsDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sports } = useSports();
  const { sportSchools, NoSchoolId } = useSportSchools();

  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const [editTeamId, setEditTeamId] = useState<string | null>(null);
  const [selectedSportId, setSelectedSportId] = useState<string>(
    searchParams.get("sport_id") || "all",
  );
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    searchParams.get("school_id") || "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompleteness, setFilterCompleteness] = useState<
    "all" | "complete" | "incomplete"
  >("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const teamSizeMap = useMemo(() => {
    return new Map(sports?.map((s) => [s.id, s.team_size]) ?? []);
  }, [sports]);

  const filteredSportSchools = useMemo(() => {
    return sportSchools?.filter((school) => school.school_id !== NoSchoolId);
  }, [sportSchools, NoSchoolId]);

  // Function to update URL with current selections
  const updateURL = useCallback(
    (sportId: string, schoolId: string) => {
      const params = new URLSearchParams();
      if (sportId) params.set("sport_id", sportId);
      if (schoolId) params.set("school_id", schoolId);

      const query = params.toString();
      const newUrl = query ? `/admin/teams?${query}` : "/admin/teams";
      router.replace(newUrl);
    },
    [router],
  );

  const handleSportChange = (sportId: string) => {
    setSelectedSportId(sportId);
    updateURL(sportId, selectedSchoolId);
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    updateURL(selectedSportId, schoolId);
  };

  const { allTeams, refetchAllTeams } = useAllTeams();

  // Fetch sport-specific teams when only sport is selected
  const { sportTeams } = useSportTeams({
    sportId:
      selectedSportId !== "all" && selectedSchoolId === "all"
        ? selectedSportId
        : undefined,
  });

  // Fetch school-specific teams when only school is selected
  const { schoolTeams } = useSchoolTeams({
    schoolId:
      selectedSchoolId !== "all" && selectedSportId === "all"
        ? selectedSchoolId
        : undefined,
  });

  const {
    // teams,
    refetchTeams,
    deleteSchoolSportTeam,
    createSchoolSportTeam,
    updateSchoolSportTeam,
    isLoading,
    isDeleteLoading,
    isCreateLoading,
    isUpdateLoading,
  } = useSchoolSportTeams({
    sportId: selectedSportId || undefined,
    schoolId: selectedSchoolId || undefined,
  });

  const filteredTeams = useMemo(() => {
    // Determine which teams source to use
    let teamsSource = allTeams;

    // If only sport is selected, use sportTeams
    if (selectedSportId !== "all" && selectedSchoolId === "all") {
      teamsSource = sportTeams || [];
    }
    // If only school is selected, use schoolTeams
    else if (selectedSchoolId !== "all" && selectedSportId === "all") {
      teamsSource = schoolTeams || [];
    }
    // If both are selected or neither, use allTeams with filters
    else if (allTeams) {
      teamsSource = allTeams
        .filter((team) =>
          selectedSchoolId !== "all"
            ? team.school_id === selectedSchoolId
            : true,
        )
        .filter((team) =>
          selectedSportId !== "all" ? team.sport_id === selectedSportId : true,
        );
    }

    if (!teamsSource) return [];

    // Apply search + completeness filters
    return teamsSource.filter((team) => {
      const matchesSearch = team.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const requiredSize = teamSizeMap.get(team.sport_id) ?? 0;
      const isComplete = (team.participants?.length ?? 0) >= requiredSize;
      const matchesCompleteness =
        filterCompleteness === "all" ||
        (filterCompleteness === "complete" && isComplete) ||
        (filterCompleteness === "incomplete" && !isComplete);

      return matchesSearch && matchesCompleteness;
    });
  }, [
    allTeams,
    sportTeams,
    schoolTeams,
    searchQuery,
    selectedSchoolId,
    selectedSportId,
    filterCompleteness,
    teamSizeMap,
  ]);

  // Form for creating/editing teams
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      sport_id: selectedSportId,
      school_id: selectedSchoolId,
      captain_id: "",
    },
  });

  // Update form when sport/school selection changes
  useEffect(() => {
    if (selectedSportId && selectedSchoolId && !editTeamId) {
      form.setValue("sport_id", selectedSportId);
      form.setValue("school_id", selectedSchoolId);
    }
  }, [selectedSportId, selectedSchoolId, form, editTeamId]);

  // Get team being edited
  const editingTeam = useMemo(() => {
    if (!editTeamId || !allTeams) return null;
    return allTeams.find((t) => t.id === editTeamId) || null;
  }, [editTeamId, allTeams]);

  // Populate form when editing
  useEffect(() => {
    if (editingTeam) {
      form.reset({
        name: editingTeam.name,
        sport_id: editingTeam.sport_id,
        school_id: editingTeam.school_id,
        captain_id: editingTeam.captain_id || "",
      });
    }
  }, [editingTeam, form]);

  const handleCreateTeam = async (values: TeamFormValues) => {
    try {
      const teamData = {
        name: values.name,
        sport_id: values.sport_id,
        school_id: values.school_id,
        captain_id: values.captain_id,
      };

      createSchoolSportTeam(teamData, () => {
        setShowCreateForm(false);
        form.reset();
      });
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleUpdateTeam = async (values: TeamFormValues) => {
    if (!editTeamId) return;

    try {
      const teamData = {
        name: values.name,
        captain_id: values.captain_id || null,
      };

      updateSchoolSportTeam(editTeamId, teamData, () => {
        setEditTeamId(null);
        form.reset();
      });
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const handleDeleteTeam = () => {
    if (!deleteTeamId) return;

    try {
      deleteSchoolSportTeam(deleteTeamId, () => {
        setDeleteTeamId(null);
      });
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleEdit = (teamId: string) => {
    setEditTeamId(teamId);
  };

  const handleCloseDialog = () => {
    setShowCreateForm(false);
    setEditTeamId(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Équipes</h1>
          <p className="text-muted-foreground">Gestion des équipes</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
          disabled={selectedSportId === "all" || selectedSchoolId === "all"}
        >
          <Plus className="h-4 w-4" />
          Nouvelle équipe
        </Button>
      </div>

      {/* Stats */}
      {(() => {
        const total = allTeams?.length ?? 0;
        const incomplete = allTeams?.filter(
          (t) =>
            (t.participants?.length ?? 0) <
            (teamSizeMap.get(t.sport_id) ?? 0),
        ).length ?? 0;
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Total</span>
              </div>
              <div className="text-2xl font-bold">{total}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Complètes</span>
              </div>
              <div className="text-2xl font-bold">{total - incomplete}</div>
            </div>
            <div
              className={`border rounded-lg p-4 ${incomplete > 0 ? "bg-amber-50 border-amber-300" : "bg-card"}`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`h-4 w-4 ${incomplete > 0 ? "text-amber-600" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${incomplete > 0 ? "text-amber-800" : "text-muted-foreground"}`}
                >
                  Incomplètes
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${incomplete > 0 ? "text-amber-800" : ""}`}
              >
                {incomplete}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Filters */}
      <div className="flex flex-col gap-4 bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une équipe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>

            <Select value={selectedSportId} onValueChange={handleSportChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionnez un sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les sports</SelectItem>
                {sports?.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionnez une école" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les écoles</SelectItem>
                {filteredSportSchools?.map((school) => (
                  <SelectItem key={school.school_id} value={school.school_id}>
                    {school.school.name
                      ? formatSchoolName(school.school.name)
                      : school.school_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Statut
                  {filterCompleteness !== "all" && (
                    <Badge variant="secondary" className="ml-1">
                      {filterCompleteness === "complete"
                        ? "Complètes"
                        : "Incomplètes"}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setFilterCompleteness("all")}
                >
                  Toutes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterCompleteness("complete")}
                >
                  Complètes uniquement
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterCompleteness("incomplete")}
                >
                  Incomplètes uniquement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => handleEdit(team.id)}
              onDelete={() => setDeleteTeamId(team.id)}
            />
          ))}
          {filteredTeams.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune équipe trouvée</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateForm || !!editTeamId}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editTeamId
                ? "Modifier l&apos;équipe"
                : "Créer une nouvelle équipe"}
            </DialogTitle>
          </DialogHeader>
          <TeamsForm
            form={form}
            onSubmit={editTeamId ? handleUpdateTeam : handleCreateTeam}
            isLoading={editTeamId ? isUpdateLoading : isCreateLoading}
            submitLabel={editTeamId ? "Mettre à jour" : "Créer"}
            isEditing={!!editTeamId}
            initialData={
              editingTeam
                ? {
                    name: editingTeam.name,
                    sport_id: editingTeam.sport_id,
                    school_id: editingTeam.school_id,
                    captain_id: editingTeam.captain_id || undefined,
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <WarningDialog
        isOpened={!!deleteTeamId}
        setIsOpened={(value: boolean) => {
          if (!value) setDeleteTeamId(null);
        }}
        isLoading={isDeleteLoading}
        title="Supprimer l'équipe"
        description="Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible."
        validateLabel="Supprimer"
        callback={handleDeleteTeam}
      />
    </div>
  );
};

export default TeamsDashboard;
