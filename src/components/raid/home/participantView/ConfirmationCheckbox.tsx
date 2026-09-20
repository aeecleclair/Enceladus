import { useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl, FormMessage } from "@/components/ui/form";

interface ConfirmationCheckboxProps {
  label: string;
  field: ControllerRenderProps<FieldValues, string>;
  needDialog: boolean;
}

export const ConfirmationCheckbox = ({
  label,
  field,
  needDialog,
}: ConfirmationCheckboxProps) => {
  const tCommon = useTranslations("raid.common");
  const t = useTranslations("raid.team.card");
  const [open, setIsOpen] = useState(false);

  function handleCheckboxChange() {
    if (needDialog) {
      setIsOpen(!open && !field.value);
    } else {
      field.onChange(!field.value);
    }
  }

  function handleCheckboxButtonClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    field.onChange(!field.value);
    setIsOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <div className="w-full col-span-4 text-right">
        <FormMessage />
        <FormControl>
          <Checkbox
            checked={field.value}
            onCheckedChange={() => {
              handleCheckboxChange();
            }}
          />
        </FormControl>
      </div>
      <DialogContent className="md:max-w-3xl top-1/2">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("honourStatement")}</DialogDescription>
        <div className="flex justify-end mt-2 space-x-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleCheckboxButtonClick}>{tCommon("validate")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
