"use client";

import { useDocument } from "@/src/hooks/useDocument";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useState } from "react";

interface DocumentViewProps {
  documentKey: string;
  userId: string;
  username?: string;
}

export const DocumentView = ({
  documentKey,
  userId,
  username,
}: DocumentViewProps) => {
  const { data } = useDocument(userId);
  const [isLoading, setIsLoading] = useState(data?.size === undefined);

  if (data?.size !== undefined && isLoading) {
    setIsLoading(false);
  }

  return (
    <>
      {data?.size ? (
        data.type === "application/pdf" ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const url = URL.createObjectURL(data);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${username || "document"}.pdf`;
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
            alt={documentKey}
            width={300}
            height={200}
            className="rounded-lg w-auto max-h-[400px] m-auto"
          />
        )
      ) : (
        <Skeleton className="w-full h-80" />
      )}
    </>
  );
};
