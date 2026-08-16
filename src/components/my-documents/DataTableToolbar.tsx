"use client";

import { CustomDialog } from "../common/CustomDialog";
import { TemplateDocuments } from "./DocumentDataTable";

import { Template, TemplateUseResponse } from "@/api";
import { useTemplate } from "@/hooks/my-documents/useTemplate";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { InfoIcon } from "lucide-react";

interface DataTableToolbarProps {
  table: Table<TemplateDocuments>;
  template: Template;
}

export function DataTableToolbar({ table, template }: DataTableToolbarProps) {
  const t = useTranslations("myDocuments");
  const { useTemplateForRecipients } = useTemplate(template.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [sendingResult, setSendingResult] =
    useState<TemplateUseResponse | null>(null);

  const isFiltered = table.getState().columnFilters.length > 0;

  const handleMassDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    console.log("Selected IDs for deletion:", selectedIds);
  };

  const handleCSVLoading = () => {
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
          setRecipients(mails);
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
          placeholder={t("template.searchPlaceholder")}
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
            {t("template.clearFilters")}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <CustomDialog
          isOpened={isModalOpen}
          setIsOpened={(value) => {
            setIsModalOpen(value);
            if (!value) {
              setAllowDuplicate(false);
              setSendingResult(null);
              setRecipients([]);
            }
          }}
          title={
            sendingResult
              ? t("template.use.results")
              : t("template.use.title", { name: template.name })
          }
          description={
            sendingResult ? (
              <div className="flex flex-col gap-2 mt-4">
                {sendingResult.documents &&
                  sendingResult.documents.length > 0 && (
                    <h3 className="font-semibold text-lg">
                      {t("template.use.success", {
                        count: sendingResult.documents.length,
                      })}
                    </h3>
                  )}
                {sendingResult.errors &&
                  Object.keys(sendingResult.errors).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-lg">
                        {t("template.use.errors", {
                          count: Object.keys(sendingResult.errors).length,
                        })}
                      </h3>
                      <ul className="list-disc list-inside max-h-[45vh] overflow-y-auto">
                        {Object.entries(sendingResult.errors).map(
                          ([email, error]) => (
                            <li key={email}>
                              {email}: {error}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSendingResult(null);
                    setRecipients([]);
                  }}
                >
                  {t("template.use.close")}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-row gap-2">
                  <Checkbox
                    className="border border-black"
                    onCheckedChange={(checked) => {
                      setAllowDuplicate(checked as boolean);
                    }}
                    defaultChecked={allowDuplicate}
                    checked={allowDuplicate}
                  />
                  <Label>{t("template.use.allowDuplicate")}</Label>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleCSVLoading();
                  }}
                >
                  {t("template.use.loadCSV")}
                </Button>
                {t("template.use.recipients", { count: recipients.length })}
                <Button
                  variant="secondary"
                  onClick={() => {
                    useTemplateForRecipients(
                      template.id,
                      recipients,
                      allowDuplicate,
                      (response) => {
                        setSendingResult(response);
                      },
                    );
                  }}
                  disabled={recipients.length === 0}
                >
                  {t("template.use.send")}
                </Button>
              </div>
            )
          }
        >
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {t("template.use.useTemplate")}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="ml-2 h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="text-center">
                  {t("template.useTooltip1")}
                  <br />
                  {t("template.useTooltip2")}
                  <br />
                  {t("template.useTooltip3")}
                </TooltipContent>
              </Tooltip>
            </div>
          </Button>
        </CustomDialog>

        {/* <Button
          variant="destructive"
          onClick={handleMassDelete}
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          Supprimer les documents sélectionnés
        </Button> */}
      </div>
    </div>
  );
}
