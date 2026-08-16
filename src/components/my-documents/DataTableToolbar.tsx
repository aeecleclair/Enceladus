"use client";

import { TemplateDocuments } from "./DocumentDataTable";

import { Template } from "@/api";
import { useTemplate } from "@/hooks/my-documents/useTemplate";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  table: Table<TemplateDocuments>;
  template: Template;
}

export function DataTableToolbar({ table, template }: DataTableToolbarProps) {
  const { useTemplateForRecipients } = useTemplate(template.id);

  const isFiltered = table.getState().columnFilters.length > 0;

  const handleMassDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    console.log("Selected IDs for deletion:", selectedIds);
  };

  const handleMassCSVSending = () => {
    const CSVInput = document.createElement("input");
    CSVInput.type = "file";
    CSVInput.accept = ".csv";
    CSVInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvContent = e.target?.result as string;
          const mails = csvContent.split("\n").map((line) => line.trim());
          useTemplateForRecipients(template.id, mails);
        };
        reader.readAsText(file);
      }
    };
    CSVInput.click();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={
            (table.getColumn("searchField")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("searchField")?.setFilterValue(event.target.value)
          }
          className="h-8 max-w-sm"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Supprimer les filtres
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            handleMassCSVSending();
          }}
        >
          Générer des documents à partir d'un CSV
        </Button>

        <Button
          variant="destructive"
          onClick={handleMassDelete}
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          Supprimer les documents sélectionnés
        </Button>
      </div>
    </div>
  );
}
