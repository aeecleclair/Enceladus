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
import { Badge } from "@/src/components/ui/badge";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { TeamFormValues } from "@/src/forms/team";
import { Shield, Trophy, School, Crown, Users, Flag } from "lucide-react";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSportSchools } from "@/src/hooks/useSportSchools";

interface TeamsFormProps {
  form: UseFormReturn<TeamFormValues>;
  onSubmit: (values: TeamFormValues) => void;
  isLoading: boolean;
  submitLabel: string;
  isEditing?: boolean;
  initialData?: {
    name: string;
    sport_id: string;
    school_id: string;
    captain_id?: string;
  };
}

export const TeamsForm = ({
  form,
  onSubmit,
  isLoading,
  submitLabel,
  isEditing = false,
  initialData,
}: TeamsFormProps) => {
  const { sports } = useSports();
  const { sportSchools } = useSportSchools();

  const [selectedSportId, setSelectedSportId] = useState<string | null>(
    form.getValues("sport_id") || initialData?.sport_id || null,
  );
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(
    form.getValues("school_id") || initialData?.school_id || null,
  );

  const { schoolParticipants } = useSchoolParticipants({
    schoolId: selectedSchoolId || null,
  });

  // Update form when sport or school changes
  useEffect(() => {
    if (selectedSportId) {
      form.setValue("sport_id", selectedSportId);
    }
  }, [selectedSportId, form]);

  useEffect(() => {
    if (selectedSchoolId) {
      form.setValue("school_id", selectedSchoolId);
    }
  }, [selectedSchoolId, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isEditing ? "Modifier l'équipe" : "Créer une nouvelle équipe"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Team Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Nom de l&apos;équipe
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le nom de l'équipe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sport Selection */}
            <FormField
              control={form.control}
              name="sport_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Sport
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSportId(value);
                    }}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sports?.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4" />
                            {sport.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isEditing && (
                    <FormDescription>
                      Le sport ne peut pas être modifié
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* School Selection */}
            <FormField
              control={form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    École
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSchoolId(value);
                    }}
                    disabled={!selectedSportId || isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une école" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sportSchools?.map((school) => (
                        <SelectItem
                          key={school.school_id}
                          value={school.school_id}
                        >
                          <div className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            {school.school.name
                              ? formatSchoolName(school.school.name)
                              : school.school.id}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {isEditing
                      ? "L'école ne peut pas être modifiée"
                      : "Vous devez d'abord sélectionner un sport"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Captain Selection */}
            <FormField
              control={form.control}
              name="captain_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    Capitaine
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      !schoolParticipants || schoolParticipants.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un capitaine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schoolParticipants?.map((participant: any) => (
                        <SelectItem
                          key={participant.user_id}
                          value={participant.user_id}
                        >
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-600" />
                            {participant.user.user.firstname}{" "}
                            {participant.user.user.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez le capitaine de l&apos;équipe parmi les
                    participants de l&apos;école
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            {form.getValues("captain_id") && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Résumé de l&apos;équipe
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Capitaine:</span>{" "}
                    {
                      schoolParticipants?.find(
                        (p: any) => p.user_id === form.getValues("captain_id"),
                      )?.user.user.firstname
                    }{" "}
                    {
                      schoolParticipants?.find(
                        (p: any) => p.user_id === form.getValues("captain_id"),
                      )?.user.user.name
                    }
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                className="min-w-32"
              >
                {submitLabel}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
