import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { OfferSearch } from "./OfferSearch";

interface SidePanelProps {
  globalFilter: string,
}

export default function SidePanel({
  globalFilter,
}: SidePanelProps) {
  const t = useTranslations("pmf");
  const router = useRouter();
  return (
    <div>
      <OfferSearch
        globalFilter={globalFilter}
      />
      <Button
        variant="default"
        onClick={() => router.push(`/new`)}
        className=""
        size="default"
      >
        {t("SidePanel.new")}
      </Button>
    </div>
  )
}