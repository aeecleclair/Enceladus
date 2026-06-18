"use client";

import { EditionForm } from "../EditionForm";

import type * as Schemas from "@/api";
import {
  type EditionFormSchema,
  editionFormSchema,
} from "@/forms/challenger/edition";
import { useEditions } from "@/hooks/challenger/useEditions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditEditionDialogProps {
  open: boolean;
  edition: Schemas.CompetitionEdition;
  onClose: () => void;
}

export const EditEditionDialog = ({
  open,
  edition,
  onClose,
}: EditEditionDialogProps) => {
  const { updateEdition, isUpdateLoading } = useEditions();

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: {
      name: edition.name,
      startDate: new Date(edition.start_date),
      endDate: new Date(edition.end_date),
    },
  });

  const handleSubmit = (values: EditionFormSchema) => {
    updateEdition(
      edition.id,
      {
        name: values.name,
        year: values.startDate.getFullYear(),
        start_date: values.startDate.toISOString(),
        end_date: values.endDate.toISOString(),
      },
      onClose,
    );
  };

  const handleClose = () => {
    if (!isUpdateLoading) {
      // Reset to original values
      form.reset({
        name: edition.name,
        startDate: new Date(edition.start_date),
        endDate: new Date(edition.end_date),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;édition</DialogTitle>
          <DialogDescription>
            Modifiez les détails de l&apos;édition {edition.name}.
          </DialogDescription>
        </DialogHeader>

        <EditionForm
          form={form}
          isLoading={isUpdateLoading}
          onSubmit={handleSubmit}
          submitLabel="Sauvegarder les modifications"
        />
      </DialogContent>
    </Dialog>
  );
};
