import { DocumentTab } from "./DocumentTab";
import { InformationTab } from "./InformationTab";
import { PaymentTab } from "./PaymentTab";

import { useAdminTeam } from "@/hooks/raid/useAdminTeam";

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

interface TeamSheetProps {
  isOpened: boolean;
  onClose: () => void;
  teamId: string;
}

export const TeamSheet = ({ isOpened, onClose, teamId }: TeamSheetProps) => {
  const { team } = useAdminTeam(teamId);
  const isLoading = team?.id !== teamId;
  return (
    <Sheet open={isOpened} onOpenChange={onClose}>
      <SheetContent side="team">
        <SheetHeader>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-80" />
            </>
          ) : (
            <>
              <SheetTitle>{team?.name}</SheetTitle>
              <SheetDescription>
                Dossier équipe completé à {team?.validation_progress.toFixed(0)}{" "}
                %
              </SheetDescription>
            </>
          )}
        </SheetHeader>
        <div className="p-4"></div>
        <Tabs defaultValue="information" className="">
          <TabsList className="grid grid-cols-3 w-125">
            <TabsTrigger value="information">Informations</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
          </TabsList>
          {isLoading ? (
            <Skeleton className="h-96 w-3xl mt-6" />
          ) : (
            <ScrollArea className="h-[calc(100vh-180px)] w-full mt-4">
              <TabsContent value="information" className="mt-0">
                {team && <InformationTab team={team} />}
              </TabsContent>
              <TabsContent value="document" className="mt-0">
                {team && <DocumentTab team={team} />}
              </TabsContent>
              <TabsContent value="payment" className="mt-0">
                {team && <PaymentTab team={team} />}
              </TabsContent>
            </ScrollArea>
          )}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
