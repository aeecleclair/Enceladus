"use client";

import { EditionForm } from "../EditionForm";

import {
  type EditionFormSchema,
  editionFormSchema,
} from "@/forms/challenger/edition";
import { useEditions } from "@/hooks/challenger/useEditions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateEditionDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateEditionDialog = ({
  open,
  onClose,
}: CreateEditionDialogProps) => {
  const { createEdition, isCreateLoading } = useEditions();

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const handleSubmit = (values: EditionFormSchema) => {
    createEdition(
      {
        name: values.name,
        year: values.startDate.getFullYear(),
        start_date: values.startDate.toISOString(),
        end_date: values.endDate.toISOString(),
        active: false,
        inscription_enabled: false,
      },
      () => {
        form.reset();
        onClose();
      },
    );
  };

  const handleClose = () => {
    if (!isCreateLoading) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle édition</DialogTitle>
          <DialogDescription>
            Configurez les détails de la nouvelle édition du Challenge.
          </DialogDescription>
        </DialogHeader>

        <EditionForm
          form={form}
          isLoading={isCreateLoading}
          onSubmit={handleSubmit}
          submitLabel="Créer l'édition"
        />
      </DialogContent>
    </Dialog>
  );
};
