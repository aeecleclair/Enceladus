import { UseFormReturn } from "react-hook-form";
import { RegisteringFormValues } from "@/src/forms/registering";
import { useUser } from "@/src/hooks/useUser";
import { useSports } from "@/src/hooks/useSports";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { CardTemplate } from "./CardTemplate";
import { Badge } from "../../ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";

interface SummaryCardProps {
  form: UseFormReturn<RegisteringFormValues>;
}

export const SummaryCard = ({ form }: SummaryCardProps) => {
  const { me } = useUser();
  const { teams } = useSchoolSportTeams({
    schoolId: me?.school_id,
    sportId: form.getValues().sport?.id,
  });
  const { sports } = useSports();
  const formValues = form.getValues();
  
  const selectedSport = formValues.sport?.id
  ? sports?.find((sport) => sport.id === formValues.sport?.id)
  : undefined;

  const myTeam = teams?.find((team) => team.id === formValues.sport?.team_id);

  return (
    <CardTemplate>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Récapitulatif de ton inscription
        </h2>

        {/* Personal Information */}
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
              <p>{formValues.phone || "-"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">
                Autorisation photo/vidéo
              </p>
              <div className="flex items-center gap-1">
                {formValues.allow_pictures ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Autorisée</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Non autorisée</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Participation Details */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h3 className="font-semibold">Participation</h3>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {formValues.is_athlete && formValues.sport && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium">Sportif</p>
                    </div>

                    {/* Athlete-specific details */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Sport</p>
                        <p>
                          {selectedSport?.name || "-"}{" "}
                          {formValues.sex ? `(${formValues.sex!})` : ""}
                        </p>
                      </div>

                      {formValues.sport.team_id && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Équipe
                          </p>
                          <p>
                            {myTeam?.name || "-"}{" "}
                            {myTeam?.captain_id === me?.id ? "(capitaine)" : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formValues.is_cameraman && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Caméraman</p>
                  </div>
                )}

                {formValues.is_fanfare && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Fanfaron</p>
                  </div>
                )}

                {formValues.is_pompom && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Pompom</p>
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-2">
              <h3 className="font-semibold">Produits sélectionnés</h3>

              {formValues.products && formValues.products.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {formValues.products.map((productItem, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <p className="text-sm">
                        {productItem.product.name}
                        {productItem.quantity > 1 &&
                          ` (x${productItem.quantity})`}{" "}
                        -{" "}
                        <span className="font-semibold">
                          {productItem.product.price / 100}€
                        </span>
                      </p>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm text-muted-foreground">Total:</p>
                    <Badge variant="outline">
                      {formValues.products
                        .reduce(
                          (total, item) =>
                            total + (item.product.price / 100) * item.quantity,
                          0,
                        )
                        .toFixed(2)}
                      €
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
      </div>
    </CardTemplate>
  );
};
