import { cn } from "@/lib/utils";
import { set } from "date-fns";
import { useState } from "react";
import Dropzone, { DropEvent, Accept } from "react-dropzone";

interface DropzoneInputProps {
  onDropAccepted: (files: File[], event: DropEvent) => void;
  setIsOpen: (isOpen: boolean) => void;
  multiple?: boolean;
  maxSize?: number;
  accept?: Accept;
}

export const DropzoneInput = ({
  setIsOpen,
  onDropAccepted,
  multiple = false,
  maxSize = 10485760,
  accept = {
    "image/*": [".jpg", ".jpeg", ".png"],
    "application/pdf": [".pdf"],
  },
}: DropzoneInputProps) => {
  const [isDropRejected, setIsDropRejected] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const maxSizeInMo = maxSize / 1000000;
  const supportedTypes = Object.values(accept)
    .map((types) => types.map((type) => type.replaceAll(".", "")).join(", "))
    .join(", ");

  return (
    <Dropzone
      accept={accept}
      onDropAccepted={(files, event) => {
        setIsDropRejected(false);
        setIsOpen(false);
        onDropAccepted(files, event);
      }}
      onDropRejected={(files, _) => {
        const file = files[0];
        if (file.file.size > maxSize) {
          setRejectionMessage(`Fichier trop lourd (max: ${maxSizeInMo}Mo)`);
        } else {
          setRejectionMessage(
            `Type de fichier non supporté (supporté: ${supportedTypes})`,
          );
        }
        setIsDropRejected(true);
      }}
      multiple={multiple}
      maxSize={maxSize}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          {isDropRejected && (
            <span className="text-red-600 font-medium">{rejectionMessage}</span>
          )}
          <div
            {...getRootProps({
              className: cn(
                `container flex flex-col items-center justify-center w-full h-48 border-2 ${isDropRejected ? "border-red-600" : "border-gray-300"} border-dashed rounded-lg cursor-pointer`,
              ),
            })}
          >
            <div className="flex flex-col items-center gap-x-3 mt-2 mb-2">
              <span className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="font-medium text-gray-600">
                  Glissez et déposez votre fichier ici ou{" "}
                  <span className="text-blue-600 underline">
                    sélectionnez un fichier
                  </span>
                </span>
              </span>
              <input {...getInputProps()} />
            </div>
          </div>
        </>
      )}
    </Dropzone>
  );
};
