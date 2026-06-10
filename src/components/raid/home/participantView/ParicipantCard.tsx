import { RaidParticipant } from "@/api";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { HiPencil, HiX } from "react-icons/hi";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ParticipantLoading } from "./ParticipantLoading";
// import { PaymentButton } from "./PaymentButton";
import { Checkbox } from "@/components/ui/checkbox";
import { getSituationLabel } from "@/lib/raid/teamUtils";
import { PaymentButton } from "./PaymentButton";
import { usePrice } from "@/hooks/raid/usePrice";
import { ViewEditParticipant } from "./ViewEditParticipant";
import { useTranslations } from "next-intl";

interface ParticipantCardProps {
  participant?: RaidParticipant;
  isCaptain: boolean;
}

export const ParticipantCard = ({
  participant,
  isCaptain,
}: ParticipantCardProps) => {
  const t = useTranslations("raid.team.participantCard");
  const { price } = usePrice();
  const progress = Math.round(participant?.validation_progress ?? 0);
  // const { information } = useInformation();
  const [isEdit, setIsEdit] = useState(false);

  function toggleEdit() {
    setIsEdit(!isEdit);
  }

  return (
    <Card className="w-full flex flex-col justify-between overflow-hidden border-border/70 bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/20">
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-xl tracking-tight">
              {participant?.user?.firstname && participant?.user?.firstname ? (
                participant?.user.firstname + " " + participant?.user.name
              ) : (
                <div className="flex flex-row gap-2">
                  <Skeleton className="w-32 h-8" />
                  <Skeleton className="w-32 h-8" />
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {participant ? (
                <>{isCaptain ? t("captain") :" "}</>
              ) : (
                <Skeleton className="w-24 h-5 mt-1" />
              )}
            </CardDescription>
          </div>
          {isEdit && participant ? (
            <Button
              variant="destructive"
              onClick={toggleEdit}
              className="w-27.5"
            >
              <HiX className="mr-2 h-4 w-4" />
              {t("cancel")}
            </Button>
          ) : (
            <Button variant="outline" onClick={toggleEdit} className="w-27.5">
              <HiPencil className="mr-2 h-4 w-4" />
              {t("edit")}
            </Button>
          )}
        </div>
      </CardHeader>
      {participant ? (
        <ViewEditParticipant
          participant={participant}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      ) : (
        <ParticipantLoading />
      )}
      {!isEdit && (
        <>
          <CardFooter className="w-full border-t border-border/60 bg-muted/5">
            {participant ? (
              <div className="grid p-2 grid-cols-6 items-center w-full">
                <span className="font-semibold text-left my-auto col-span-2">
                  {t("payment")}
                </span>
                {/* When paying by HelloAsso */}
                {/* 
                    {/* {information?.payment_link ? (
                      <Button
                        className="col-span-4 ml-auto w-[100px]"
                        onClick={() => {
                          window.open(information!.payment_link!, "_blank");
                        }}
                      >
                        {"Payer"}
                      </Button> */}
                {!participant?.payment &&
                getSituationLabel(participant?.situation ?? undefined) !==
                  "corporatepartner" ? (
                  <>
                    {(!participant?.payment ||
                      (participant.t_shirt_size &&
                        !participant.t_shirt_payment)) &&
                    getSituationLabel(participant?.situation ?? undefined) !==
                      "corporatepartner" &&
                    !!price?.student_price &&
                    !!price?.external_price &&
                    !!price?.t_shirt_price ? (
                      <PaymentButton />
                    ) : (
                      <span>{t("noLink")}</span>
                    )}
                  </>
                ) : (
                  <Checkbox
                    checked={participant?.payment}
                    disabled
                    className="col-span-4 ml-auto disabled:opacity-100"
                  />
                )}
              </div>
            ) : (
              <div className="grid p-2 grid-cols-6 items-center w-full h-16.25">
                <span className="font-semibold text-left my-auto col-span-2">
                  <Skeleton className="w-32 h-7" />
                </span>
                <Skeleton className="w-64 h-6 col-span-4 ml-auto" />
              </div>
            )}
          </CardFooter>
          {participant ? (
            <div className="border-t border-border/60 bg-muted/10 px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("progress")}
                </span>
                <span className="font-semibold tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2.5 bg-muted" />
            </div>
          ) : (
            <div className="border-t border-border/60 bg-muted/10 px-4 py-3">
              <Skeleton className="mb-2 h-4 w-40" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          )}
        </>
      )}
    </Card>
  );
};
