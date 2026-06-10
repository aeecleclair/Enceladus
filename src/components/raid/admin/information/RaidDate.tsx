"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { RangeDatePicker } from "../../custom/RangeDatePicker";
import { DateRange } from "react-day-picker";
import { apiFormatDate, formatDateRange } from "@/lib/dateFormat";
import { CardLayout } from "./CardLayout";
import { InfoValue } from "./InfoValue";
import { useEdition } from "@/hooks/raid/useEdition";
import { useEditions } from "@/hooks/raid/useEditions";
import { toDate } from "date-fns";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useTranslations } from "next-intl";

export const RaidDate = () => {
  const { edition } = useEdition();
  const { updateEdition, isUpdateLoading } = useEditions();
  const t = useTranslations("raid.admin.information");
  const tc = useTranslations("raid.common");
  const [isEdit, setIsEdit] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    edition?.start_date && edition?.end_date
      ? {
          from: toDate(edition.start_date),
          to: toDate(edition.end_date),
        }
      : undefined,
  );

  // Resync local state when the edition refetches (after save, edition switch, etc.).
  useEffect(() => {
    setDateRange(
      edition?.start_date && edition?.end_date
        ? {
            from: toDate(edition.start_date),
            to: toDate(edition.end_date),
          }
        : undefined,
    );
  }, [edition?.start_date, edition?.end_date]);

  const save = () => {
    if (!edition) return;
    updateEdition(
      edition.id,
      {
        start_date: apiFormatDate(dateRange?.from) ?? null,
        end_date: apiFormatDate(dateRange?.to) ?? null,
      },
      () => setIsEdit(false),
    );
  };

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
            <LoadingButton size="sm" onClick={save} isLoading={isUpdateLoading}>
              {tc("validate")}
            </LoadingButton>
          </div>
        </>
      ) : (
        <>
          <InfoValue
            isEmpty={!edition?.start_date || !edition?.end_date}
            placeholder={t("raidDateEmpty")}
            value={
              edition?.start_date && edition?.end_date
                ? formatDateRange(
                    edition.start_date.toString(),
                    edition.end_date.toString(),
                  )
                : ""
            }
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setIsEdit(true)}
            disabled={!edition}
          >
            {tc("edit")}
          </Button>
        </>
      )}
    </CardLayout>
  );
};
