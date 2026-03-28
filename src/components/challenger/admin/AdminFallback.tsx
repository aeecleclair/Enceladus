"use client";

import EditionForm from "@/components/challenger/admin/EditionForm";
import {
  EditionFormSchema,
  editionFormSchema,
} from "@/forms/challenger/edition";
import { useEdition } from "@/hooks/challenger/useEdition";
import { useHasChallengerPermission } from "@/hooks/challenger/useHasChallengerPermission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const AdminFallback = () => {
  const { createEdition, isCreationLoading } = useEdition();
  const { isChallengerAdmin } = useHasChallengerPermission();

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: {},
    mode: "onChange",
  });

  function onSubmit(values: EditionFormSchema) {
    createEdition(
      {
        name: values.name,
        start_date: values.startDate.toISOString(),
        end_date: values.endDate.toISOString(),
        year: values.startDate.getFullYear(),
        active: true,
      },
      () => {
        form.reset();
      },
    );
  }

  return (
    <>
      {isChallengerAdmin ? (
        <div className="flex h-full w-full flex-col p-6">
          <span className="text-2xl font-bold mb-4">Créer une édition</span>
          <EditionForm
            form={form}
            isLoading={isCreationLoading}
            onSubmit={onSubmit}
            submitLabel="Créer l'édition"
          />
        </div>
      ) : (
        <span className="text-sm text-muted-foreground px-4 justify-center items-center flex h-full">
          Veuillez patienter, l&apos;édition n&apos;est pas encore prête.
        </span>
      )}
    </>
  );
};

export default AdminFallback;
