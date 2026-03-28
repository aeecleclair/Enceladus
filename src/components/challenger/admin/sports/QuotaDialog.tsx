import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CoreSchool,
  SchoolExtension,
  SchoolSportQuota,
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
import { Plus, AlertTriangle } from "lucide-react";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useEffect } from "react";

interface QuotaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SportQuotaFormValues) => void;
  onSubmitAll?: (values: SportQuotaFormValues) => void;
  schools?: SchoolExtension[];
  selectedSchool: string | null;
  setSelectedSchool: (schoolId: string | null) => void;
  existingQuota?: SchoolSportQuota;
  existingQuotas?: SchoolSportQuota[];
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
}

export function QuotaDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  onSubmitAll,
  schools,
  selectedSchool,
  setSelectedSchool,
  existingQuota,
  existingQuotas = [],
  title,
  description,
  submitLabel,
  isLoading,
}: QuotaDialogProps) {
  const SportquotaForm = useForm<SportQuotaFormValues>({
    resolver: zodResolver(sportQuotaFormSchema),
    defaultValues: {
      participant_quota: undefined,
      team_quota: undefined,
    },
  });

  useEffect(() => {
    if (existingQuota) {
      SportquotaForm.reset({
        participant_quota: existingQuota.participant_quota || undefined,
        team_quota: existingQuota.team_quota || undefined,
      });
    }
  }, [existingQuota, SportquotaForm]);

  const handleCancel = () => {
    onOpenChange(false);
    SportquotaForm.reset();
    setSelectedSchool(null);
  };

  // Calculate schools without quotas for "All Schools" option
  const schoolsWithoutQuotas =
    schools?.filter(
      (school) =>
        !existingQuotas.some((quota) => quota.school_id === school.school_id),
    ) || [];

  const schoolsWithQuotas =
    schools?.filter((school) =>
      existingQuotas.some((quota) => quota.school_id === school.school_id),
    ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un quota pour ce sport
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...SportquotaForm}>
          <form
            onSubmit={SportquotaForm.handleSubmit((values) => {
              if (selectedSchool === "all_schools" && onSubmitAll) {
                onSubmitAll(values);
              } else {
                onSubmit(values);
              }
            })}
            className="space-y-4 py-4"
          >
            <FormItem className="w-full">
              <FormLabel>École</FormLabel>
              <Select
                value={selectedSchool || ""}
                onValueChange={(value) => setSelectedSchool(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une école" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_schools">Toutes les écoles</SelectItem>
                  {schools?.map((school) => {
                    const hasQuota = !!existingQuota;
                    if (!hasQuota) {
                      return (
                        <SelectItem
                          key={school.school_id}
                          value={school.school_id}
                        >
                          {formatSchoolName(school.school.name)}
                        </SelectItem>
                      );
                    }
                    return null;
                  })}
                </SelectContent>
              </Select>
            </FormItem>

            {selectedSchool === "all_schools" &&
              schoolsWithQuotas.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Attention :</p>
                      <p>
                        {schoolsWithQuotas.length} école(s) ont déjà des quotas
                        pour ce sport et ne seront pas modifiées. Seules{" "}
                        {schoolsWithoutQuotas.length} école(s) sans quotas
                        recevront les nouveaux quotas.
                      </p>
                      {schoolsWithQuotas.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer font-medium">
                            Écoles avec quotas existants :
                          </summary>
                          <ul className="mt-1 ml-4 list-disc">
                            {schoolsWithQuotas.map((school) => (
                              <li key={school.school_id}>
                                {formatSchoolName(school.school.name)}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              )}

            <StyledFormField
              form={SportquotaForm}
              label="Quota de participants pour ce sport"
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
              form={SportquotaForm}
              label="Quota d'équipes pour ce sport"
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
                {selectedSchool === "all_schools"
                  ? `Appliquer aux ${schoolsWithoutQuotas.length} écoles sans quotas`
                  : submitLabel}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
