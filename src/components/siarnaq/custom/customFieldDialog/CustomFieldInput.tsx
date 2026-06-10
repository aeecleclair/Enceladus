import { CustomDataFieldComplete } from "@/api";
import { useSellerProductUserData } from "@/hooks/siarnaq/useSellerProductUserData";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Answer {
  value: string;
  isNew: boolean;
}

interface CustomFieldInputProps {
  field: CustomDataFieldComplete;
  answers: Record<string, Answer>;
  setAnswers: Dispatch<SetStateAction<Record<string, Answer>>>;
  sellerId: string;
  productId: string;
  userId: string;
}

export const CustomFieldInput = ({
  field,
  answers,
  setAnswers,
  sellerId,
  productId,
  userId,
}: CustomFieldInputProps) => {
  const { response } = useSellerProductUserData(
    sellerId,
    productId,
    userId,
    field.id,
  );
  useEffect(() => {
    if ("value" in response) {
      setAnswers((prev) => ({
        ...prev,
        [field.id]: {
          value: response.value,
          isNew: false,
        },
      }));
    }
  }, [field.id, response, setAnswers]);

  return (
    <div key={field.id} className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{field.name}</Label>
      <Input
        type="text"
        className="w-full p-2 border border-border rounded-md"
        value={answers[field.id]?.value ?? ""}
        onChange={(e) =>
          setAnswers((prev) => ({
            ...prev,
            [field.id]: {
              value: e.target.value,
              isNew: prev[field.id]?.isNew ?? true,
            },
          }))
        }
      />
    </div>
  );
};
