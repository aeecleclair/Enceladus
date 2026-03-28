"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  CalendarDays,
  Settings,
  Users,
  PlayCircle,
  StopCircle,
  Edit,
  Plus,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { CreateEditionDialog } from "./CreateEditionDialog";
import { EditEditionDialog } from "./EditEditionDialog";
import { ActivateEditionDialog } from "./ActivateEditionDialog";
import type * as Schemas from "@/src/api/hyperionSchemas";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useEditions } from "@/src/hooks/useEditions";

export const EditionManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] =
    useState<Schemas.CompetitionEdition | null>(null);

  const {
    editions,
    activeEdition,
    isLoading,
    error,
    getEditionStatus,
    refetchEditions,
  } = useEditions();

  const handleEditEdition = (edition: Schemas.CompetitionEdition) => {
    setSelectedEdition(edition);
    setEditDialogOpen(true);
  };

  const handleActivateEdition = (edition: Schemas.CompetitionEdition) => {
    setSelectedEdition(edition);
    setActivateDialogOpen(true);
  };

  const handleDialogClose = () => {
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setActivateDialogOpen(false);
    setSelectedEdition(null);
    refetchEditions();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP", { locale: fr });
  };

  if (isLoading) {
    return <EditionManagementSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-red-700">
          Erreur lors du chargement des éditions. Veuillez réessayer plus tard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeEdition && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800">Édition Active</CardTitle>
                <CardDescription className="text-green-600">
                  {activeEdition.name} ({activeEdition.year})
                </CardDescription>
              </div>
              <Badge variant="default" className="bg-green-600">
                <PlayCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-sm text-green-700">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Du {formatDate(activeEdition.start_date)} au{" "}
                {formatDate(activeEdition.end_date)}
              </div>
              {activeEdition.inscription_enabled && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  <Users className="w-3 h-3 mr-1" />
                  Inscriptions ouvertes
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Toutes les éditions</h3>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle édition
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {editions?.map((edition) => {
          const { status, variant } = getEditionStatus(edition);

          return (
            <Card
              key={edition.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{edition.name}</CardTitle>
                  <Badge variant={variant}>{status}</Badge>
                </div>
                <CardDescription>Année {edition.year}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <CalendarDays className="w-3 h-3" />
                    {formatDate(edition.start_date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 opacity-0" />
                    {formatDate(edition.end_date)}
                  </div>
                </div>

                {edition.inscription_enabled && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Inscriptions ouvertes
                  </Badge>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEdition(edition)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Modifier
                  </Button>
                  {!edition.active && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleActivateEdition(edition)}
                    >
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Activer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CreateEditionDialog
        open={createDialogOpen}
        onClose={handleDialogClose}
      />

      {selectedEdition && (
        <>
          <EditEditionDialog
            open={editDialogOpen}
            edition={selectedEdition}
            onClose={handleDialogClose}
          />

          <ActivateEditionDialog
            open={activateDialogOpen}
            edition={selectedEdition}
            activeEdition={activeEdition ?? null}
            onClose={handleDialogClose}
          />
        </>
      )}
    </div>
  );
};

const EditionManagementSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
