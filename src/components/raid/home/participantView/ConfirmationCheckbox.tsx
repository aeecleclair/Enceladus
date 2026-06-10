import { useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

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
            onCheckedChange={(value) => {
              handleCheckboxChange();
            }}
          />
        </FormControl>
      </div>
      <DialogContent className="md:max-w-3xl top-1/2">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {
            "En cochant cette case, vous certifiez sur l'honneur que les informations que vous avez renseignées sont exactes, que vous avez bien lu et compris le règlement de la compétition, et que vous vous engagez à le respecter."
          }
        </DialogDescription>
        <div className="flex justify-end mt-2 space-x-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleCheckboxButtonClick}>Valider</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
