import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { OfferSearch } from "./offerSearch";

interface SidePanelProps {
  globalFilter: string,
  setGlobalFilter: (value: string) => void,
}

export default function SidePanel({
  globalFilter,
  setGlobalFilter
}: SidePanelProps) {
  const locale = useLocale();
  const t = useTranslations("pmf");
  const router = useRouter();
  return (
    <div>
      <OfferSearch
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Button
        variant="default"
        onClick={() => router.push(`/${locale}/new`)}
        className=""
        size="default"
      >
        {t("SidePanel.new")}
      </Button>
    </div>
  )
}