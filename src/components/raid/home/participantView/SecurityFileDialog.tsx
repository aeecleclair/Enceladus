import { SecurityFile } from "@/api";
import {
  ParticipantField,
  ValueTypes,
} from "@/components/raid/custom/ParticipantField";
import { useSecurityFile } from "@/hooks/raid/useSecurityFile";

import { useTranslations } from "next-intl";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { HiCheck, HiX } from "react-icons/hi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { BadgeAlertIcon, ClockIcon, ShieldCheckIcon } from "lucide-react";

interface SecurityFileDialogProps {
  setIsOpen: (value: boolean) => void;
  participantId: string;
  form: UseFormReturn<FieldValues>;
}

export const SecurityFileDialog = ({
  setIsOpen,
  participantId,
  form,
}: SecurityFileDialogProps) => {
  const { setSecurityFile } = useSecurityFile();
  const t = useTranslations("raid.team.securityFile");

  const validation = form.watch("securityFile.validation");
  const isValidated = validation === "accepted";
  const isRefused = validation === "refused";
  const isTemporary = validation === "temporary";
  const isPending = !isValidated && !isRefused && !isTemporary;

  const isFieldMissing = form.formState.errors["securityFile"] !== undefined;

  const consentGiven = form.watch("securityFile.consent_given");

  function onValidate() {
    form.setValue("securityFile.updated", true);
    const securityFile: SecurityFile = {
      ...form.getValues("securityFile"),
    };
    setSecurityFile(securityFile, participantId, () => {
      // Not working, to investigate
    });
    setIsOpen(false);
  }

  function getAsthma() {
    return (
      <>
        <ParticipantField
          label={t("asthma")}
          id="securityFile.asthma"
          form={form}
          type={ValueTypes.BOOLEAN}
        />
        {form.watch("securityFile.asthma") && (
          <>
            <ParticipantField
              label={t("intensiveCare")}
              id="securityFile.intensive_care_unit"
              form={form}
              type={ValueTypes.BOOLEAN}
            />
            {form.watch("securityFile.intensive_care_unit") && (
              <>
                <ParticipantField
                  label={t("intensiveCareDate")}
                  id="securityFile.intensive_care_unit_when"
                  form={form}
                  type={ValueTypes.STRING}
                />
              </>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="medical">
          <AccordionTrigger>
            <div className="flex flex-row mr-auto items-center">
              {t("medicalInfo")}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <FormField
                control={form.control}
                name="securityFile.consent_given"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          <ShieldCheckIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <FormLabel className="font-semibold text-base">
                            {t("consentLabel")}
                          </FormLabel>
                          <FormDescription className="mt-1 text-sm">
                            {t("consentDescription")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(value) => field.onChange(value)}
                            className="h-5 w-5"
                          />
                        </FormControl>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {consentGiven && (
                <>
                  <ParticipantField
                    label={t("allergy")}
                    id="securityFile.allergy"
                    form={form}
                    type={ValueTypes.STRING}
                    className="py-1.5"
                  />
                  {getAsthma()}
                  <ParticipantField
                    label={t("ongoingTreatment")}
                    id="securityFile.ongoing_treatment"
                    form={form}
                    type={ValueTypes.STRING}
                    className="py-1.5"
                  />
                  <ParticipantField
                    label={t("sicknesses")}
                    id="securityFile.sicknesses"
                    form={form}
                    type={ValueTypes.STRING}
                    className="py-1.5"
                  />
                  <ParticipantField
                    label={t("hospitalization")}
                    id="securityFile.hospitalization"
                    form={form}
                    type={ValueTypes.STRING}
                    className="py-1.5"
                  />
                  <ParticipantField
                    label={t("surgicalOperation")}
                    id="securityFile.surgical_operation"
                    form={form}
                    type={ValueTypes.STRING}
                    className="py-1.5"
                  />
                  <ParticipantField
                    label={t("trauma")}
                    id="securityFile.trauma"
                    form={form}
                    type={ValueTypes.STRING}
                    className="py-1.5"
                  />
                  <ParticipantField
                    label={t("family")}
                    id="securityFile.family"
                    form={form}
                    type={ValueTypes.STRING}
                    className="py-1.5"
                  />
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="emergencyPerson">
          <AccordionTrigger>
            <div
              className={`flex flex-row mr-auto items-center ${
                isFieldMissing && "text-destructive"
              }`}
            >
              {isValidated && <HiCheck className="mr-4" />}
              {isRefused && <HiX className="mr-4" />}
              {isTemporary && <BadgeAlertIcon className="mr-4 h-4 w-4" />}
              {isPending && <ClockIcon className="mr-4 h-4 w-4" />}
              {t("emergencyPerson")}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ParticipantField
              label={t("emergencyFirstname")}
              id="securityFile.emergency_person_firstname"
              form={form}
              type={ValueTypes.STRING}
            />
            <ParticipantField
              label={t("emergencyName")}
              id="securityFile.emergency_person_name"
              form={form}
              type={ValueTypes.STRING}
            />
            <ParticipantField
              label={t("emergencyPhone")}
              id="securityFile.emergency_person_phone"
              form={form}
              type={ValueTypes.PHONE}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button className="mt-6" type="button" onClick={onValidate}>
        {t("validate")}
      </Button>
    </div>
  );
};
