import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generalQuotaFormSchema,
  GeneralQuotaFormValues,
} from "@/src/forms/generalQuota";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { Form } from "@/src/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { SchoolGeneralQuota } from "@/src/api/hyperionSchemas";

interface GeneralQuotaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeneralQuotaFormValues) => void;
  existingQuota?: SchoolGeneralQuota;
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
}

export function GeneralQuotaDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  existingQuota,
  title,
  description,
  submitLabel,
  isLoading,
}: GeneralQuotaDialogProps) {
  const quotaForm = useForm<GeneralQuotaFormValues>({
    resolver: zodResolver(generalQuotaFormSchema),
    defaultValues: {
      athlete_quota: existingQuota?.athlete_quota || undefined,
      cameraman_quota: existingQuota?.cameraman_quota || undefined,
      pompom_quota: existingQuota?.pompom_quota || undefined,
      fanfare_quota: existingQuota?.fanfare_quota || undefined,
      athlete_cameraman_quota:
        existingQuota?.athlete_cameraman_quota || undefined,
      athlete_pompom_quota: existingQuota?.athlete_pompom_quota || undefined,
      athlete_fanfare_quota: existingQuota?.athlete_fanfare_quota || undefined,
      non_athlete_cameraman_quota:
        existingQuota?.non_athlete_cameraman_quota || undefined,
      non_athlete_pompom_quota:
        existingQuota?.non_athlete_pompom_quota || undefined,
      non_athlete_fanfare_quota:
        existingQuota?.non_athlete_fanfare_quota || undefined,
    },
  });

  useEffect(() => {
    if (existingQuota) {
      quotaForm.reset({
        athlete_quota: existingQuota.athlete_quota || undefined,
        cameraman_quota: existingQuota.cameraman_quota || undefined,
        pompom_quota: existingQuota.pompom_quota || undefined,
        fanfare_quota: existingQuota.fanfare_quota || undefined,
        athlete_cameraman_quota:
          existingQuota.athlete_cameraman_quota || undefined,
        athlete_pompom_quota: existingQuota.athlete_pompom_quota || undefined,
        athlete_fanfare_quota: existingQuota.athlete_fanfare_quota || undefined,
        non_athlete_cameraman_quota:
          existingQuota.non_athlete_cameraman_quota || undefined,
        non_athlete_pompom_quota:
          existingQuota.non_athlete_pompom_quota || undefined,
        non_athlete_fanfare_quota:
          existingQuota.non_athlete_fanfare_quota || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingQuota]);

  const handleCancel = () => {
    onOpenChange(false);
    quotaForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un quota général
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StyledFormField
                form={quotaForm}
                label="Quota d'athlètes"
                id="athlete_quota"
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
                label="Quota de cameramen"
                id="cameraman_quota"
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
                label="Quota de pompom"
                id="pompom_quota"
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
                label="Quota de fanfare"
                id="fanfare_quota"
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
                label="Quota athlète + cameraman"
                id="athlete_cameraman_quota"
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
                label="Quota athlète + pompom"
                id="athlete_pompom_quota"
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
                label="Quota athlète + fanfare"
                id="athlete_fanfare_quota"
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
                label="Quota non-athlète + cameraman"
                id="non_athlete_cameraman_quota"
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
                label="Quota non-athlète + pompom"
                id="non_athlete_pompom_quota"
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
                label="Quota non-athlète + fanfare"
                id="non_athlete_fanfare_quota"
                input={(field) => (
                  <Input
                    type="number"
                    min="0"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
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
