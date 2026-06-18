import { Answer, CustomFieldInput } from "./CustomFieldInput";

import { CustomDataFieldComplete } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomFieldsDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  isLoading: boolean;
  productFields: CustomDataFieldComplete[];
  onValidate: (answers: Record<string, Answer>) => void;
  sellerId: string;
  productId: string;
  userId: string;
  children?: React.ReactNode;
  onlyUserAnswerable?: boolean;
}

export const CustomFieldsDialog = ({
  isOpened,
  setIsOpened,
  isLoading,
  productFields,
  onValidate,
  sellerId,
  productId,
  userId,
  children,
  onlyUserAnswerable = false,
}: CustomFieldsDialogProps) => {
  const t = useTranslations("siarnaq");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      {children && <DialogTrigger className="w-full">{children}</DialogTrigger>}
      <DialogContent
        className="sm:max-w-150 m-0 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <ScrollArea className="max-h-[80vh] px-6">
          <DialogHeader className="pt-6 m-1">
            <DialogTitle>{t("customFieldsDialog.title")}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-6 m-1">
            {productFields
              .filter((field) =>
                onlyUserAnswerable ? field.can_user_answer : true,
              )
              .map((field) => (
                <CustomFieldInput
                  key={field.id}
                  field={field}
                  answers={answers}
                  setAnswers={setAnswers}
                  sellerId={sellerId}
                  productId={productId}
                  userId={userId}
                />
              ))}
            <div className="flex justify-end mt-4 space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsOpened(false)}
                disabled={isLoading}
                className="w-25"
              >
                {t("customFieldsDialog.cancel")}
              </Button>
              <LoadingButton
                isLoading={isLoading}
                className="w-25"
                type="button"
                onClick={() => onValidate(answers)}
              >
                {t("customFieldsDialog.validate")}
              </LoadingButton>
            </div>
          </DialogDescription>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
