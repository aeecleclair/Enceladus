import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RangeDatePicker } from "../../custom/RangeDatePicker";
import { DateRange } from "react-day-picker";
import { apiFormatDate, formatDateRange } from "@/lib/dateFormat";
import { CardLayout } from "./CardLayout";
import { InfoValue } from "./InfoValue";
import { useInformation } from "@/hooks/raid/useInformation";
import { toDate } from "date-fns";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useTranslations } from "next-intl";

export const RaidDate = () => {
  const { information, updateInformation } = useInformation();
  const t = useTranslations("raid.admin.information");
  const tc = useTranslations("raid.common");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    information?.raid_start_date && information?.raid_end_date
      ? {
          from: toDate(information.raid_start_date),
          to: toDate(information.raid_end_date),
        }
      : undefined,
  );

  function toggleEdit() {
    if (isEdit) {
      setIsLoading(true);
      updateInformation(
        {
          ...information,
          raid_start_date: apiFormatDate(dateRange?.from),
          raid_end_date: apiFormatDate(dateRange?.to),
        },
        () => {
          setIsLoading(false);
          setIsEdit(false);
        },
      );
    } else {
      setIsEdit(!isEdit);
    }
  }

  return (
    <CardLayout label={t("raidDateLabel")}>
      {isEdit ? (
        <>
          <RangeDatePicker dateRange={dateRange} setDateRange={setDateRange} />

          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEdit(false)}
            >
              {tc("cancel")}
            </Button>
            <LoadingButton size="sm" onClick={toggleEdit} isLoading={isLoading}>
              {tc("validate")}
            </LoadingButton>
          </div>
        </>
      ) : (
        <>
          <InfoValue
            isEmpty={
              !information?.raid_start_date || !information?.raid_end_date
            }
            placeholder={t("raidDateEmpty")}
            value={
              information?.raid_start_date && information?.raid_end_date
                ? formatDateRange(
                    information.raid_start_date.toString(),
                    information.raid_end_date.toString(),
                  )
                : ""
            }
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={toggleEdit}
          >
            {tc("edit")}
          </Button>
        </>
      )}
    </CardLayout>
  );
};
