"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DatePicker } from "@/components/common/DatePicker";
import { apiFormatDate, formatDate } from "@/lib/dateFormat";
import { CardLayout } from "./CardLayout";
import { InfoValue } from "./InfoValue";
import { useEdition } from "@/hooks/raid/useEdition";
import { useEditions } from "@/hooks/raid/useEditions";
import { toDate } from "date-fns";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useTranslations } from "next-intl";

export const InscriptionEndDate = () => {
  const { edition } = useEdition();
  const { updateEdition, isUpdateLoading } = useEditions();
  const t = useTranslations("raid.admin.information");
  const tc = useTranslations("raid.common");
  const [isEdit, setIsEdit] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    edition?.registering_end_date
      ? toDate(edition.registering_end_date)
      : undefined,
  );

  // Resync local state when the edition refetches (after save, edition switch, etc.).
  useEffect(() => {
    setDate(
      edition?.registering_end_date
        ? toDate(edition.registering_end_date)
        : undefined,
    );
  }, [edition?.registering_end_date]);

  const save = () => {
    if (!edition) return;
    updateEdition(
      edition.id,
      { registering_end_date: apiFormatDate(date) ?? null },
      () => setIsEdit(false),
    );
  };

  return (
    <CardLayout
      label={t("inscriptionEndLabel")}
      description={t("inscriptionEndDescription")}
    >
      {isEdit ? (
        <>
          <DatePicker date={date} setDate={setDate} />
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
            isEmpty={!edition?.registering_end_date}
            placeholder={t("inscriptionEndEmpty")}
            value={
              edition?.registering_end_date
                ? formatDate(edition.registering_end_date)
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
