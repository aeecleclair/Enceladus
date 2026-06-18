import { LoadingButton } from "@/components/common/LoadingButton";

import { DialogDescription } from "@radix-ui/react-dialog";
import { JSX } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WarningDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  isLoading: boolean;
  title: string;
  description: string | JSX.Element;
  validateLabel?: string;
  callback?: () => void;
  width?: string;
  customButton?: JSX.Element;
}

export const WarningDialog = ({
  isOpened,
  setIsOpened,
  isLoading,
  title,
  description,
  validateLabel,
  callback,
  width = "w-[100px]",
  customButton,
}: WarningDialogProps) => {
  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }

  function onValidate(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (callback) callback();
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogContent
        className="sm:max-w-150"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <div className="flex justify-end mt-2 space-x-4">
          <Button
            variant="outline"
            onClick={closeDialog}
            disabled={isLoading}
            className={width}
          >
            Annuler
          </Button>
          {customButton ?? (
            <LoadingButton
              isLoading={isLoading}
              onClick={onValidate}
              className={width}
            >
              {validateLabel ?? "Valider"}
            </LoadingButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
