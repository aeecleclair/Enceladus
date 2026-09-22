import { LoadingButton } from "@/components/common/LoadingButton";

import { useState } from "react";

interface DocumentValidationButtonProps {
  validateDocument: (callback: () => void) => void;
  label: string;
  className?: string;
}

export const DocumentValidationButton = ({
  validateDocument,
  label,
  className = "flex-1",
}: DocumentValidationButtonProps) => {
  const [isValidationLoading, setIsValidationLoading] = useState(false);
  return (
    <LoadingButton
      isLoading={isValidationLoading}
      className={className}
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
