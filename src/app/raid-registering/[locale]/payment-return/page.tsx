"use client";

import { useAuth } from "@/app/authContext";
import { UserShell } from "@/components/raid/home/UserShell";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CircleCheck, Clock3 } from "lucide-react";

const PaymentReturnPage = () => {
  const t = useTranslations("raid.paymentReturn");
  const { isTokenQueried, token } = useAuth();
  const {
    me,
    isLoading: participantLoading,
    refetch: refetchMe,
  } = useMeParticipant();
  const {
    meVolunteer,
    isLoading: volunteerLoading,
    refetchMeVolunteer,
  } = useMeVolunteer();
  const router = useRouter();

  const isParticipantPaid = !!me?.payment;
  const isVolunteerPaid =
    !!meVolunteer && !meVolunteer.cancelled && !!meVolunteer.payment;
  const isPaid = isParticipantPaid || isVolunteerPaid;
  const settled = !participantLoading && !volunteerLoading;

  const verifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!settled || isPaid) return;
    verifyTimer.current = setTimeout(() => {
      void refetchMe();
      void refetchMeVolunteer();
    }, 4000);
    return () => {
      if (verifyTimer.current) clearTimeout(verifyTimer.current);
    };
  }, [settled, isPaid, refetchMe, refetchMeVolunteer]);

  useEffect(() => {
    if (isTokenQueried && token === null) {
      router.replace("/login");
      return;
    }
    if (settled && !me && !meVolunteer) {
      router.replace("/");
    }
  }, [isTokenQueried, token, settled, me, meVolunteer, router]);

  const role = isParticipantPaid ? "participant" : "volunteer";

  return (
    <UserShell>
      <div className="mx-auto max-w-lg pt-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {isPaid ? (
                <CircleCheck className="size-6 text-green-600" />
              ) : (
                <Clock3 className="size-6 text-muted-foreground" />
              )}
              {isPaid ? t("successTitle") : t("pendingTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {!settled && <p>{t("checking")}</p>}
            {settled && isPaid && (
              <>
                <p>{t("successDescription", { role: t(role) })}</p>
                <Button onClick={() => router.push("/")}>
                  {t("backHome")}
                </Button>
              </>
            )}
            {settled && !isPaid && (!!me || !!meVolunteer) && (
              <>
                <p>{t("pendingDescription")}</p>
                <Button variant="outline" onClick={() => router.push("/")}>
                  {t("backHome")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </UserShell>
  );
};

export default PaymentReturnPage;
