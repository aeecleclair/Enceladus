import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

import { Button } from "../ui/button";
import { DropzoneInput } from "../ui/dropzoneInput";
import Image from "next/image";
import { useDocument } from "@/src/hooks/useDocument";
import { RegisteringFormValues } from "@/src/forms/registering";
import { se } from "date-fns/locale";
import { on } from "events";
import { useAuth } from "@/src/hooks/useAuth";

interface DocumentDialogProps {
  setIsOpen: (value: boolean) => void;
  field: ControllerRenderProps<FieldValues, string>;
  sportId?: string;
  onFileSet?: (file: File) => void;
  onFileRemove?: () => void;
}

export const DocumentDialog = ({
  setIsOpen,
  field,
  sportId,
  onFileRemove,
  onFileSet,
}: DocumentDialogProps) => {
  const { userId } = useAuth();
  const { data } = useDocument(userId);

  return (
    <>
      {data?.size !== undefined ? (
        <div className="flex flex-col items-center gap-4">
          {data?.type === "application/pdf" ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const url = URL.createObjectURL(data);
                const a = document.createElement("a");
                a.href = url;
                a.download = data.name || "document.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Télécharger le PDF
            </Button>
          ) : (
            <Image
              src={URL.createObjectURL(data)}
              alt={field.name}
              width={300}
              height={200}
              className="rounded-lg w-auto max-h-[400px]"
            />
          )}
          <Button
            className="w-full"
            onClick={() => {
              field.onChange(null);
              onFileRemove?.();
            }}
          >
            Modifier
          </Button>
        </div>
      ) : (
        <>
          {sportId ? (
            <DropzoneInput
              setIsOpen={setIsOpen}
              onDropAccepted={(files, _) => {
                const file = files[0];
                onFileSet?.(file);
              }}
            />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Veuillez d&apos;abord sélectionner un sport
            </div>
          )}
        </>
      )}
    </>
  );
};
