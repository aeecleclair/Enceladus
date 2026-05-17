"use client";
import { EditionForm } from "@/components/raid/admin/EditionForm";
import { editionFormSchema, EditionFormSchema } from "@/forms/raid/edition";
import { useEdition } from "@/hooks/raid/useEdition";
import { useHasRaidPermission } from "@/hooks/raid/useHasRaidPermission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarPlus } from "lucide-react";

const AdminFallback = () => {
  const { createEdition, isCreationLoading } = useEdition();
  const { isRaidAdmin } = useHasRaidPermission();

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    mode: "onChange",
  });

  const onSubmit = (values: EditionFormSchema) => {
    createEdition(
      {
        name: values.name,
        year: values.startDate.getFullYear(),
        start_date: values.startDate.toISOString().slice(0, 10),
        end_date: values.endDate.toISOString().slice(0, 10),
        registering_end_date: values.registeringEndDate
          ? values.registeringEndDate.toISOString().slice(0, 10)
          : null,
        active: true,
        inscription_enabled: false,
      },
      () => form.reset(),
    );
  };

  if (!isRaidAdmin) {
    return (
      <span className="flex h-full items-center justify-center px-4 text-sm text-muted-foreground">
        Veuillez patienter, l&apos;édition n&apos;est pas encore prête.
      </span>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
      <div className="rounded-2xl border border-border/70 bg-card/95 p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <CalendarPlus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Créer la première édition
            </h2>
            <p className="text-sm text-muted-foreground">
              Aucune édition active pour le moment. Créez-en une pour ouvrir
              les inscriptions participants et bénévoles.
            </p>
          </div>
        </div>
        <EditionForm
          form={form}
          isLoading={isCreationLoading}
          onSubmit={onSubmit}
          submitLabel="Créer l'édition"
        />
      </div>
    </div>
  );
};

export default AdminFallback;
