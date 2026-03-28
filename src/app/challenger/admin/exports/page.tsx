"use client";

import { ExportsPage } from "@/src/components/admin/exports/Exports";

export default function EditionsPage() {
  return (
    <div className="space-y-6">
      {/* Header with title and action */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Exports</h1>
        </div>
        <p className="text-muted-foreground">
          Exportez les données de la compétition au format Excel selon vos
          besoins
        </p>
      </div>
      <ExportsPage />
    </div>
  );
}
