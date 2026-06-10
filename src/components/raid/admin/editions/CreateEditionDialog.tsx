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
import { useTranslations } from "next-intl";

interface CreateEditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFirstEdition: boolean;
}

export const CreateEditionDialog = ({
  open,
  onOpenChange,
  isFirstEdition,
}: CreateEditionDialogProps) => {
  const { createEdition, isCreateLoading } = useEditions();
  const t = useTranslations("raid.admin.editions");

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
  });

  const onSubmit = (values: EditionFormSchema) => {
    createEdition(
      {
        ...editionFormToBody(values),
        active: isFirstEdition,
        inscription_enabled: false,
      },
      () => {
        form.reset();
        onOpenChange(false);
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("create")}</DialogTitle>
          <DialogDescription>{t("createDescription")}</DialogDescription>
        </DialogHeader>
        <EditionForm
          form={form}
          isLoading={isCreateLoading}
          onSubmit={onSubmit}
          submitLabel={t("create")}
        />
      </DialogContent>
    </Dialog>
  );
};
