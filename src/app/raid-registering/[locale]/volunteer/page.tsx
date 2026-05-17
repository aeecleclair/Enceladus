"use client";

import { UserShell } from "@/components/raid/home/UserShell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/common/LoadingButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { HeartHandshake } from "lucide-react";

const VolunteerPage = () => {
  const { isTokenQueried, token } = useAuth();
  const {
    meVolunteer,
    isLoading,
    updateMeVolunteer,
    isUpdateLoading,
    cancelMeVolunteer,
    isCancelLoading,
  } = useMeVolunteer();
  const router = useRouter();

  const [diet, setDiet] = useState("");
  const [allergy, setAllergy] = useState("");
  const [hasCar, setHasCar] = useState(false);
  const [carSeats, setCarSeats] = useState<number | undefined>(undefined);
  const [isSpecialDriver, setIsSpecialDriver] = useState(false);
  const [isUtilityVehicleDriver, setIsUtilityVehicleDriver] = useState(false);
  const [isParcoursHelper, setIsParcoursHelper] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

  useEffect(() => {
    if (isTokenQueried && token === null) {
      router.replace("/login");
    }
  }, [isTokenQueried, token, router]);

  useEffect(() => {
    if (!isLoading && !meVolunteer) {
      router.replace("/register?role=volunteer");
    }
  }, [isLoading, meVolunteer, router]);

  useEffect(() => {
    if (meVolunteer) {
      setDiet(meVolunteer.diet ?? "");
      setAllergy(meVolunteer.allergy ?? "");
      setHasCar(meVolunteer.has_car ?? false);
      setCarSeats(meVolunteer.car_seats ?? undefined);
      setIsSpecialDriver(meVolunteer.is_special_driver ?? false);
      setIsUtilityVehicleDriver(meVolunteer.is_utility_vehicle_driver ?? false);
      setIsParcoursHelper(meVolunteer.is_parcours_helper ?? false);
    }
  }, [meVolunteer]);

  const status = meVolunteer?.cancelled
    ? { label: "Annulé", variant: "destructive" as const }
    : meVolunteer?.validated
      ? { label: "Validé", variant: "default" as const }
      : { label: "En attente", variant: "secondary" as const };

  const handleSave = () => {
    updateMeVolunteer({
      diet: diet || null,
      allergy: allergy || null,
      has_car: hasCar,
      car_seats: hasCar ? carSeats : null,
      is_special_driver: isSpecialDriver,
      is_utility_vehicle_driver: isUtilityVehicleDriver,
      is_parcours_helper: isParcoursHelper,
    });
  };

  return (
    <UserShell>
      <main className="mx-auto w-full space-y-5 py-4 sm:py-5">
        <section className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-700 dark:text-orange-400">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Mon bénévolat
              </h1>
              <p className="text-sm text-muted-foreground">
                Mettez à jour vos disponibilités et informations logistiques.
              </p>
            </div>
          </div>
        </section>
        <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mon inscription bénévole</CardTitle>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <CardDescription>
              {meVolunteer?.cancelled
                ? "Votre inscription a été annulée."
                : meVolunteer?.validated
                  ? "Merci pour votre engagement."
                  : "Votre inscription est en cours d'examen."}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>
              Vous pouvez mettre à jour ces informations à tout moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diet">Régime alimentaire</Label>
              <Input
                id="diet"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                placeholder="Aucun régime spécifique"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergy">Allergies</Label>
              <Input
                id="allergy"
                value={allergy}
                onChange={(e) => setAllergy(e.target.value)}
                placeholder="Aucune allergie"
              />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="hasCar"
                checked={hasCar}
                onCheckedChange={(v) => setHasCar(v === true)}
              />
              <Label htmlFor="hasCar">J&apos;ai une voiture</Label>
            </div>
            {hasCar && (
              <div className="space-y-2">
                <Label htmlFor="carSeats">Nombre de places</Label>
                <Input
                  id="carSeats"
                  type="number"
                  min={0}
                  value={carSeats ?? ""}
                  onChange={(e) =>
                    setCarSeats(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Checkbox
                id="specialDriver"
                checked={isSpecialDriver}
                onCheckedChange={(v) => setIsSpecialDriver(v === true)}
              />
              <Label htmlFor="specialDriver">Conducteur véhicule spécial</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="utilityDriver"
                checked={isUtilityVehicleDriver}
                onCheckedChange={(v) => setIsUtilityVehicleDriver(v === true)}
              />
              <Label htmlFor="utilityDriver">Conducteur utilitaire</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="parcoursHelper"
                checked={isParcoursHelper}
                onCheckedChange={(v) => setIsParcoursHelper(v === true)}
              />
              <Label htmlFor="parcoursHelper">Aide sur le parcours</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <LoadingButton
                isLoading={isUpdateLoading}
                onClick={handleSave}
                className="flex-1"
                disabled={!!meVolunteer?.cancelled}
              >
                Enregistrer
              </LoadingButton>
              {!meVolunteer?.cancelled && (
                <>
                  <LoadingButton
                    isLoading={isCancelLoading}
                    onClick={() => setIsCancelAlertOpen(true)}
                    variant="destructive"
                  >
                    Se désinscrire
                  </LoadingButton>
                  <WarningDialog
                    isOpened={isCancelAlertOpen}
                    setIsOpened={setIsCancelAlertOpen}
                    isLoading={isCancelLoading}
                    title="Se désinscrire du bénévolat"
                    description="Vous êtes sur le point d'annuler votre inscription bénévole. Cette action peut être réversible seulement par l'organisation."
                    validateLabel="Confirmer"
                    callback={() => cancelMeVolunteer()}
                    width="w-35"
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </UserShell>
  );
};

export default VolunteerPage;
