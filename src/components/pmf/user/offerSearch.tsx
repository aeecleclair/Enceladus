import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface UserSearchProps {
  globalFilter: string,
  setGlobalFilter: (value: string) => void;
}

export const OfferSearch = ({
  globalFilter,
  setGlobalFilter,
}: UserSearchProps) => {
  const t = useTranslations("pmf")

  return (
    <Input
      placeholder={t("OfferSearch.search")}
      value={globalFilter}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        setGlobalFilter(event.target.value)
      }
      className="h-8 w-37.5 lg:w-62.5"
    />
  );
};