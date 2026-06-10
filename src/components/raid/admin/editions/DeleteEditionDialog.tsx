"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RaidEdition } from "@/api";
import { useEditions } from "@/hooks/raid/useEditions";
import { useTranslations } from "next-intl";

interface DeleteEditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edition: RaidEdition;
}

export const DeleteEditionDialog = ({
  open,
  onOpenChange,
  edition,
}: DeleteEditionDialogProps) => {
  const { deleteEdition, isDeleteLoading } = useEditions();
  const t = useTranslations("raid.admin.editions");
  const tc = useTranslations("raid.common");

  const handleDelete = () => {
    deleteEdition(edition.id, () => onOpenChange(false));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteConfirmTitle")} ?</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteConfirmDescription")} «&nbsp;{edition.name}&nbsp;»
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleteLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
