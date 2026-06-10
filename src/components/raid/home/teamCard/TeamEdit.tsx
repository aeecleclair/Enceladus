import { RaidTeam } from "@/api";
import {
  ParticipantField,
  ValueTypes,
} from "@/components/raid/custom/ParticipantField";
import { useMeTeam } from "@/hooks/raid/useMeTeam";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FormProvider, useForm } from "react-hook-form";
import { HiCheck } from "react-icons/hi";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface TeamCardProps {
  team?: RaidTeam;
  setIsEdit: (value: boolean) => void;
}

export const TeamEdit = ({ team, setIsEdit }: TeamCardProps) => {
  const { toast } = useToast();
  const { isUpdateLoading, updateTeam } = useMeTeam();
  const formSchema = z.object({
    name: z.string().optional(),
    difficulty: z.enum(["discovery", "sports", "expert"]).optional(),
    meeting_place: z.enum(["centrale", "bellecour", "anyway"]).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: team?.name ?? undefined,
      difficulty: team?.difficulty ?? undefined,
      meeting_place: team?.meeting_place ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!form.formState.isDirty) {
      setIsEdit(false);
      return;
    }
    updateTeam(
      team?.id ?? "",
      () => {
        setIsEdit(false);
        toast({
          title: "Équipe mise à jour",
        });
      },
      values,
    );
  }

  return (
    <FormProvider {...form} key={"Participant"}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col justify-between h-full`}
      >
        <CardContent>
          <ParticipantField
            label="Nom d'équipe"
            id="name"
            form={form}
            type={ValueTypes.STRING}
          />
          <ParticipantField
            label="Lieu de rendez-vous"
            id="meeting_place"
            placeholder="Selectionner un lieu de rendez-vous"
            form={form}
            type={ValueTypes.MEETINGPLACE}
          />

          <ParticipantField
            label="Parcours"
            id="difficulty"
            placeholder="Selectionner un parcours"
            form={form}
            type={ValueTypes.DIFFICULTY}
          />
          {isUpdateLoading ? (
            <Button variant="default" disabled className="w-full mt-6">
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              className="w-full mt-6"
              type="submit"
              disabled={!form.formState.isDirty}
            >
              <HiCheck className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          )}
        </CardContent>
      </form>
    </FormProvider>
  );
};
