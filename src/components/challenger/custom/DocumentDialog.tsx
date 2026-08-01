import { useDocument } from "@/hooks/challenger/useDocument";
import { useAuth } from "@/hooks/useAuth";

import Image from "next/image";
import { useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DropzoneInput } from "@/components/ui/dropzoneInput";

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
  // The stored certificate stays available until it is replaced: without this
  // flag, "Modifier" kept displaying the previous document and no new file
  // could ever be deposited.
  const [isReplacing, setIsReplacing] = useState(false);

  return (
    <>
      {data?.size !== undefined && !isReplacing ? (
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
              className="rounded-lg w-auto max-h-100"
            />
          )}
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              field.onChange(null);
              onFileRemove?.();
              setIsReplacing(true);
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
              onDropAccepted={(files) => {
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
