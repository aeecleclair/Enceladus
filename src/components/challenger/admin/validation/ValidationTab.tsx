import {
  SchoolExtension,
  SchoolGeneralQuota,
  SchoolProductQuota,
} from "@/src/api/hyperionSchemas";
import { ParticipantData, ParticipantDataTable } from "./ParticipantDataTable";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Button } from "../../ui/button";
import {
  GetCompetitionProductsResponse,
  GetCompetitionSchoolsSchoolIdProductQuotasResponse,
  GetCompetitionSportsSportIdQuotasResponse,
} from "@/src/api/hyperionComponents";
import { GlobalQuotaCard } from "./GlobalQuotaCard";

export interface ValidationTabProps {
  school: SchoolExtension | undefined;
  schoolsGeneralQuota: SchoolGeneralQuota | undefined;
  schoolsProductQuota:
    | GetCompetitionSchoolsSchoolIdProductQuotasResponse
    | undefined;
  schoolsProductQuotaUsed: Record<string, number>;
  sportsQuota: GetCompetitionSportsSportIdQuotasResponse;
  validatedCounts: Record<string, number>;
  participantTableData: ParticipantData[];
  products: GetCompetitionProductsResponse | undefined;
  totalParticipants: number;
  totalTeams: number;
  totalValidated: number;
  isValidateLoading: boolean;
  isInvalidateLoading: boolean;
  isDeleteLoading: boolean;
  onValidate: (userId: string) => void;
  onInvalidate: (userId: string) => void;
  onDelete: (userId: string, sportId: string, isAthlete: boolean) => void;
  onCancel?: (userId: string) => void;
}

export function ValidationTab({
  school,
  schoolsGeneralQuota,
  schoolsProductQuota,
  schoolsProductQuotaUsed,
  sportsQuota,
  validatedCounts,
  participantTableData,
  totalParticipants,
  totalTeams,
  totalValidated,
  products,
  isValidateLoading,
  isInvalidateLoading,
  isDeleteLoading,
  onInvalidate,
  onValidate,
  onDelete,
  onCancel,
}: ValidationTabProps) {
  const hasExceeded = schoolsProductQuota
    ?.map((value) => schoolsProductQuotaUsed[value.product_id] > value.quota)
    .some((b) => b);

  return (
    <>
      {school && (
        <>
          <div className="mb-6 flex items-center gap-4">
            <div className="text-lg font-semibold mb-1">
              Quotas de{" "}
              {school ? formatSchoolName(school.school.name) : "l'école"}
            </div>

            {schoolsGeneralQuota && (
              <Tooltip>
                <TooltipTrigger asChild>
                  {(() => {
                    const hasExceeded = Object.entries(schoolsGeneralQuota)
                      .filter(([key]) => !key.toLowerCase().includes("id"))
                      .some(([key, value]) => {
                        if (value === undefined) return false;
                        const used = validatedCounts[key] ?? 0;
                        const quota = (value as number) ?? 0;
                        return used > quota;
                      });
                    return (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 text-xs border-primary hover:bg-primary/10${hasExceeded ? " text-red-600" : " text-primary"}`}
                      >
                        Quota général
                      </Button>
                    );
                  })()}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-base flex items-center mb-2 text-primary font-semibold">
                    Détail des quotas généraux
                  </div>
                  <div className="space-y-2">
                    {Object.entries(schoolsGeneralQuota)
                      .filter(([key]) => !key.toLowerCase().includes("id"))
                      .map(([key, value]) => {
                        let formattedName = key
                          .replace(/_/g, " ")
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .replace(/\b\w/g, (c) => c.toUpperCase());
                        const words = formattedName.split(" ");
                        if (
                          words.length > 1 &&
                          words[words.length - 1].toLowerCase() === "quota"
                        ) {
                          formattedName = words.slice(0, -1).join(" ");
                        }
                        const used = validatedCounts[key] ?? 0;
                        const quota = (value as number) ?? 0;
                        const exceeded =
                          value === undefined ? false : used > quota;
                        return (
                          <div
                            key={key}
                            className="flex justify-between items-center gap-2 py-1 px-2"
                          >
                            <span
                              className={`font-medium text-xs text-muted-foreground${exceeded ? " text-red-600" : ""}`}
                            >
                              {formattedName}
                            </span>
                            <span
                              className={`text-xs font-bold${exceeded ? " text-red-600" : " text-primary"}`}
                            >
                              Utilisé: {used} / {quota}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {schoolsProductQuota && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 py-1 text-xs border-primary text-primary hover:bg-primary/10 relative"
                  >
                    <span>
                      Quota de produit
                      {hasExceeded && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white" />
                      )}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-base flex items-center mb-2 text-primary font-semibold">
                    Détail des quotas produits
                  </div>
                  <div className="space-y-2">
                    {schoolsProductQuota.map((value) => {
                      const product = products?.find(
                        (p) => p.id === value.product_id,
                      );
                      return (
                        <div
                          key={value.product_id}
                          className="flex justify-between items-center gap-2 py-1 px-2"
                        >
                          <span className="font-medium text-xs text-muted-foreground">
                            {product?.name}
                          </span>
                          <span
                            className={`text-xs font-bold ${schoolsProductQuotaUsed[value.product_id] > value.quota ? "text-red-600" : "text-primary"}`}
                          >
                            Utilisé:{" "}
                            {schoolsProductQuotaUsed[value.product_id] || 0} /{" "}
                            {value.quota}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <GlobalQuotaCard
            totalParticipants={totalParticipants}
            totalValidated={totalValidated}
            totalTeams={totalTeams}
            sportQuotas={sportsQuota || []}
            schoolName={formatSchoolName(school.school.name) || "École"}
          />
          {participantTableData?.length > 0 ? (
            <div className="overflow-y-auto">
              <ParticipantDataTable
                data={participantTableData}
                schoolName={formatSchoolName(school.school.name) || "École"}
                schoolId={school.school_id}
                onValidateParticipant={onValidate}
                onInvalidateParticipant={onInvalidate}
                onDeleteParticipant={onDelete}
                onCancelParticipant={onCancel}
                isLoading={
                  isValidateLoading || isInvalidateLoading || isDeleteLoading
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-gray-500">
                Aucun participant trouvé pour cette école
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
