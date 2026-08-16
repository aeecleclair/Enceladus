import { CustomDialog } from "../common/CustomDialog";
import { LoadingButton } from "../common/LoadingButton";
import { TemplateEditModal } from "./TemplateEditModal";

import { Template } from "@/api";
import { useTemplate } from "@/hooks/my-documents/useTemplate";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Pencil } from "lucide-react";

export const TemplateCard = ({ template }: { template: Template }) => {
  const t = useTranslations("myDocuments");
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        router.push({
          pathname: "/admin/template",
          query: { templateId: template.id },
        });
      }}
    >
      <CardHeader>{template.name}</CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p>
            {t("home.documentCreation", {
              date: new Date(template.created_at).toLocaleDateString(),
            })}
          </p>
          <p>
            {t("home.documentUpdate", {
              date: new Date(template.updated_at).toLocaleDateString(),
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
