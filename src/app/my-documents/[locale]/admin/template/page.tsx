"use client";
import { CustomDialog } from "@/components/common/CustomDialog";
import { LoadingButton } from "@/components/common/LoadingButton";
import { DocumentDataTable } from "@/components/my-documents/DocumentDataTable";
import { useTemplate } from "@/hooks/my-documents/useTemplate";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ArrowLeft } from "lucide-react";

export default function Home() {
  const t = useTranslations("myDocuments");
  const params = useSearchParams();
  const templateId = params.get("templateId") || "";
  const { template } = useTemplate(templateId);
  const router = useRouter();
  const tCommon = useTranslations("common");
  const { editTemplate, isEditLoading } = useTemplate(template.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentDirectoryId, setDocumentDirectoryId] = useState(
    template.document_directory_id ?? "",
  );

  const documentData = useMemo(
    () =>
      template.documents.map((doc, index) => ({
        id: doc.id,
        documenso_id: doc.documenso_id,
        template_id: doc.template_id,
        user_id: doc.user_id,
        user: {
          fullName: `${doc.user.firstname} ${doc.user.name}`,
          email: doc.user.email,
          id: doc.user_id,
        },
        name: doc.name,
        status: doc.status,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        module: doc.module,
      })),
    [template.documents],
  );

  if (!template) {
    router.push({
      pathname: "/admin",
    });
    return;
  }

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between pb-8">
        <div className="flex flex-row gap-4 items-center">
          <Button variant="secondary" onClick={() => router.push(`/admin`)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">
            {t("admin.template", { name: template.name })}
          </h1>
        </div>
        <CustomDialog
          isOpened={isModalOpen}
          setIsOpened={setIsModalOpen}
          title={t("template.edit", { name: template.name })}
          description={
            <div className="flex flex-col gap-4 mt-4">
              <Label>{t("template.documentDirectoryId")}</Label>
              <Input
                onChange={(e) => {
                  setDocumentDirectoryId(e.target.value);
                }}
                defaultValue={template.document_directory_id ?? ""}
              />
              <div className="flex justify-end mt-2 space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isEditLoading}
                  className="w-25"
                >
                  {tCommon("form.cancel")}
                </Button>
                <LoadingButton
                  isLoading={isEditLoading}
                  className="w-25"
                  type="button"
                  onClick={() => {
                    editTemplate(template.id, documentDirectoryId);
                  }}
                >
                  {tCommon("form.edit")}
                </LoadingButton>
              </div>
            </div>
          }
        >
          <Button size="icon" variant="outline" className="w-10">
            <HiOutlinePencil className="h-5 w-5" />
          </Button>
        </CustomDialog>
      </div>
      <DocumentDataTable data={documentData} template={template} />
    </div>
  );
}
