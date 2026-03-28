import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

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
        className="sm:max-w-[600px] m-0 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <ScrollArea className="max-h-[80vh] px-6">
          <DialogHeader className="pt-6 m-2">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="pb-6 m-2">
            {description}
          </DialogDescription>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
