import { getErrorDescription } from "@/lib/raid/errorTyping";

import { useToast } from "@/components/ui/use-toast";

/**
 * Returns a factory for react-query `onError` handlers.
 * `reportError("Erreur lors de X")` → `(error) => toast(...)`.
 */
export const useReportError = () => {
  const { toast } = useToast();

  return (title: string) => (error: unknown) => {
    console.error(error);
    toast({
      title,
      description: getErrorDescription(error),
      variant: "destructive",
    });
  };
};
