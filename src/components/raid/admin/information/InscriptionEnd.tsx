import { DatePicker } from "../../../common/DatePicker";
import { CardLayout } from "./CardLayout";

import { LoadingButton } from "@/components/common/LoadingButton";
import { useInformation } from "@/hooks/raid/useInformation";
import { apiFormatDate, formatDate } from "@/lib/dateFormat";

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
    <CardLayout label="Date de la clôture des inscriptions">
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
              Annuler
            </Button>
            <LoadingButton
              className="mt-2 w-30"
              isLoading={isLoading}
              onClick={toggleEdit}
            >
              Valider
            </LoadingButton>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">
            {information?.raid_registering_end_date ? (
              formatDate(information.raid_registering_end_date)
            ) : (
              <span>Date non définie</span>
            )}
          </div>
          <Button
            variant="outline"
            className="mt-4 w-30"
            onClick={toggleEdit}
            type="button"
          >
            Modifier
          </Button>
        </>
      )}
    </CardLayout>
  );
};
