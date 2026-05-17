"use client";

import { EditionCard } from "@/components/raid/admin/editions/EditionCard";
import { EditEditionDialog } from "@/components/raid/admin/editions/EditEditionDialog";
import { DeleteEditionDialog } from "@/components/raid/admin/editions/DeleteEditionDialog";
import { EditionForm } from "@/components/raid/admin/EditionForm";
import { PageHeader } from "@/components/raid/admin/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { editionFormSchema, EditionFormSchema } from "@/forms/raid/edition";
import { useEditions } from "@/hooks/raid/useEditions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RaidEdition } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";

const EditionsPage = () => {
  const { editions, isLoading, createEdition, isCreateLoading } = useEditions();
  const [editingEdition, setEditingEdition] = useState<RaidEdition | null>(
    null,
  );
  const [deletingEdition, setDeletingEdition] = useState<RaidEdition | null>(
    null,
  );

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
  });

  const onCreate = (values: EditionFormSchema) => {
    createEdition(
      {
        name: values.name,
        year: values.startDate.getFullYear(),
        start_date: values.startDate.toISOString().slice(0, 10),
        end_date: values.endDate.toISOString().slice(0, 10),
        registering_end_date: values.registeringEndDate
          ? values.registeringEndDate.toISOString().slice(0, 10)
          : null,
        active: !editions || editions.length === 0,
        inscription_enabled: false,
      },
      () => form.reset(),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarDays}
        title="Éditions"
        description="Gérez les éditions et l'ouverture des inscriptions."
        accent="amber"
      />
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader>
          <CardTitle>Créer une édition</CardTitle>
          <CardDescription>
            Chaque édition regroupe les participants et bénévoles d&apos;une
            année.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditionForm
            form={form}
            isLoading={isCreateLoading}
            onSubmit={onCreate}
            submitLabel="Créer l'édition"
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Éditions existantes
        </h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : !editions || editions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune édition pour le moment.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {editions.map((edition) => (
              <EditionCard
                key={edition.id}
                edition={edition}
                onEdit={setEditingEdition}
                onDelete={setDeletingEdition}
              />
            ))}
          </div>
        )}
      </div>

      {editingEdition && (
        <EditEditionDialog
          open={!!editingEdition}
          onOpenChange={(open) => !open && setEditingEdition(null)}
          edition={editingEdition}
        />
      )}
      {deletingEdition && (
        <DeleteEditionDialog
          open={!!deletingEdition}
          onOpenChange={(open) => !open && setDeletingEdition(null)}
          edition={deletingEdition}
        />
      )}
    </div>
  );
};

export default EditionsPage;
