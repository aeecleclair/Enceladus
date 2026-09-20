import { getErrorDescription, getErrorKey } from "@/lib/raid/errorTyping";

import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

/**
 * Returns a factory for react-query `onError` handlers.
 * `reportError("Erreur lors de X")` → `(error) => toast(...)`.
 */
export const useReportError = () => {
  const { toast } = useToast();
  const tApi = useTranslations("raid.apiErrors");

  return (title: string) => (error: unknown) => {
    console.error(error);
    const key = getErrorKey(error);
    toast({
      title,
      description: key
        ? tApi(key as never)
        : getErrorDescription(error, tApi("generic")),
      variant: "destructive",
    });
  };
};
