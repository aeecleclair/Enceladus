import { JSX } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  title: string;
  description: string | JSX.Element;
  children?: React.ReactNode;
  isFullWidth?: boolean;
}

export const CustomDialog = ({
  isOpened,
  setIsOpened,
  title,
  description,
  children,
  isFullWidth,
}: CustomDialogProps) => {
  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger className={isFullWidth ? "w-full" : ""}>
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-150 m-0 p-0"
        onClick={(e: { stopPropagation(): void }) => e.stopPropagation()}
      >
        <ScrollArea className="max-h-[80vh] px-6">
          <DialogHeader className="pt-6 m-1">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="pb-6 m-1">
            {description}
          </DialogDescription>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
