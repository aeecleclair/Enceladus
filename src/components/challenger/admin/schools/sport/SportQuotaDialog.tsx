import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SchoolProductQuota,
  SchoolSportQuota,
  Sport,
} from "@/src/api/hyperionSchemas";
import {
  SportQuotaFormValues,
  sportQuotaFormSchema,
} from "@/src/forms/sportQuota";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { Form } from "@/src/components/ui/form";
import { FormItem, FormLabel } from "@/src/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Plus } from "lucide-react";
import { useEffect } from "react";

interface SportQuotaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SportQuotaFormValues) => void;
  sports?: Sport[];
  selectedSport: string | null;
  setSelectedSport: (sportId: string | null) => void;
  existingQuota?: SchoolSportQuota;
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
}

export function SportQuotaDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  sports,
  selectedSport,
  setSelectedSport,
  existingQuota,
  title,
  description,
  submitLabel,
  isLoading,
}: SportQuotaDialogProps) {
  const quotaForm = useForm<SportQuotaFormValues>({
    resolver: zodResolver(sportQuotaFormSchema),
    defaultValues: {
      participant_quota: undefined,
      team_quota: undefined,
    },
  });

  useEffect(() => {
    if (existingQuota) {
      quotaForm.reset({
        participant_quota: existingQuota.participant_quota || undefined,
        team_quota: existingQuota.team_quota || undefined,
      });
    }
  }, [existingQuota, quotaForm]);

  const handleCancel = () => {
    onOpenChange(false);
    quotaForm.reset();
    setSelectedSport(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un quota
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...quotaForm}>
          <form
            onSubmit={quotaForm.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {selectedSport ? (
              <FormItem className="w-full">
                <FormLabel>Sport</FormLabel>
                <div className="p-2 border rounded-md bg-muted/50">
                  {sports?.find((sport) => sport.id === selectedSport)?.name ||
                    selectedSport}
                </div>
              </FormItem>
            ) : (
              <FormItem className="w-full">
                <FormLabel>Sport</FormLabel>
                <Select
                  value={selectedSport || ""}
                  onValueChange={(value) => setSelectedSport(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports?.map((sport) => {
                      const hasQuota = !!existingQuota;
                      if (!hasQuota) {
                        return (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </SelectItem>
                        );
                      }
                      return null;
                    })}
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            <StyledFormField
              form={quotaForm}
              label="Quota de participants"
              id="participant_quota"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <StyledFormField
              form={quotaForm}
              label="Quota d'équipes"
              id="team_quota"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {submitLabel}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
