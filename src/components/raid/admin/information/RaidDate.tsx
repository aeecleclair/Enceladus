import { RangeDatePicker } from "../../custom/RangeDatePicker";
import { CardLayout } from "./CardLayout";

import { LoadingButton } from "@/components/common/LoadingButton";
import { useInformation } from "@/hooks/raid/useInformation";
import { apiFormatDate, formatDateRange } from "@/lib/dateFormat";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { toDate } from "date-fns";
import { DateRange } from "react-day-picker";

export const RaidDate = () => {
  const { information, updateInformation } = useInformation();
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
    <CardLayout label="Date du raid">
      {isEdit ? (
        <>
          <RangeDatePicker dateRange={dateRange} setDateRange={setDateRange} />

          <div className="flex flex-row">
            <Button
              variant="outline"
              className="mt-2 mr-2 w-30"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              Annuler
            </Button>
            <LoadingButton
              className="mt-2 w-30"
              onClick={toggleEdit}
              isLoading={isLoading}
            >
              Valider
            </LoadingButton>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">
            {information?.raid_start_date && information?.raid_end_date ? (
              formatDateRange(
                information.raid_start_date.toString(),
                information.raid_end_date.toString(),
              )
            ) : (
              <span>Période non définie</span>
            )}
          </div>
          <Button variant="outline" className="mt-4 w-30" onClick={toggleEdit}>
            Modifier
          </Button>
        </>
      )}
    </CardLayout>
  );
};
