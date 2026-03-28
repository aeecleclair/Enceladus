import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import { useUser } from "@/src/hooks/useUser";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Badge } from "../../ui/badge";
import { Edit, XIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useSports } from "@/src/hooks/useSports";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { Button } from "../../ui/button";
import { Purchase } from "@/src/api/hyperionSchemas";

interface RegistrationSummaryProps {
  onPurchaseEdit?: () => void;
  onLicenseEdit?: () => void;
  onSubstituteEdit?: () => void;
  userMePurchases?: Purchase[];
}

export const RegistrationSummary = ({
  onPurchaseEdit,
  onLicenseEdit,
  onSubstituteEdit,
  userMePurchases,
}: RegistrationSummaryProps) => {
  const { me } = useUser();
  const { availableProducts } = useAvailableProducts();
  const { meCompetition } = useCompetitionUser();
  const { meParticipant } = useParticipant();
  const { sports } = useSports();
  const { teams } = useSchoolSportTeams({
    schoolId: me?.school_id,
    sportId: meParticipant?.sport_id,
  });

  const purchasedItems = userMePurchases?.map((purchase) => {
    return availableProducts?.find(
      (product) => product.id === purchase.product_variant_id,
    );
  });

  const total = purchasedItems?.reduce((acc, item) => {
    if (item) {
      return (
        acc +
        (item.price *
          (userMePurchases?.find((p) => p.product_variant_id === item.id)
            ?.quantity || 1)) /
          100
      );
    }
    return acc;
  }, 0);

  const team = teams?.find((team) => team.id === meParticipant?.team_id);

  return (
    <>
      <h2 className="text-xl font-semibold">
        Récapitulatif de ton inscription
      </h2>

      <div className="space-y-2">
        <h3 className="font-semibold">Informations personnelles</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Prénom</p>
            <p>{me?.firstname || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p>{me?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">École</p>
            <p>{me?.school_id ? formatSchoolName(me?.school?.name) : "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Téléphone</p>
            <p>{me?.phone || "-"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="font-semibold">Participation</h3>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {meCompetition?.is_athlete && meParticipant && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium">Sportif</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Sport</p>
                      <p>
                        {sports?.find(
                          (sport) => sport.id === meParticipant.sport_id,
                        )?.name || "-"}{" "}
                        {meCompetition?.sport_category
                          ? `(${meCompetition.sport_category!})`
                          : ""}
                      </p>
                    </div>

                    {meParticipant.team_id && (
                      <div>
                        <p className="text-sm text-muted-foreground">Équipe</p>
                        <p>
                          {team?.name || "-"}{" "}
                          {team?.captain_id === me?.id ? "(capitaine)" : ""}
                        </p>
                      </div>
                    )}

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Statut</p>
                        {onSubstituteEdit && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label="Modifier le statut remplaçant"
                            onClick={onSubstituteEdit}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {meParticipant.substitute ? (
                          <>
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-600"
                            >
                              Remplaçant
                            </Badge>
                          </>
                        ) : (
                          <>
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Titulaire
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    {meParticipant.license === null ||
                    meParticipant.license === undefined ||
                    meParticipant.license === "" ||
                    !meParticipant.is_license_valid ? (
                      <>
                        {
                          !(
                            meParticipant.license === null ||
                            meParticipant.license === undefined ||
                            (meParticipant.license === "" && (
                              <div>
                                <XIcon className="h-4 w-4 text-red-500" />
                                <p className="text-sm text-muted-foreground">
                                  License
                                </p>
                                <p>{meParticipant.license}</p>
                              </div>
                            ))
                          )
                        }
                        <Button
                          type="button"
                          aria-label="Modifier la license"
                          onClick={onLicenseEdit}
                        >
                          <Edit className="h-4 w-4" />
                          Modifier ma license
                        </Button>
                      </>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          License Validée
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {meCompetition?.is_cameraman && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Caméraman</p>
                </div>
              )}

              {meCompetition?.is_fanfare && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Fanfaron</p>
                </div>
              )}

              {meCompetition?.is_pompom && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Pompom</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-black">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900">
                Produits sélectionnés
              </h3>
              {onPurchaseEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Modifier les produits"
                  onClick={onPurchaseEdit}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
            </div>

            {userMePurchases && userMePurchases.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {userMePurchases.map((productItem, index) => {
                  const product = availableProducts?.find(
                    (p) => p.id === productItem.product_variant_id,
                  );
                  if (!product) return null;

                  return (
                    <div key={index} className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <p className="text-sm">
                        {product.product.name}
                        {productItem.quantity > 1 &&
                          ` (x${productItem.quantity})`}{" "}
                        -{" "}
                        <span className="font-semibold">
                          {(product.price * productItem.quantity) / 100}€
                        </span>
                      </p>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-muted-foreground">Total:</p>
                  <Badge variant="outline" className="text-black">
                    {total?.toFixed(2)}€
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 mt-2">
                <p className="text-sm text-muted-foreground">
                  Aucun produit sélectionné
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
