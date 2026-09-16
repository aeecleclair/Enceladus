import { DatePicker } from "../../../common/DatePicker";
import { CardLayout } from "./CardLayout";

import { LoadingButton } from "@/components/common/LoadingButton";
import { useInformation } from "@/hooks/raid/useInformation";
import { apiFormatDate, formatDate } from "@/lib/dateFormat";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { toDate } from "date-fns";

export const InscriptionEnd = () => {
  const { information, updateInformation } = useInformation();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    information?.raid_registering_end_date
      ? toDate(information.raid_registering_end_date)
      : undefined,
  );
  const t = useTranslations("raid.admin.information");

  function toggleEdit() {
    if (isEdit) {
      setIsLoading(true);
      updateInformation(
        {
          ...information,
          raid_registering_end_date: apiFormatDate(date),
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

  const year = new Date().getFullYear();
  return (
    <CardLayout label={t("inscriptionEndLabel")}>
      {isEdit ? (
        <>
          <DatePicker
            date={date}
            setDate={setDate}
            fromMonth={new Date(year, 0)}
            toMonth={new Date(year + 2, 11)}
          />
          <div className="flex flex-row">
            <Button
              variant="outline"
              className="mt-2 mr-2 w-30"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              {t("priceEditor.cancel")}
            </Button>
            <LoadingButton
              className="mt-2 w-30"
              isLoading={isLoading}
              onClick={toggleEdit}
            >
              {t("priceEditor.validate")}
            </LoadingButton>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">
            {information?.raid_registering_end_date ? (
              formatDate(information.raid_registering_end_date)
            ) : (
              <span>{t("dateNotSet")}</span>
            )}
          </div>
          <Button
            variant="outline"
            className="mt-4 w-30"
            onClick={toggleEdit}
            type="button"
          >
            {t("priceEditor.edit")}
          </Button>
        </>
      )}
    </CardLayout>
  );
};
