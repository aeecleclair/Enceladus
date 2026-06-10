import { LoadingButton } from "@/components/common/LoadingButton";

import { useState } from "react";

interface DocumentValidationButtonProps {
  validateDocument: (callback: () => void) => void;
  label: string;
}

export const DocumentValidationButton = ({
  validateDocument,
  label,
}: DocumentValidationButtonProps) => {
  const [isValidationLoading, setIsValidationLoading] = useState(false);
  return (
    <LoadingButton
      isLoading={isValidationLoading}
      className="w-full"
      onClick={() => {
        setIsValidationLoading(true);
        validateDocument(() => {
          setIsValidationLoading(false);
        });
      }}
    >
      {label}
    </LoadingButton>
  );
};
