"use client";

import SchoolCard from "@/src/components/admin/schools/SchoolCard";
import { DeleteConfirmationDialog } from "@/src/components/admin/schools/DeleteConfirmationDialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SchoolDetail from "@/src/components/admin/schools/SchoolDetail";
import { useState, useMemo } from "react";
import { Search, Plus, School, Users, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const Dashboard = () => {
  const router = useRouter();
  const { sportSchools, deleteCompetitionSchool, isDeleteLoading } =
    useSportSchools();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterLocation, setFilterLocation] = useState<
    "all" | "lyon" | "external"
  >("all");
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  const school = sportSchools?.find((s) => s.school_id === schoolId);

  const filteredSchools = useMemo(() => {
    if (!sportSchools) return [];

    return sportSchools.filter((school) => {
      const matchesSearch = school.school.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && school.active) ||
        (filterStatus === "inactive" && !school.active);

      const matchesLocation =
        filterLocation === "all" ||
        (filterLocation === "lyon" && school.from_lyon) ||
        (filterLocation === "external" && !school.from_lyon);

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [sportSchools, searchQuery, filterStatus, filterLocation]);

  const stats = useMemo(() => {
    if (!sportSchools) return { total: 0, active: 0, lyon: 0, external: 0 };

    return {
      total: sportSchools.length,
      active: sportSchools.filter((s) => s.active).length,
      lyon: sportSchools.filter((s) => s.from_lyon).length,
      external: sportSchools.filter((s) => !s.from_lyon).length,
    };
  }, [sportSchools]);

  const handleDeleteSchool = () => {
    if (schoolToDelete) {
      deleteCompetitionSchool(schoolToDelete, () => {
        setSchoolToDelete(null);
        setIsDeleteDialogOpen(false);
      });
    }
  };

  return (
    <div className="flex w-full flex-col">
      {school ? (
        <SchoolDetail
          school={school}
          onEdit={() => {
            router.push(`/admin/schools/edit?school_id=${school.school_id}`);
          }}
          onDelete={() => {
            setSchoolToDelete(school.school_id);
            setIsDeleteDialogOpen(true);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Header with title and action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Écoles</h1>
              <p className="text-muted-foreground">
                Gérez les écoles participantes à la compétition
              </p>
            </div>
            <Link href="/admin/schools/create">
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une école
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 " />
                <span className="text-sm font-medium text-muted-foreground">
                  Actives
                </span>
              </div>
              <div className="text-2xl font-bold ">{stats.active}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-400" />
                <span className="text-sm font-medium text-muted-foreground">
                  Lyonnaises
                </span>
              </div>
              <div className="text-2xl font-bold ">{stats.lyon}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-300" />
                <span className="text-sm font-medium text-muted-foreground">
                  Externes
                </span>
              </div>
              <div className="text-2xl font-bold ">{stats.external}</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une école..."
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
                    {filterStatus !== "all" && (
                      <Badge variant="secondary" className="ml-1">
                        {filterStatus === "active" ? "Actives" : "Inactives"}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    Toutes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Actives uniquement
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                    Inactives uniquement
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Origine
                    {filterLocation !== "all" && (
                      <Badge variant="secondary" className="ml-1">
                        {filterLocation === "lyon" ? "Lyon" : "Externes"}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterLocation("all")}>
                    Toutes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterLocation("lyon")}>
                    Lyonnaises uniquement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterLocation("external")}
                  >
                    Externes uniquement
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results info */}
          {searchQuery || filterStatus !== "all" || filterLocation !== "all" ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {filteredSchools.length} école(s) trouvée(s)
                {searchQuery && ` pour "${searchQuery}"`}
              </span>
              {(filterStatus !== "all" || filterLocation !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                    setFilterLocation("all");
                  }}
                  className="h-auto p-1 text-xs"
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : null}

          {/* Schools Grid */}
          {filteredSchools && filteredSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSchools
                .sort((a, b) => a.school.name.localeCompare(b.school.name))
                .map((school) => (
                  <SchoolCard
                    key={school.school_id}
                    school={school}
                    onClick={() => {
                      router.push(
                        `/admin/schools?school_id=${school.school_id}`,
                      );
                    }}
                    onEdit={() => {
                      router.push(
                        `/admin/schools/edit?school_id=${school.school_id}`,
                      );
                    }}
                    onDelete={() => {
                      setSchoolToDelete(school.school_id);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <School className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ||
                filterStatus !== "all" ||
                filterLocation !== "all"
                  ? "Aucune école trouvée"
                  : "Aucune école enregistrée"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ||
                filterStatus !== "all" ||
                filterLocation !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par ajouter votre première école"}
              </p>
              {!searchQuery &&
                filterStatus === "all" &&
                filterLocation === "all" && (
                  <Link href="/admin/schools/create">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter une école
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
        title="Supprimer l'école"
        description={`Êtes-vous sûr de vouloir supprimer cette école ? Cette action est irréversible et supprimera également tous les quotas associés.`}
        onConfirm={handleDeleteSchool}
        onCancel={() => {
          setSchoolToDelete(null);
          setIsDeleteDialogOpen(false);
        }}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default Dashboard;
