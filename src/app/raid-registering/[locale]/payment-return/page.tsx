"use client";

import { UserShell } from "@/components/raid/home/UserShell";
import { useAuth } from "@/app/authContext";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, Clock3 } from "lucide-react";

/**
 * Landing page HelloAsso redirects the payer to after a checkout
 * (`redirection_uri` configured in HELLOASSO_CONFIGURATIONS). HelloAsso can
 * only use one static URL, so this page is locale-less upstream and the UI
 * language is resolved by next-intl (default fr).
 *
 * The payment is NOT confirmed here: confirmation happens server-side in the
 * HelloAsso webhook. This page polls `me` once after a short settle delay so
 * the status card reflects the freshly confirmed payment, and it always tells
 * the truth: if the webhook has not landed yet, we say so instead of
 * claiming success.
 */
const PaymentReturnPage = () => {
  const t = useTranslations("raid.paymentReturn");
  const { isTokenQueried, token } = useAuth();
  const { me, isLoading: participantLoading, refetch: refetchMe } =
    useMeParticipant();
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

  // Give the webhook a short window, then refetch once: if it landed in the
  // meantime the success card replaces the pending one.
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
      // Neither a participant nor a volunteer.
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
                <Button onClick={() => router.push("/")}>{t("backHome")}</Button>
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
