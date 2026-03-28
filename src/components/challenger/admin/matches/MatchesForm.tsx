import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";
import { DatePicker } from "@/src/components/custom/DatePicker";
import { DateTimePicker } from "@/src/components/custom/DateTimePicker";
import { useSports } from "@/src/hooks/useSports";
import { useEdition } from "@/src/hooks/useEdition";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useLocations } from "@/src/hooks/useLocations";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { MatchFormValues } from "@/src/forms/match";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Target,
  School,
  Gamepad2,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { EndMatchDialog } from "./EndMatchDialog";
import { RotateCcw } from "lucide-react";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface MatchesFormProps {
  form: UseFormReturn<MatchFormValues>;
  onSubmit: (values: MatchFormValues) => void;
  isLoading: boolean;
  submitLabel: string;
  isEditing?: boolean;
  onSportChange?: (sportId: string) => void;
  onUpdateScore?: (score1: number | null, score2: number | null) => void;
  onEndMatch?: (winnerId: string | null) => void;
  initialTeam1SchoolId?: string | null;
  initialTeam2SchoolId?: string | null;
}

export const MatchesForm = ({
  form,
  onSubmit,
  isLoading,
  submitLabel,
  isEditing = false,
  onSportChange,
  onUpdateScore,
  onEndMatch,
  initialTeam1SchoolId,
  initialTeam2SchoolId,
}: MatchesFormProps) => {
  const { sports } = useSports();
  const { edition } = useEdition();
  const { sportSchools } = useSportSchools();
  const { locations } = useLocations();

  const [selectedSport, setSelectedSport] = useState<string | null>(
    form.getValues("sport_id") || null,
  );

  const [schoolOptions, setSchoolOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [team1SchoolId, setTeam1SchoolId] = useState<string | null>(null);
  const [team2SchoolId, setTeam2SchoolId] = useState<string | null>(null);
  const [endDialogOpen, setEndDialogOpen] = useState(false);

  const { teams: team1Options } = useSchoolSportTeams({
    schoolId: team1SchoolId || undefined,
    sportId: selectedSport || undefined,
  });

  const { teams: team2OptionsRaw } = useSchoolSportTeams({
    schoolId: team2SchoolId || undefined,
    sportId: selectedSport || undefined,
  });

  const team2Options = team2OptionsRaw?.filter(
    (team) => team.id !== form.getValues("team1_id"),
  );

  useEffect(() => {
    if (edition && !form.getValues("edition_id")) {
      form.setValue("edition_id", edition.id);
    }
  }, [edition, form]);

  useEffect(() => {
    if (isEditing && initialTeam1SchoolId && !team1SchoolId) {
      setTeam1SchoolId(initialTeam1SchoolId);
    }
    if (isEditing && initialTeam2SchoolId && !team2SchoolId) {
      setTeam2SchoolId(initialTeam2SchoolId);
    }
  }, [
    isEditing,
    initialTeam1SchoolId,
    initialTeam2SchoolId,
    team1SchoolId,
    team2SchoolId,
  ]);

  useEffect(() => {
    if (selectedSport && sportSchools) {
      const schoolsForSport = sportSchools.filter((school) => school.active);

      setSchoolOptions(
        schoolsForSport.map((school) => ({
          id: school.school_id,
          name: school.school.name,
        })),
      );
    } else {
      setSchoolOptions([]);
    }
  }, [selectedSport, sportSchools]);

  useEffect(() => {
    if (selectedSport && !isEditing) {
      form.setValue("team1_id", "");
      form.setValue("team2_id", "");
      setTeam1SchoolId(null);
      setTeam2SchoolId(null);
    }
  }, [selectedSport, form, isEditing]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Informations du match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Nom du match
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Finale basketball"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sport_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Sport
                    </FormLabel>
                    <Select
                      disabled={isEditing}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSport(value);
                        onSportChange?.(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Sélectionnez un sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sports
                          ?.filter((sport) => sport.active)
                          .map((sport) => (
                            <SelectItem key={sport.id} value={sport.id}>
                              {sport.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {isEditing && (
                      <FormDescription>
                        Le sport ne peut pas être modifié après création
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Teams Selection Card */}
        {selectedSport ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Sélection des équipes
              </CardTitle>
              <FormDescription>
                Choisissez les écoles et leurs équipes qui s&apos;affronteront
              </FormDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team 1 Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Équipe 1
                    </Badge>
                  </div>
                  <FormField
                    control={form.control}
                    name="team1_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <FormLabel className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            École
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              setTeam1SchoolId(value === "none" ? null : value)
                            }
                            value={team1SchoolId || "none"}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Sélectionnez une école" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                Sélectionnez une école
                              </SelectItem>
                              {schoolOptions.map((school) => (
                                <SelectItem key={school.id} value={school.id}>
                                  {formatSchoolName(school.name)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {team1SchoolId && (
                            <div className="space-y-2">
                              <FormLabel className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Équipe
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sélectionnez une équipe" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {team1Options?.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                {/* Team 2 Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Équipe 2
                    </Badge>
                  </div>
                  <FormField
                    control={form.control}
                    name="team2_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <FormLabel className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            École
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              setTeam2SchoolId(value === "none" ? null : value)
                            }
                            value={team2SchoolId || "none"}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Sélectionnez une école" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                Sélectionnez une école
                              </SelectItem>
                              {schoolOptions.map((school) => (
                                <SelectItem key={school.id} value={school.id}>
                                  {formatSchoolName(school.name)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {team2SchoolId && (
                            <div className="space-y-2">
                              <FormLabel className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Équipe
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sélectionnez une équipe" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {team2Options?.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Sélectionnez d&apos;abord un sport
              </h3>
              <p className="text-sm text-muted-foreground">
                Vous devez choisir un sport avant de pouvoir sélectionner les
                équipes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Schedule & Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Programmation du match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date et heure du match
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromDate={
                          edition?.start_date
                            ? new Date(edition!.start_date)
                            : new Date(1900)
                        }
                        toDate={
                          edition?.end_date
                            ? new Date(edition!.end_date)
                            : new Date()
                        }
                        timeLabel="Heure du match"
                        timeId="match-time"
                      />
                    </FormControl>
                    <FormDescription>
                      Sélectionnez la date et l&apos;heure prévues pour le match
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Lieu
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? undefined : value)
                      }
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Sélectionnez un lieu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          Aucun lieu spécifié
                        </SelectItem>
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choisissez le lieu où se déroulera le match
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit — update match info */}
        <div className="flex justify-end">
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className="h-11 px-8 font-medium"
            size="lg"
          >
            {submitLabel}
          </LoadingButton>
        </div>

        {/* Score Card - Only for editing */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="score_team1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {team1Options?.find(
                          (t) => t.id === form.getValues("team1_id"),
                        )?.name || "Équipe 1"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Score"
                          {...field}
                          className="h-11"
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined;
                            field.onChange(value);
                          }}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="score_team2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {team2Options?.find(
                          (t) => t.id === form.getValues("team2_id"),
                        )?.name || "Équipe 2"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Score"
                          {...field}
                          className="h-11"
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined;
                            field.onChange(value);
                          }}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {onUpdateScore && (
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      const s1 = form.getValues("score_team1");
                      const s2 = form.getValues("score_team2");
                      onUpdateScore(
                        s1 !== undefined ? s1 : null,
                        s2 !== undefined ? s2 : null,
                      );
                    }}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Enregistrer le score
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Result Card - Only for editing */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Résultat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {form.watch("ended") ? (
                <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Match terminé
                      </p>
                      <p className="text-sm text-green-700">
                        {form.watch("winner_id")
                          ? `Vainqueur : ${
                              team1Options?.find(
                                (t) => t.id === form.watch("winner_id"),
                              )?.name ||
                              team2Options?.find(
                                (t) => t.id === form.watch("winner_id"),
                              )?.name ||
                              "—"
                            }`
                          : "Match nul"}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("ended", false);
                      form.setValue("winner_id", undefined);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Réouvrir
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg bg-slate-50 border p-4">
                  <div>
                    <p className="text-sm font-medium">Match en cours</p>
                    <p className="text-sm text-muted-foreground">
                      Terminez le match en sélectionnant le vainqueur
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setEndDialogOpen(true)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Terminer le match
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <EndMatchDialog
          open={endDialogOpen}
          onOpenChange={setEndDialogOpen}
          team1Name={
            team1Options?.find(
              (t) => t.id === form.getValues("team1_id"),
            )?.name || "Équipe 1"
          }
          team2Name={
            team2Options?.find(
              (t) => t.id === form.getValues("team2_id"),
            )?.name || "Équipe 2"
          }
          team1Id={form.getValues("team1_id")}
          team2Id={form.getValues("team2_id")}
          scoreTeam1={form.getValues("score_team1")}
          scoreTeam2={form.getValues("score_team2")}
          onConfirm={(winnerId) => {
            if (onEndMatch) {
              onEndMatch(winnerId);
            } else {
              form.setValue("ended", true);
              form.setValue("winner_id", winnerId ?? undefined);
            }
          }}
        />

      </form>
    </Form>
  );
};
