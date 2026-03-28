import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  CompetitionEdition,
  Sport,
  Location,
  SchoolExtension,
  TeamComplete,
  VolunteerShiftCompleteWithVolunteers,
} from "@/src/api/hyperionSchemas";
import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
import React from "react";

interface ConfigurationStatusCardProps {
  edition: CompetitionEdition;
  podiumStats: { totalRankings: number; schoolsWithRankings: number } | null;
  sports?: Sport[];
  schools?: SchoolExtension[];
  locations?: Location[];
  products?: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
  matchCountBySport?: Map<string, number>;
  allTeams?: TeamComplete[];
  volunteerShifts?: VolunteerShiftCompleteWithVolunteers[];
  onOpenInscription: (editionId: string) => void;
  onCloseInscription: (editionId: string) => void;
  isOpenInscriptionLoading?: boolean;
  isCloseInscriptionLoading?: boolean;
}

export const ConfigurationStatusCard = ({
  edition,
  podiumStats,
  sports = [],
  schools = [],
  locations = [],
  products = [],
  matchCountBySport,
  allTeams = [],
  volunteerShifts = [],
  onOpenInscription,
  onCloseInscription,
  isOpenInscriptionLoading,
  isCloseInscriptionLoading,
}: ConfigurationStatusCardProps) => {
  const NoSchoolId = "dce19aa2-8863-4c93-861e-fb7be8f610ed";
  const realSchools = schools.filter(
    (school) => school.school_id !== NoSchoolId,
  );

  const activeSports = sports.filter((sport) => sport.active !== false);
  const sportsWithoutMatches = matchCountBySport
    ? activeSports.filter((sport) => !matchCountBySport.get(sport.id))
    : [];

  const sportIdsWithTeams = new Set(allTeams.map((t) => t.sport_id));
  const sportsWithoutTeams = activeSports.filter(
    (sport) => !sportIdsWithTeams.has(sport.id),
  );

  const sportTeamSizeMap = new Map(
    sports.map((s) => [s.id, s.team_size]),
  );
  const incompleteTeams = allTeams.filter(
    (team) =>
      (team.participants?.length ?? 0) <
      (sportTeamSizeMap.get(team.sport_id) ?? 0),
  );

  const unfilledShifts = volunteerShifts.filter(
    (shift) =>
      (shift.registrations?.length ?? 0) < shift.max_volunteers,
  );

  const enabledProducts = products.filter(
    (product) =>
      product.variants &&
      product.variants.length > 0 &&
      product.variants.some((variant) => variant.enabled !== false),
  );

  const getStatusBadge = (
    condition: boolean,
    trueText: string,
    falseText: string,
  ) => (
    <Badge variant={condition ? "default" : "secondary"}>
      {condition ? trueText : falseText}
    </Badge>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>État de Configuration</CardTitle>
        <CardDescription>
          Résumé de la configuration de la compétition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm">
                    Sports ({activeSports.length}/{sports.length})
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {activeSports.length} sports actifs sur {sports.length} au
                    total
                  </p>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {sportsWithoutTeams.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300"
                      >
                        {sportsWithoutTeams.length} sans équipes
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {sportsWithoutTeams
                          .map((s) => s.name)
                          .join(", ")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {sportsWithoutMatches.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300"
                      >
                        {sportsWithoutMatches.length} sans matchs
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {sportsWithoutMatches
                          .map((s) => s.name)
                          .join(", ")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {getStatusBadge(
                  sports.length > 0,
                  sports.length === activeSports.length
                    ? "Tous actifs"
                    : "Partiellement configurés",
                  "Aucun sport",
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Écoles</span>
              <Badge variant={realSchools.length > 0 ? "default" : "secondary"}>
                {realSchools.length > 0
                  ? `${realSchools.length} configurées`
                  : "Aucune école"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">
                Équipes ({allTeams.length})
              </span>
              <div className="flex items-center gap-1.5">
                {incompleteTeams.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300"
                      >
                        {incompleteTeams.length} incomplètes
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {incompleteTeams
                          .slice(0, 10)
                          .map((t) => t.name)
                          .join(", ")}
                        {incompleteTeams.length > 10 &&
                          ` et ${incompleteTeams.length - 10} autres`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Badge
                  variant={allTeams.length > 0 ? "default" : "secondary"}
                >
                  {allTeams.length > 0
                    ? incompleteTeams.length === 0
                      ? "Toutes complètes"
                      : "Partiellement complètes"
                    : "Aucune équipe"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">
                Bénévolat ({volunteerShifts.length})
              </span>
              <div className="flex items-center gap-1.5">
                {unfilledShifts.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300"
                      >
                        {unfilledShifts.length} créneaux incomplets
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {unfilledShifts
                          .slice(0, 10)
                          .map((s) => s.name)
                          .join(", ")}
                        {unfilledShifts.length > 10 &&
                          ` et ${unfilledShifts.length - 10} autres`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Badge
                  variant={
                    volunteerShifts.length > 0 ? "default" : "secondary"
                  }
                >
                  {volunteerShifts.length > 0
                    ? unfilledShifts.length === 0
                      ? "Tous complets"
                      : "Partiellement complets"
                    : "Aucun créneau"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Lieux</span>
              <Badge variant={locations.length > 0 ? "default" : "secondary"}>
                {locations.length > 0
                  ? `${locations.length} configurés`
                  : "Aucun lieu"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm">
                    Produits ({enabledProducts.length}/{products.length})
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {enabledProducts.length} produits actifs sur{" "}
                    {products.length} au total
                  </p>
                </TooltipContent>
              </Tooltip>
              {getStatusBadge(
                products.length > 0,
                enabledProducts.length === products.length
                  ? "Tous actifs"
                  : "Partiellement actifs",
                "Aucun produit",
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Podium</span>
              <Badge variant={podiumStats ? "default" : "secondary"}>
                {podiumStats
                  ? `${podiumStats.totalRankings} classements`
                  : "Non configuré"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Inscriptions</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="default"
                  className={
                    edition.inscription_enabled
                      ? "bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                      : "bg-green-500 text-white hover:bg-green-700 cursor-pointer"
                  }
                >
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      !isCloseInscriptionLoading &&
                      !isOpenInscriptionLoading &&
                      edition.inscription_enabled
                        ? onCloseInscription(edition.id)
                        : onOpenInscription(edition.id)
                    }
                  >
                    {isOpenInscriptionLoading
                      ? "Ouverture..."
                      : isCloseInscriptionLoading
                        ? "Fermeture..."
                        : edition.inscription_enabled
                          ? "Fermer les inscriptions"
                          : "Ouvrir les inscriptions"}
                  </span>
                </Badge>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
