import { z } from "zod";

export const nullableInteger = (message?: string) => {
  return z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined) return true;
        const num = Number(val);
        return Number.isInteger(num) && num >= 0;
      },
      {
        message,
      },
    )
    .transform((val) => (val === undefined ? undefined : Number(val)));
};
