"use client";

import { DocumentTab } from "./DocumentTab";
import { InformationTab } from "./InformationTab";
import { PaymentTab } from "./PaymentTab";

import { useAdminTeam } from "@/hooks/raid/useAdminTeam";
import {
  difficulties,
  getLabelFromValue,
  meetingPlaces,
} from "@/lib/raid/comboboxValues";

import { Badge } from "@/components/ui/badge";
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

import { FileText, Info, MapPin, Route, Wallet } from "lucide-react";

interface TeamSheetProps {
  isOpened: boolean;
  onClose: () => void;
  teamId: string;
}

export const TeamSheet = ({ isOpened, onClose, teamId }: TeamSheetProps) => {
  const { team } = useAdminTeam(teamId);
  const isLoading = team?.id !== teamId;
  const progress = team?.validation_progress ?? 0;
  const progressClass =
    progress === 100
      ? "text-emerald-700 dark:text-emerald-400"
      : progress >= 50
        ? "text-amber-700 dark:text-amber-400"
        : "text-muted-foreground";

  return (
    <Sheet open={isOpened} onOpenChange={onClose}>
      <SheetContent side="team" className="flex flex-col gap-0 p-0">
        <SheetHeader className="gap-3 border-b border-border/60 bg-muted/20 px-6 py-5">
          {isLoading ? (
            <>
              <SheetTitle className="text-2xl tracking-tight">
                <Skeleton className="h-7 w-40" />
              </SheetTitle>
              <SheetDescription>
                <Skeleton className="h-4 w-72" />
              </SheetDescription>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            </>
          ) : (
            <>
              <SheetTitle className="text-2xl tracking-tight">
                {team?.name}
              </SheetTitle>
              <SheetDescription>
                Dossier équipe complété à{" "}
                <span className={`font-semibold ${progressClass}`}>
                  {progress.toFixed(0)}%
                </span>
              </SheetDescription>
              <div className="flex flex-wrap gap-2 pt-1">
                {team?.difficulty && (
                  <Badge
                    variant="outline"
                    className="gap-1 bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    <Route className="h-3 w-3" />
                    {getLabelFromValue(difficulties, team.difficulty)}
                  </Badge>
                )}
                {team?.meeting_place && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {getLabelFromValue(meetingPlaces, team.meeting_place)}
                  </Badge>
                )}
                {team && !team.second && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                  >
                    Sans coéquipier
                  </Badge>
                )}
              </div>
            </>
          )}
        </SheetHeader>

        <Tabs defaultValue="information" className="flex-1 overflow-hidden">
          <div className="border-b border-border/60 bg-muted/10 px-6 pt-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="information" className="gap-2">
                <Info className="h-4 w-4" />
                Infos
              </TabsTrigger>
              <TabsTrigger value="document" className="gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-2">
                <Wallet className="h-4 w-4" />
                Paiement
              </TabsTrigger>
            </TabsList>
          </div>
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-220px)]">
              <TabsContent value="information" className="m-0 px-6 py-5">
                {team && <InformationTab team={team} />}
              </TabsContent>
              <TabsContent value="document" className="m-0 px-6 py-5">
                {team && <DocumentTab team={team} />}
              </TabsContent>
              <TabsContent value="payment" className="m-0 px-6 py-5">
                {team && <PaymentTab team={team} />}
              </TabsContent>
            </ScrollArea>
          )}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
