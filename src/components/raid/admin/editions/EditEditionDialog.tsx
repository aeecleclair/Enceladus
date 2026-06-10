"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditionForm } from "@/components/raid/admin/EditionForm";
import {
  editionFormSchema,
  EditionFormSchema,
  editionFormToBody,
} from "@/forms/raid/edition";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditions } from "@/hooks/raid/useEditions";
import { RaidEdition } from "@/api";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface EditEditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edition: RaidEdition;
}

export const EditEditionDialog = ({
  open,
  onOpenChange,
  edition,
}: EditEditionDialogProps) => {
  const { updateEdition, isUpdateLoading } = useEditions();
  const t = useTranslations("raid.admin.editions");

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: {
      name: edition.name,
      startDate: edition.start_date ? new Date(edition.start_date) : undefined,
      endDate: edition.end_date ? new Date(edition.end_date) : undefined,
      registeringEndDate: edition.registering_end_date
        ? new Date(edition.registering_end_date)
        : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: edition.name,
      startDate: edition.start_date ? new Date(edition.start_date) : undefined,
      endDate: edition.end_date ? new Date(edition.end_date) : undefined,
      registeringEndDate: edition.registering_end_date
        ? new Date(edition.registering_end_date)
        : undefined,
    });
  }, [edition, form]);

  const onSubmit = (values: EditionFormSchema) => {
    updateEdition(edition.id, editionFormToBody(values), () =>
      onOpenChange(false),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("edit")}</DialogTitle>
          <DialogDescription>{t("editDescription")}</DialogDescription>
        </DialogHeader>
        <EditionForm
          form={form}
          isLoading={isUpdateLoading}
          onSubmit={onSubmit}
          submitLabel={t("save")}
        />
      </DialogContent>
    </Dialog>
  );
};
