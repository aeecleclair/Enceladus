"use client";
import { RaidVolunteer } from "@/api";
import { useAdminVolunteers } from "@/hooks/raid/useAdminVolunteers";

import { useTranslations } from "next-intl";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

interface VolunteerRowActionsProps {
  volunteer: RaidVolunteer;
}

export const VolunteerRowActions = ({
  volunteer,
}: VolunteerRowActionsProps) => {
  const { validateVolunteer, cancelVolunteer, deleteVolunteer } =
    useAdminVolunteers();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = useTranslations("raid.admin.volunteers");
  const tc = useTranslations("raid.common");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!volunteer.validated && (
            <DropdownMenuItem
              onClick={() => validateVolunteer(volunteer.user_id)}
            >
              {t("actions.validate")}
            </DropdownMenuItem>
          )}
          {!volunteer.cancelled && (
            <DropdownMenuItem
              onClick={() => cancelVolunteer(volunteer.user_id)}
            >
              {t("actions.cancel")}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmDelete(true)}
            className="text-destructive"
          >
            {t("actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteVolunteer(volunteer.user_id);
                setConfirmDelete(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
