"use client";

import { RaidEdition } from "@/api";
import { PageHeader } from "@/components/raid/admin/PageHeader";
import { CreateEditionDialog } from "@/components/raid/admin/editions/CreateEditionDialog";
import { DeleteEditionDialog } from "@/components/raid/admin/editions/DeleteEditionDialog";
import { EditEditionDialog } from "@/components/raid/admin/editions/EditEditionDialog";
import { EditionCard } from "@/components/raid/admin/editions/EditionCard";
import { useEditions } from "@/hooks/raid/useEditions";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CalendarDays, Plus } from "lucide-react";

const EditionsPage = () => {
  const { editions, isLoading } = useEditions();
  const [editingEdition, setEditingEdition] = useState<RaidEdition | null>(
    null,
  );
  const [deletingEdition, setDeletingEdition] = useState<RaidEdition | null>(
    null,
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const t = useTranslations("raid.admin.editions");

  const isFirstEdition = !editions || editions.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarDays}
        title={t("title")}
        description={t("subtitle")}
        accent="amber"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("existing")}
        </h2>
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("create")}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : isFirstEdition ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
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

      <CreateEditionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isFirstEdition={isFirstEdition}
      />
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
