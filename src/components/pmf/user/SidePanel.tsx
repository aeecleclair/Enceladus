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
    <div className="">
      <OfferSearch
        globalFilter={globalFilter}
      />
      <div className="mt-10 flex justify-center mr-2">
        <Button
          variant="default"
          onClick={() => router.push(`/new`)}
          className=""
          size="lg"
        >
          {t("SidePanel.new")}
        </Button>
      </div>
    </div>
  )
}