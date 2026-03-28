import { StyledFormField } from "../../custom/StyledFormField";
import { Label } from "../../ui/label";
import { UseFormReturn } from "react-hook-form";
import { RegisteringFormValues } from "@/src/forms/registering";
import { CardTemplate } from "./CardTemplate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { FormMessage } from "../../ui/form";
import { Button } from "../../ui/button";
import { LoadingButton } from "../../custom/LoadingButton";
import { Sport, TeamInfo } from "@/src/api/hyperionSchemas";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useUser } from "@/src/hooks/useUser";
import { useEffect, useState } from "react";
import { DocumentDialog } from "../../custom/DocumentDialog";
import { useDocument } from "@/src/hooks/useDocument";

interface SportCardProps {
  form: UseFormReturn<RegisteringFormValues>;
  sports?: Sport[];
}

export const SportCard = ({ form, sports }: SportCardProps) => {
  const { me } = useUser();

  const [teamName, setTeamName] = useState("");
  const [open, setIsOpen] = useState(false);

  const { data } = useDocument(me?.id ?? null);

  useEffect(() => {
    if (data) {
      form.setValue("sport.certificate", "Certificat chargé");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { teams, createSchoolSportTeam, isCreateLoading } = useSchoolSportTeams(
    {
      schoolId: me?.school?.id,
      sportId: form.watch("sport.id"),
    },
  );

  const createTeam = (name: string) => {
    const body: TeamInfo = {
      name,
      sport_id: form.watch("sport.id")!,
      school_id: me?.school?.id!,
      captain_id: me?.id!,
    };
    createSchoolSportTeam(body, (team) => {
      form.setValue("sport.team_id", team.id);
    });
  };

  const selectedSport = sports?.find(
    (sport) => sport.id === form.watch("sport.id"),
  );

  const userSportCategories = form.watch("sex");

  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">
        Ta participation aux Challenge :
      </h2>
      <StyledFormField
        form={form}
        label="Sport"
        id="sport.id"
        input={(field) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Sélectionnez un sport" />
            </SelectTrigger>
            {sports && (
              <SelectContent>
                {sports
                  .filter(
                    (sport) =>
                      (sport.sport_category === null ||
                        sport.sport_category === undefined ||
                        sport.sport_category === userSportCategories) &&
                      sport.active,
                  )
                  .map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            )}
          </Select>
        )}
      />

      {(selectedSport?.team_size ?? 0) > 1 && (
        <div className="flex flex-col gap-4 lg:flex-row w-2/3">
          <div className="flex gap-2">
            <StyledFormField
              form={form}
              label="Équipe"
              id="sport.team_id"
              input={(field) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-60">
                    <SelectValue placeholder="Sélectionnez une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams?.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-8">
                  Créer équipe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle équipe</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="team-name">Nom de l&apos;équipe</Label>
                    <Input
                      id="team-name"
                      placeholder="Nom de l'équipe"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <LoadingButton
                    onClick={() => {
                      createTeam(teamName);
                      setTeamName("");
                    }}
                    disabled={teamName.length === 0}
                    isLoading={isCreateLoading}
                    className="w-full"
                  >
                    Créer l&apos;équipe
                  </LoadingButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {form.watch("sport.team_id") && (
            <StyledFormField
              form={form}
              label="Remplaçant d'équipe"
              id="sport.substitute"
              input={(field) => (
                <div className="flex items-center space-x-2 pt-2 ">
                  <Checkbox
                    id="sport.substitute"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="sport.substitute">Je suis remplaçant</Label>
                </div>
              )}
            />
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row w-2/3">
        <StyledFormField
          form={form}
          label="Numéro de licence"
          id="sport.license_number"
          input={(field) => <Input {...field} className="w-60" />}
        />
        <StyledFormField
          form={form}
          label="Certificat médical"
          id="sport.certificate"
          input={(field) => (
            <div className="col-span-4 gap-2 grid grid-cols-3">
              <Dialog open={open} onOpenChange={setIsOpen}>
                <FormMessage />
                <DialogTrigger asChild>
                  <Button variant="outline" className={"col-span-3"}>
                    <div className="flex flex-row items-start w-full">
                      <>
                        <span className="text-gray-500 overflow-hidden">
                          {form.watch("sport.certificate") ??
                            "Aucun fichier séléctionné"}
                        </span>
                      </>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-2xl top-1/2">
                  <DialogHeader>
                    <DialogTitle className="text-red sm:text-lg">
                      Ajouter un certificat médical
                    </DialogTitle>
                  </DialogHeader>
                  <DocumentDialog
                    setIsOpen={setIsOpen}
                    field={field}
                    sportId={form.watch("sport.id")}
                    onFileRemove={() => {
                      form.setValue("sport.certificate", "Choisir un fichier");
                      form.setValue("sport.certificateFile", null);
                    }}
                    onFileSet={(file) => {
                      form.setValue("sport.certificate", file.name);
                      form.setValue("sport.certificateFile", file);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        />
      </div>
    </CardTemplate>
  );
};
