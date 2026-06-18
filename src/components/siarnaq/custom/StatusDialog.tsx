import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { JSX } from "react";
import { HiCheck, HiXMark } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogStatus = "SUCCESS" | "ERROR";

interface StatusDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  title: string;
  description: string | JSX.Element;
  width?: string;
  callback: () => void;
  status?: DialogStatus;
}

export const StatusDialog = ({
  isOpened,
  setIsOpened,
  title,
  description,
  status,
  callback,
  width = "w-[100px]",
}: StatusDialogProps) => {
  const t = useTranslations("common");
  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    callback();
    setIsOpened(false);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogContent
        className="sm:max-w-150"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="h-20">
            <div className="mt-16">{title}</div>
            <div
              className={`${
                status === "SUCCESS" ? "bg-green-600" : "bg-red-600"
              } w-52 h-52 rounded-full relative -top-52 mx-auto`}
            >
              {status === "SUCCESS" ? (
                <HiCheck className="text-white w-32 h-32 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <HiXMark className="text-white w-32 h-32 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <div className="flex justify-end mt-2 space-x-4">
          <Button variant="outline" onClick={closeDialog} className={width}>
            {t("statusDialog.continue")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
