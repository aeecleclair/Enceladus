import { DialogDescription } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { HiCheck, HiX } from "react-icons/hi";

const DialogStatus = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

interface StatusDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  title: string;
  description: string | JSX.Element;
  width?: string;
  callback: () => void;
  status?: keyof typeof DialogStatus;
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
  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    callback();
    setIsOpened(false);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogContent
        className="sm:max-w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="h-20">
            <div className="mt-16">{title}</div>
            <div
              className={`${status === "SUCCESS" ? "bg-green-600" : "bg-red-600"} w-52 h-52 rounded-full relative -top-52 mx-auto`}
            >
              {status === "SUCCESS" ? (
                <HiCheck className="text-white w-32 h-32 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <HiX className="text-white w-32 h-32 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <div className="flex justify-end mt-2 space-x-4">
          <Button variant="outline" onClick={closeDialog} className={width}>
            Continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
