import { CircularProgressBar } from "./CircularProgressBar";

import { Badge } from "@/components/ui/badge";

import { useTranslations } from "next-intl";

interface ProgressBadgeProps {
  progress: number;
  total: number;
}

export const ProgressBadge = ({ progress, total }: ProgressBadgeProps) => {
  const t = useTranslations("raid.home.badges");
  return (
    <div className="flex items-center w-30">
      <Badge variant="outline">
        <CircularProgressBar value={(progress / total) * 100} />
        <span className="ml-2">
          {progress} / {total} {t("validatedDocuments")}
        </span>
      </Badge>
    </div>
  );
};
