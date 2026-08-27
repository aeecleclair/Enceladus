"use client";

import { RaidRegistrationStatus } from "@/api";
import { ParticipantDocumentTab } from "@/components/raid/admin/participants/ParticipantDocumentTab";
import { ParticipantInfoTab } from "@/components/raid/admin/teams/teamSheet/ParticipantInfoTab";
import { useAdminParticipant } from "@/hooks/raid/useAdminParticipant";
import { useParticipantLifecycle } from "@/hooks/raid/useParticipantLifecycle";
import { participantStatusClass as statusClass } from "@/lib/raid/participantStatus";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FileText, Info, Users } from "lucide-react";

interface ParticipantSheetProps {
  isOpened: boolean;
  onClose: () => void;
  userId: string | null;
  teamId?: string;
  onOpenTeam?: (teamId: string) => void;
}

export const ParticipantSheet = ({
  isOpened,
  onClose,
  userId,
  teamId,
  onOpenTeam,
}: ParticipantSheetProps) => {
  const { participant, isLoading } = useAdminParticipant(userId);
  const {
    validateParticipant,
    cancelParticipant,
    reopenParticipant,
    isValidateLoading,
    isCancelLoading,
    isReopenLoading,
  } = useParticipantLifecycle();
  const t = useTranslations("raid.admin.participants");
  const ts = useTranslations("raid.admin.participants.sheet");
  const tStatus = useTranslations("raid.common.status");

  const statusLabel: Record<RaidRegistrationStatus, string> = {
    draft: tStatus("draft"),
    submitted: tStatus("submitted"),
    validated: tStatus("validated"),
    cancelled: tStatus("cancelled"),
  };

  return (
    <Sheet open={isOpened} onOpenChange={onClose}>
      <SheetContent side="team" className="flex flex-col gap-0 p-0">
        <SheetHeader className="gap-3 border-b border-border/60 bg-muted/20 px-6 py-5">
          {isLoading || !participant ? (
            <>
              <SheetTitle className="text-2xl tracking-tight">
                <Skeleton className="h-7 w-40" />
              </SheetTitle>
              <SheetDescription>
                <Skeleton className="h-4 w-72" />
              </SheetDescription>
            </>
          ) : (
            <>
              <SheetTitle className="text-2xl tracking-tight">
                {participant.user.firstname} {participant.user.name}
              </SheetTitle>
              <SheetDescription>{participant.user.email}</SheetDescription>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge
                  variant="outline"
                  className={statusClass[participant.status]}
                >
                  {statusLabel[participant.status]}
                </Badge>
                <Badge variant="outline">
                  {participant.payment ? ts("paymentOk") : ts("paymentPending")}
                </Badge>
                {participant.t_shirt_size && (
                  <Badge variant="outline">
                    {participant.t_shirt_payment
                      ? ts("tshirtPaid", { size: participant.t_shirt_size })
                      : ts("tshirtUnpaid", { size: participant.t_shirt_size })}
                  </Badge>
                )}
              </div>
            </>
          )}
        </SheetHeader>

        <Tabs defaultValue="information" className="flex-1 overflow-hidden">
          <div className="border-b border-border/60 bg-muted/10 px-6 pt-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="information" className="gap-2">
                <Info className="h-4 w-4" /> {ts("tabInfo")}
              </TabsTrigger>
              <TabsTrigger value="document" className="gap-2">
                <FileText className="h-4 w-4" /> {ts("tabDocument")}
              </TabsTrigger>
            </TabsList>
          </div>
          {isLoading || !participant ? (
            <div className="p-6">
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-260px)]">
              <TabsContent value="information" className="m-0 px-6 py-5">
                <ParticipantInfoTab participant={participant} />
              </TabsContent>
              <TabsContent value="document" className="m-0 px-6 py-5">
                <ParticipantDocumentTab participant={participant} />
              </TabsContent>
            </ScrollArea>
          )}
        </Tabs>

        <div className="flex flex-wrap gap-2 border-t border-border/60 bg-muted/10 px-6 py-4">
          {participant?.status === "submitted" && (
            <Button
              size="sm"
              onClick={() => validateParticipant(participant.user_id)}
              disabled={isValidateLoading}
            >
              {t("actions.validate")}
            </Button>
          )}
          {participant &&
            (participant.status === "submitted" ||
              participant.status === "validated") && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => reopenParticipant(participant.user_id)}
                disabled={isReopenLoading}
              >
                {t("actions.reopen")}
              </Button>
            )}
          {participant && participant.status !== "cancelled" && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => cancelParticipant(participant.user_id)}
              disabled={isCancelLoading}
            >
              {t("actions.cancel")}
            </Button>
          )}
          {teamId && onOpenTeam && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onOpenTeam(teamId);
              }}
            >
              <Users className="mr-2 h-4 w-4" /> {t("viewTeam")}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
